import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test'
import { z } from 'zod'
import { modelConfiguration, parseAgentJson, runOpenAICompatibleTurn } from './llm'

const envNames = [
  'MODEL_PROVIDER', 'MODEL_BASE_URL', 'MODEL_API_KEY', 'OPENROUTER_API_KEY',
  'MODEL_CRITICAL', 'MODEL_FAST', 'MODEL_LAYOUT', 'MODEL_COMPARE',
  'MODEL_MAX_OUTPUT_TOKENS', 'USE_INTERACTIONS_API',
] as const
const originalEnv = Object.fromEntries(envNames.map((name) => [name, process.env[name]]))
const originalFetch = globalThis.fetch
const options = {
  agentName: 'Test agent',
  instruction: 'Return JSON.',
  model: 'selected-model',
  parts: [{ text: 'Inspect this.' }],
}

beforeEach(() => {
  for (const name of envNames) delete process.env[name]
  process.env.MODEL_PROVIDER = 'openai-compatible'
  process.env.MODEL_BASE_URL = 'https://api.openai.com/v1'
  process.env.MODEL_CRITICAL = 'selected-model'
  process.env.MODEL_API_KEY = 'test-key'
})

afterEach(() => {
  for (const name of envNames) {
    if (originalEnv[name] === undefined) delete process.env[name]
    else process.env[name] = originalEnv[name]
  }
  globalThis.fetch = originalFetch
})

describe('model configuration', () => {
  test('preserves Gemini defaults and the legacy OpenRouter model defaults', () => {
    expect(modelConfiguration({})).toEqual({
      baseUrl: null,
      compare: 'gemini-3.7-flash',
      critical: 'gemini-3.7-flash',
      fast: 'gemini-3.7-flash',
      interactionsApi: true,
      layout: 'gemini-3.7-flash',
      maxOutputTokens: 32_768,
      provider: 'gemini',
    })
    const legacy = modelConfiguration({
      MODEL_PROVIDER: 'openrouter',
      MODEL_BASE_URL: 'https://openrouter.ai/api/v1/',
      MODEL_CRITICAL: 'critical-model',
    })
    expect(legacy.fast).toBe('google/gemini-3.7-flash')
    expect(legacy.layout).toBe('critical-model')
    expect(legacy.baseUrl).toBe('https://openrouter.ai/api/v1')
    expect(legacy.interactionsApi).toBe(false)
  })

  test('requires the compatible model and lets every role inherit or override it', () => {
    expect(() => modelConfiguration({
      MODEL_PROVIDER: 'openai-compatible',
      MODEL_BASE_URL: 'https://api.openai.com/v1',
    })).toThrow('MODEL_CRITICAL is required')
    const inherited = modelConfiguration({
      MODEL_PROVIDER: 'openai-compatible',
      MODEL_BASE_URL: 'https://api.openai.com/v1',
      MODEL_CRITICAL: 'critical-model',
    })
    expect(inherited.fast).toBe('critical-model')
    expect(inherited.layout).toBe('critical-model')
    expect(inherited.compare).toBe('critical-model')
    expect(modelConfiguration({
      MODEL_PROVIDER: 'openai-compatible',
      MODEL_BASE_URL: 'https://api.openai.com/v1',
      MODEL_CRITICAL: 'critical-model',
      MODEL_FAST: 'fast-model',
      MODEL_LAYOUT: 'layout-model',
      MODEL_COMPARE: 'compare-model',
    })).toMatchObject({ fast: 'fast-model', layout: 'layout-model', compare: 'compare-model' })
  })

  test('rejects unknown providers and empty role models', () => {
    expect(() => modelConfiguration({ MODEL_PROVIDER: 'unknown' })).toThrow('MODEL_PROVIDER must be')
    for (const name of ['MODEL_CRITICAL', 'MODEL_FAST', 'MODEL_LAYOUT', 'MODEL_COMPARE']) {
      expect(() => modelConfiguration({ [name]: ' ' })).toThrow(`${name} must not be empty`)
    }
  })

  test.each([
    undefined, '', '/v1', 'not-a-url', 'ftp://example.com/v1', 'https:api.openai.com/v1',
    'https://user:secret@example.com/v1', 'https://example.com/v1?api_key=secret',
    'https://example.com/v1#secret',
  ])('rejects an invalid or secret-bearing model base URL: %s', (baseUrl) => {
    expect(() => modelConfiguration({
      MODEL_PROVIDER: 'openrouter',
      MODEL_BASE_URL: baseUrl,
    })).toThrow('MODEL_BASE_URL')
  })

  test('accepts an explicit local HTTP API root without requiring a key at startup', () => {
    const config = modelConfiguration({
      MODEL_PROVIDER: 'openai-compatible',
      MODEL_BASE_URL: 'http://127.0.0.1:8000/v1/',
      MODEL_CRITICAL: 'local-model',
      MODEL_API_KEY: 'secret',
    })
    expect(config.baseUrl).toBe('http://127.0.0.1:8000/v1')
    expect(JSON.stringify(config)).not.toContain('secret')
    delete process.env.MODEL_API_KEY
    expect(() => modelConfiguration()).not.toThrow()
  })

  test.each(['', '0', '-1', '1.5', 'not-a-number', 'Infinity', 'NaN', '1e309', '1e100'])(
    'rejects an invalid output cap: %s',
    (maxOutputTokens) => {
      expect(() => modelConfiguration({
        MODEL_MAX_OUTPUT_TOKENS: maxOutputTokens,
      })).toThrow('MODEL_MAX_OUTPUT_TOKENS must be a positive finite integer')
    },
  )
})

