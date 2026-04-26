import QuotesClient from './QuotesClient'
import { requireRole } from '@/lib/auth/session'
import { getCachedVendorQuotes } from '@/lib/data/vendors'

export default async function MyQuotesPage() {
  const user = await requireRole('VENDOR')
  const quotes = await getCachedVendorQuotes(user.id)
  return <QuotesClient quotes={quotes} />
}
