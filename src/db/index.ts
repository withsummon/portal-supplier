import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined
  db: ReturnType<typeof drizzle<typeof schema>> | undefined
}

type Db = ReturnType<typeof drizzle<typeof schema>>

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

function getPool() {
  if (!globalForDb.pool) {
    globalForDb.pool = createPool()
  }

  return globalForDb.pool
}

function getDb() {
  if (!globalForDb.db) {
    globalForDb.db = createDb(getPool())
  }

  return globalForDb.db
}

function lazy<T extends object>(getValue: () => T): T {
  return new Proxy({} as T, {
    get(_target, property) {
      const value = Reflect.get(getValue(), property)
      return typeof value === 'function' ? value.bind(getValue()) : value
    },
  })
}

const pool = lazy<Pool>(getPool)
const db = lazy<Db>(getDb)

export { db, pool }
export * from './schema'
