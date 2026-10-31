import { mkdir } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'
import { drizzle as drizzlePostgres } from 'drizzle-orm/bun-sql'
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite'
import * as schema from './schema'

const databaseUrl = process.env.DATABASE_URL

export const postgresDb = databaseUrl
  ? drizzlePostgres(databaseUrl, { schema })
  : undefined
if (!databaseUrl) await mkdir('data', { recursive: true })
const pgliteClient = databaseUrl ? undefined : await PGlite.create('data/pglite')
export const pgliteDb = pgliteClient
  ? drizzlePglite(pgliteClient, { schema })
  : undefined
export const db = postgresDb ?? pgliteDb!
