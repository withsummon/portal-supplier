import { type FullConfig } from '@playwright/test'

/**
 * Global setup runs once before all tests.
 * Verifies the dev server is running.
 */
export default async function globalSetup(_config: FullConfig) {
  const url = process.env.BASE_URL || 'http://localhost:3000'
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) {
      console.warn(`Global setup: ${url} returned ${res.status}`)
    }
  } catch (e) {
    throw new Error(`Dev server not running at ${url}. Run 'bun run dev' first.`)
  }
  console.log('Global setup complete')
}
