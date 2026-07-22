'use client'

import { useState, useTransition } from 'react'
import { updateAdminProfile } from '@/lib/actions/profiles'
import type { AdminProfileDto } from '@/lib/data/profiles'

const defaultPreferences = {
  emailNotifications: true,
  projectUpdates: true,
  weeklyReports: true,
}

export function useAdminProfileForm(profile: AdminProfileDto) {
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    department: profile.department,
    role: profile.role,
  })
  const [preferences, setPreferences] = useState({
    ...defaultPreferences,
    ...profile.preferences,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(profile.image)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function updateField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updatePreference(key: keyof typeof preferences, value: boolean) {
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  function setNextImage(file: File | null) {
    setImageFile(file)
    if (!file) return

    const fileReader = new FileReader()
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        setImagePreview(fileReader.result)
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

    for (const [key, value] of Object.entries(preferences)) {
      formData.set(key, String(value))
    }

    if (imageFile) {
      formData.set('image', imageFile)
    }

    startTransition(() => {
      void updateAdminProfile(formData).then(() => {
        setMessage('Profile saved.')
      })
    })
  }

  return {
    form,
    imagePreview,
    isPending,
    message,
    preferences,
    setNextImage,
    submit,
    updateField,
    updatePreference,
  }
}
