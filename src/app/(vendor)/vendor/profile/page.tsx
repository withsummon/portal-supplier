import VendorProfileClient from './VendorProfileClient'
import { requireRole } from '@/lib/auth/session'
import { getCachedVendorEditableProfile } from '@/lib/data/profiles'

export default async function VendorProfilePage() {
  const user = await requireRole('VENDOR')
  const vendor = await getCachedVendorEditableProfile(user.id)

  if (!vendor) {
    return (
      <div style={{ padding: 'var(--sp-20)', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 'var(--fs-xl)',
            fontWeight: 'var(--fw-bold)',
            marginBottom: 'var(--sp-2)',
          }}
        >
          Vendor profile not found
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Unable to load vendor profile data.</p>
      </div>
    )
  }

  return <VendorProfileClient vendor={vendor} />
}
