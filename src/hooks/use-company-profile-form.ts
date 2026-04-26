'use client'

import { useMemo, useState, useTransition } from 'react'
import { updateSellerProfile, updateVendorProfile } from '@/lib/actions/profiles'
import type { CompanyProfileDto } from '@/lib/data/profiles'

export function useCompanyProfileForm(profile: CompanyProfileDto) {
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    companyName: profile.companyName,
    industry: profile.industry,
    companySize: profile.companySize,
    website: profile.website,
    description: profile.description,
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState(profile.logoUrl ?? profile.image)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const tierLabel = useMemo(
    () => `${profile.tier.charAt(0)}${profile.tier.slice(1).toLowerCase()}`,
    [profile.tier],
  )

  function updateField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function setNextLogo(file: File | null) {
    setLogoFile(file)
    if (!file) return

    const fileReader = new FileReader()
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        setLogoPreview(fileReader.result)
      }
    }
    fileReader.readAsDataURL(file)
  }

  function submit() {
    setMessage(null)
    const formData = new FormData()

    for (const [key, value] of Object.entries(form)) {
      formData.set(key, value)
    }

    if (logoFile) {
      formData.set('logo', logoFile)
    }

    startTransition(() => {
      const action =
        profile.role === 'SELLER' ? updateSellerProfile(formData) : updateVendorProfile(formData)

      void action.then(() => {
        setMessage('Profile saved.')
      })
    })
  }

  return {
    form,
    isPending,
    logoPreview,
    message,
    setNextLogo,
    submit,
    tierLabel,
    updateField,
  }
}
