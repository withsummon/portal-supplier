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

export type SubmitProjectFieldErrors = Partial<Record<keyof SubmitProjectFormState, string>>

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
  const [fieldErrors, setFieldErrors] = useState<SubmitProjectFieldErrors>({})
  const [isPending, startTransition] = useTransition()

  function updateField<K extends keyof SubmitProjectFormState>(
    key: K,
    value: SubmitProjectFormState[K],
  ) {
    setError(null)
    setFieldErrors((current) => ({ ...current, [key]: '' }))
    setFormData((current) => ({ ...current, [key]: value }))
  }

  function validateStep(currentStep: number) {
    const errors: SubmitProjectFieldErrors = {}
    if (currentStep === 0) {
      if (!formData.projectName.trim()) errors.projectName = 'Project name is required.'
      if (!formData.clientName.trim()) errors.clientName = 'Client name is required.'
      if (!formData.category) errors.category = 'Project category is required.'
      if (!formData.description.trim()) errors.description = 'Brief description is required.'
    }

    if (currentStep === 1 && !formData.requirements.trim()) {
      errors.requirements = 'Detailed requirements are required.'
    }

    if (currentStep === 2) {
      if (!formData.startDate) errors.startDate = 'Expected start date is required.'
      if (!formData.endDate) errors.endDate = 'Expected end date is required.'
      if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
        errors.endDate = 'Expected end date must be after the start date.'
      }
      if (!formData.budgetRange) errors.budgetRange = 'Budget range is required.'
      if (!formData.priority) errors.priority = 'Priority level is required.'
    }

    return errors
  }

  function firstError(errors: SubmitProjectFieldErrors) {
    return Object.values(errors).find(Boolean) ?? null
  }

  function nextStep() {
    const errors = validateStep(step)
    const validationError = firstError(errors)
    if (validationError) {
      setError(validationError)
      setFieldErrors(errors)
      return
    }

    setError(null)
    setFieldErrors({})
    setStep((current) => Math.min(current + 1, 4))
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0))
  }

  function submit() {
    for (const targetStep of [0, 1, 2]) {
      const errors = validateStep(targetStep)
      const validationError = firstError(errors)
      if (validationError) {
        setStep(targetStep)
        setError(validationError)
        setFieldErrors(errors)
        return
      }
    }

    setError(null)
    setFieldErrors({})
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
    fieldErrors,
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
