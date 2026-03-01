import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@planmydream/database/schema'

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function useDB() {
  if (_db) return _db

  const config = useRuntimeConfig()

  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is not configured')
  }

  const client = postgres(config.databaseUrl, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  })

  _db = drizzle(client, {
    schema,
    logger: process.env.NODE_ENV === 'development',
  })

  return _db
}
