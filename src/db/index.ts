import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined
  db: ReturnType<typeof drizzle<typeof schema>> | undefined
}

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required')
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })
}

function createDb(pool: Pool) {
  return drizzle(pool, {
    schema,
    logger: process.env.NODE_ENV === 'development',
  })
}

const pool = globalForDb.pool ?? createPool()
const db = globalForDb.db ?? createDb(pool)

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool
  globalForDb.db = db
}

export { db, pool }
export * from './schema'
