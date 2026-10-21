import { Gemini, LlmAgent, InMemorySessionService, Runner } from '@google/adk'
import { z } from 'zod'

const providerSchema = z.enum(['gemini', 'openrouter', 'openai-compatible'])

export function modelConfiguration(env: NodeJS.ProcessEnv = process.env) {
  const selectedProvider = providerSchema.safeParse(env.MODEL_PROVIDER ?? 'gemini')
  if (!selectedProvider.success) {
    throw new Error('MODEL_PROVIDER must be gemini, openrouter, or openai-compatible')
  }
  const provider = selectedProvider.data
  let baseUrl: string | null = null
  if (provider !== 'gemini') {
    const configuredUrl = env.MODEL_BASE_URL ?? ''
    let url: URL
    try {
      url = new URL(configuredUrl)
    } catch {
      throw new Error('MODEL_BASE_URL is required and must be an absolute http(s) API root')
    }
    if (
      !/^https?:\/\//i.test(configuredUrl) ||
      url.username || url.password || url.href.includes('?') || url.href.includes('#')
    ) {
      throw new Error('MODEL_BASE_URL must use http(s) without credentials, query, or fragment')
    }
    baseUrl = url.href.replace(/\/+$/, '')
  }
  if (provider === 'openai-compatible' && !env.MODEL_CRITICAL?.trim()) {
    throw new Error('MODEL_CRITICAL is required when MODEL_PROVIDER=openai-compatible')
  }
  // Preserve the existing provider defaults; compatible endpoints choose their own model.
  const defaultModel = provider === 'openrouter' ? 'google/gemini-3.7-flash' : 'gemini-3.7-flash'
  const critical = env.MODEL_CRITICAL ?? defaultModel
  const fast = env.MODEL_FAST ?? (provider === 'openai-compatible' ? critical : defaultModel)
  const layout = env.MODEL_LAYOUT ?? critical
  const compare = env.MODEL_COMPARE ?? critical
  for (const [name, model] of Object.entries({ critical, fast, layout, compare })) {
    if (!model.trim()) throw new Error(`MODEL_${name.toUpperCase()} must not be empty`)
  }
  // A cap avoids reserving the provider's entire output budget per request.
  const maxOutputTokens = Number(env.MODEL_MAX_OUTPUT_TOKENS ?? 32_768)
  if (!Number.isSafeInteger(maxOutputTokens) || maxOutputTokens <= 0) {
    throw new Error('MODEL_MAX_OUTPUT_TOKENS must be a positive finite integer')
  }
  return {
    baseUrl,
    compare,
    critical,
    fast,
    interactionsApi: provider === 'gemini' && (env.USE_INTERACTIONS_API ?? 'true') === 'true',
    layout,
    maxOutputTokens,
    provider,
  }
}

const configuration = modelConfiguration()
export const MODEL_PROVIDER = configuration.provider
export const MODEL_CRITICAL = configuration.critical
export const MODEL_FAST = configuration.fast
export const MODEL_LAYOUT = configuration.layout
export const MODEL_COMPARE = configuration.compare

export function makeModel(name: string): Gemini | string {
  return configuration.interactionsApi
    ? new Gemini({ model: name, useInteractionsApi: true })
    : name
}

// The Interactions API path does not enforce response schemas server-side,
// so agents also carry an explicit JSON-only instruction and we tolerate a
// stray prose wrapper by extracting the outermost JSON object.
// Models on the unenforced Interactions path strongly prefer compact
// [x, y] coordinate arrays; accept both dialects and normalize to {x, y}.
export const llmPointSchema = z.union([
  z.object({ x: z.number(), y: z.number() }).strict(),
  z
    .tuple([z.number(), z.number()])
    .transform(([x, y]) => ({ x, y })),
])

export const JSON_ONLY =
  '\n\nRespond with ONLY the JSON object matching the required schema — no markdown fences, no prose before or after.'

export function parseAgentJson<T extends z.ZodType>(
  schema: T,
  text: string,
  agentName: string,
): z.infer<T> {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end <= start) {
    throw new Error(`${agentName} returned invalid JSON output`)
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(text.slice(start, end + 1))
  } catch {
    throw new Error(`${agentName} returned invalid JSON output`)
  }
  const result = schema.safeParse(parsed)
  if (!result.success) {
    const issues = result.error.issues
      .slice(0, 3)
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ')
    console.error(
      `[${agentName}] schema-invalid output (${issues}). Raw head/tail:`,
      text.slice(0, 300),
      '…',
      text.slice(-200),
    )
    throw new Error(`${agentName} returned schema-invalid output: ${issues}`)
  }
  return result.data
}