describe('OpenAI-compatible model turn', () => {
  test.each([
    'https://openrouter.ai/api/v1',
    'https://openrouter.ai/api/v1/',
    'https://api.openai.com/v1',
    'https://api.openai.com/v1/',
  ])('uses the configured API root and preserves ordered multimodal messages: %s', async (baseUrl) => {
    process.env.MODEL_BASE_URL = baseUrl
    process.env.MODEL_MAX_OUTPUT_TOKENS = '2048'
    let requestUrl: string | undefined
    let requestInit: RequestInit | undefined
    globalThis.fetch = mock(async (input, init) => {
      requestUrl = String(input)
      requestInit = init
      return Response.json({
        choices: [{ finish_reason: 'stop', message: { content: '{"ok":true}' } }],
      })
    }) as unknown as typeof fetch

    const result = await runOpenAICompatibleTurn({
      ...options,
      parts: [
        { text: 'IMAGE 1:' },
        { inlineData: { data: 'cGxhbg==', mimeType: 'image/png' } },
        { text: 'IMAGE 2:' },
        { inlineData: { data: 'b3ZlcmxheQ==', mimeType: 'image/jpeg' } },
        { text: 'IMAGE 3:' },
        { inlineData: { data: 'cmVuZGVy', mimeType: 'image/webp' } },
        { text: 'Inspect all images.' },
      ],
    })

    expect(result).toBe('{"ok":true}')
    expect(requestUrl).toBe(`${baseUrl.replace(/\/$/, '')}/chat/completions`)
    expect(requestInit?.method).toBe('POST')
    expect(new Headers(requestInit?.headers).get('Authorization')).toBe('Bearer test-key')
    expect(new Headers(requestInit?.headers).get('Content-Type')).toBe('application/json')
    expect(JSON.parse(String(requestInit?.body))).toEqual({
      model: 'selected-model',
      max_completion_tokens: 2048,
      messages: [
        { content: 'Return JSON.', role: 'system' },
        { content: [
          { text: 'IMAGE 1:', type: 'text' },
          { image_url: { url: 'data:image/png;base64,cGxhbg==' }, type: 'image_url' },
          { text: 'IMAGE 2:', type: 'text' },
          { image_url: { url: 'data:image/jpeg;base64,b3ZlcmxheQ==' }, type: 'image_url' },
          { text: 'IMAGE 3:', type: 'text' },
          { image_url: { url: 'data:image/webp;base64,cmVuZGVy' }, type: 'image_url' },
          { text: 'Inspect all images.', type: 'text' },
        ], role: 'user' },
      ],
    })
  })

  test('uses the legacy key alias only for the explicit openrouter provider', async () => {
    delete process.env.MODEL_API_KEY
    process.env.OPENROUTER_API_KEY = 'legacy-key'
    const fetchMock = mock(async (_input: unknown, init?: RequestInit) => {
      expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer legacy-key')
      return Response.json({ choices: [{ message: { content: '{"ok":true}' } }] })
    })
    globalThis.fetch = fetchMock as unknown as typeof fetch
    await expect(runOpenAICompatibleTurn(options)).rejects.toThrow('MODEL_API_KEY is required')
    expect(fetchMock).not.toHaveBeenCalled()
    process.env.MODEL_PROVIDER = 'openrouter'
    await expect(runOpenAICompatibleTurn(options)).resolves.toBe('{"ok":true}')
  })

  test('prefers the generic key over the legacy alias', async () => {
    process.env.MODEL_PROVIDER = 'openrouter'
    process.env.OPENROUTER_API_KEY = 'unused-key'
    globalThis.fetch = mock(async (_input, init) => {
      expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-key')
      return Response.json({ choices: [{ message: { content: 'output' } }] })
    }) as unknown as typeof fetch
    expect(await runOpenAICompatibleTurn(options)).toBe('output')
  })

  test.each(['MODEL_API_KEY', 'MODEL_BASE_URL', 'MODEL_MAX_OUTPUT_TOKENS'])(
    'rejects invalid %s before sending a request',
    async (name) => {
      process.env[name] = ''
      const fetchMock = mock(async () => Response.json({}))
      globalThis.fetch = fetchMock as unknown as typeof fetch
      await expect(runOpenAICompatibleTurn(options)).rejects.toThrow(name)
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )

  test.each([
    [{ choices: [] }, 'returned no output'],
    [{ choices: [{}] }, 'returned no output'],
    [{ choices: [{ message: { content: null } }] }, 'returned no output'],
    [{ choices: [{ message: { content: ' ' } }] }, 'returned no output'],
    [null, 'invalid response JSON'],
    [{ choices: 'invalid' }, 'invalid response JSON'],
    [{ choices: [{ message: { content: '{"ok":true}' }, finish_reason: 'length' }] }, 'output was truncated'],
    [{ choices: [{ message: { content: '{"ok":true}' }, finish_reason: 'content_filter' }] }, 'output was blocked'],
    [{ error: { message: 'upstream failed' } }, 'upstream failed'],
  ])('rejects incomplete or malformed provider output: %j', async (body, expectedError) => {
    globalThis.fetch = mock(async () => Response.json(body)) as unknown as typeof fetch
    await expect(runOpenAICompatibleTurn(options)).rejects.toThrow(String(expectedError))
  })

  test('surfaces provider HTTP failures and redacts the configured secret', async () => {
    globalThis.fetch = mock(async () => Response.json({
      error: { message: 'Invalid credential test-key' },
    }, { status: 401 })) as unknown as typeof fetch
    try {
      await runOpenAICompatibleTurn(options)
      throw new Error('Expected the provider request to fail')
    } catch (error) {
      expect(String(error)).toContain('model API error 401: Invalid credential [redacted]')
      expect(String(error)).not.toContain('test-key')
    }
  })

  test.each([200, 502])('surfaces non-JSON responses with HTTP status %s', async (status) => {
    globalThis.fetch = mock(async () => new Response('<html>not JSON</html>', { status })) as unknown as typeof fetch
    await expect(runOpenAICompatibleTurn(options)).rejects.toThrow(`non-JSON (HTTP ${status})`)
  })

  test('keeps local JSON parsing and schema validation for compatible output', () => {
    const schema = z.object({ ok: z.literal(true) }).strict()
    expect(parseAgentJson(schema, '```json\n{"ok":true}\n```', 'Test agent')).toEqual({ ok: true })
    expect(() => parseAgentJson(schema, 'not JSON', 'Test agent')).toThrow('invalid JSON output')
    expect(() => parseAgentJson(schema, '{broken}', 'Test agent')).toThrow('invalid JSON output')
    const errorLog = spyOn(console, 'error').mockImplementation(() => {})
    try {
      expect(() => parseAgentJson(schema, '{"ok":false}', 'Test agent')).toThrow('schema-invalid output')
    } finally {
      errorLog.mockRestore()
    }
  })
})
