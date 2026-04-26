'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { submitProjectWithFiles } from '@/lib/actions/projects'

export interface SubmitProjectFormState {
  projectName: string
  clientName: string
  category: string
  description: string
  requirements: string
  deliverables: string[]
  techStack: string[]
  startDate: string
  endDate: string
  budgetRange: string
  priority: 'low' | 'medium' | 'high' | 'critical' | ''
  files: File[]
  currency: string
}

const INITIAL_STATE: SubmitProjectFormState = {
  projectName: '',
  clientName: '',
  category: '',
  description: '',
  requirements: '',
  deliverables: [],
  techStack: [],
  startDate: '',
  endDate: '',
  budgetRange: '',
  priority: '',
  files: [],
  currency: 'IDR',
}

export function useSubmitProject() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<SubmitProjectFormState>(INITIAL_STATE)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function updateField<K extends keyof SubmitProjectFormState>(
    key: K,
    value: SubmitProjectFormState[K],
  ) {
    setFormData((current) => ({ ...current, [key]: value }))
  }

  function nextStep() {
    setStep((current) => Math.min(current + 1, 4))
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0))
  }

  function submit() {
    setError(null)

    startTransition(() => {
      void submitProjectWithFiles({
        name: formData.projectName,
        clientName: formData.clientName,
        category: formData.category,
        description: formData.description,
        requirements: formData.requirements,
        deliverables: formData.deliverables,
        techStack: formData.techStack,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budgetRange: formData.budgetRange,
        budgetCurrency: formData.currency,
        priority: formData.priority || 'medium',
        files: formData.files,
      })
        .then((project) => {
          router.push(`/projects/${project.id}`)
        })
        .catch((submitError: unknown) => {
          setError(submitError instanceof Error ? submitError.message : 'Failed to submit project.')
        })
    })
  }

  return {
    error,
    formData,
    isPending,
    nextStep,
    previousStep,
    setStep,
    step,
    submit,
    updateField,
  }
}
