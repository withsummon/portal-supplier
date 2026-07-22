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
    setError(null)
    setFormData((current) => ({ ...current, [key]: value }))
  }

  function validateStep(currentStep: number) {
    if (currentStep === 0) {
      if (!formData.projectName.trim()) return 'Project name is required.'
      if (!formData.clientName.trim()) return 'Client name is required.'
      if (!formData.category) return 'Project category is required.'
      if (!formData.description.trim()) return 'Brief description is required.'
    }

    if (currentStep === 1 && !formData.requirements.trim()) {
      return 'Detailed requirements are required.'
    }

    if (currentStep === 2) {
      if (!formData.startDate) return 'Expected start date is required.'
      if (!formData.endDate) return 'Expected end date is required.'
      if (!formData.budgetRange) return 'Budget range is required.'
      if (!formData.priority) return 'Priority level is required.'
    }

    return null
  }

  function nextStep() {
    const validationError = validateStep(step)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setStep((current) => Math.min(current + 1, 4))
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0))
  }

  function submit() {
    const validationError = validateStep(0) ?? validateStep(1) ?? validateStep(2)
    if (validationError) {
      setError(validationError)
      return
    }

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
        budgetCurrency: 'IDR',
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
