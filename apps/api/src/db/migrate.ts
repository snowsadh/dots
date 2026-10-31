import { migrate as migratePostgres } from 'drizzle-orm/bun-sql/migrator'
import { migrate as migratePglite } from 'drizzle-orm/pglite/migrator'
import { pgliteDb, postgresDb } from '.'

if (postgresDb) {
  await migratePostgres(postgresDb, { migrationsFolder: './drizzle' })
  await postgresDb.$client.close()
} else if (pgliteDb) {
  await migratePglite(pgliteDb, { migrationsFolder: './drizzle' })
  await pgliteDb.$client.close()
}
