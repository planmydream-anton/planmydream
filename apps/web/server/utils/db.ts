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
    max: 10, // Max connections in pool
    idle_timeout: 20, // Idle connection timeout in seconds
    connect_timeout: 10, // Connection timeout in seconds
  })

  _db = drizzle(client, { 
    schema,
    logger: process.env.NODE_ENV === 'development',
  })

  return _db
}

// Экспорт для удобного использования
export const db = {
  get instance() {
    return useDB()
  },
  select: (...args: Parameters<ReturnType<typeof useDB>['select']>) => useDB().select(...args),
  insert: (...args: Parameters<ReturnType<typeof useDB>['insert']>) => useDB().insert(...args),
  update: (...args: Parameters<ReturnType<typeof useDB>['update']>) => useDB().update(...args),
  delete: (...args: Parameters<ReturnType<typeof useDB>['delete']>) => useDB().delete(...args),
}