export type MessagePart =
  | { inlineData: { data: string; mimeType: string } }
  | { text: string }

const compatibleResponseSchema = z.object({
  choices: z.array(z.object({
    finish_reason: z.string().nullable().optional(),
    message: z.object({ content: z.string().nullable().optional() }).optional(),
  })).optional(),
  error: z.object({ message: z.string().optional() }).optional(),
})

export async function runOpenAICompatibleTurn(options: {
  agentName: string
  instruction: string
  model: string
  parts: MessagePart[]
}): Promise<string> {
  const { baseUrl, maxOutputTokens, provider } = modelConfiguration()
  if (!baseUrl) {
    throw new Error('Select MODEL_PROVIDER=openai-compatible or openrouter for a compatible model turn')
  }
  const apiKey = (process.env.MODEL_API_KEY ||
    (provider === 'openrouter' ? process.env.OPENROUTER_API_KEY : undefined))?.trim()
  if (!apiKey) {
    throw new Error(
      `MODEL_API_KEY is required when MODEL_PROVIDER=${provider}`,
    )
  }
  const response = await fetch(`${baseUrl}/chat/completions`, {
    body: JSON.stringify({
      max_completion_tokens: maxOutputTokens,
      messages: [
        { content: options.instruction, role: 'system' },
        {
          content: options.parts.map((part) =>
            'text' in part
              ? { text: part.text, type: 'text' }
              : {
                  image_url: {
                    url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                  },
                  type: 'image_url',
                },
          ),
          role: 'user',
        },
      ],
      model: options.model,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal: AbortSignal.timeout(10 * 60_000),
  })
  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new Error(
      `${options.agentName} model API returned non-JSON (HTTP ${response.status})`,
    )
  }
  const result = compatibleResponseSchema.safeParse(body)
  if (!response.ok || (result.success && result.data.error)) {
    const message = result.success ? result.data.error?.message : undefined
    throw new Error(
      `${options.agentName} model API error ${response.status}: ${(message || response.statusText).replaceAll(apiKey, '[redacted]')}`,
    )
  }
  if (!result.success) throw new Error(`${options.agentName} model API returned invalid response JSON`)
  const choice = result.data.choices?.[0]
  if (choice?.finish_reason === 'length') {
    throw new Error(`${options.agentName} output was truncated (finish_reason=length); increase MODEL_MAX_OUTPUT_TOKENS or reduce the request`)
  }
  if (choice?.finish_reason === 'content_filter') {
    throw new Error(`${options.agentName} output was blocked by the provider (finish_reason=content_filter)`)
  }
  const text = choice?.message?.content
  if (!text?.trim()) throw new Error(`${options.agentName} returned no output`)
  return text
}

// Every model call is billable: count and log them so a run's spend is
// always visible in the server log.
let llmCallCount = 0

/** Runs one configured model turn and returns its final text output. */
export async function runAgentTurn(options: {
  adkAgent: LlmAgent
  agentName: string
  instruction: string
  parts: MessagePart[]
}): Promise<string> {
  llmCallCount += 1
  const images = options.parts.filter((part) => 'inlineData' in part).length
  console.log(
    `[llm] call #${llmCallCount}: ${options.agentName} (${images} image${images === 1 ? '' : 's'})`,
  )
  if (MODEL_PROVIDER !== 'gemini') {
    const configuredModel = options.adkAgent.model
    const model =
      typeof configuredModel === 'string'
        ? configuredModel
        : configuredModel?.model
    if (!model) throw new Error(`${options.agentName} has no configured model`)
    return runOpenAICompatibleTurn({ ...options, model })
  }
  const runner = new Runner({
    agent: options.adkAgent,
    appName: 'dots',
    sessionService: new InMemorySessionService(),
  })
  let finalText = ''
  for await (const event of runner.runEphemeral({
    newMessage: { parts: options.parts },
    userId: 'dots',
  })) {
    if (event.errorMessage) {
      throw new Error(`${options.agentName} error: ${event.errorMessage}`)
    }
    const text = event.content?.parts?.map((p) => p.text ?? '').join('')
    if (text) finalText = text
  }
  if (!finalText) throw new Error(`${options.agentName} returned no output`)
  return finalText
}
