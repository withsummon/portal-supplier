'use client'

import { useMemo, useState, useTransition } from 'react'
import { addProjectComment, submitVendorProjectQuote } from '@/lib/actions/projects'
import type {
  ProjectCommentDto,
  ProjectQuoteDto,
  VendorProjectDetailDto,
} from '@/lib/data/project-workflows'

interface QuoteDraft {
  amount: string
  duration: string
  proposal: string
}

export function useVendorProjectDetail(initialProject: VendorProjectDetailDto) {
  const [comments, setComments] = useState(initialProject.comments)
  const [existingQuote, setExistingQuote] = useState<ProjectQuoteDto | null>(
    initialProject.existingQuote,
  )
  const [showBidForm, setShowBidForm] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [quoteDraft, setQuoteDraft] = useState<QuoteDraft>({
    amount: initialProject.existingQuote ? String(initialProject.existingQuote.amount) : '',
    duration: initialProject.existingQuote ? String(initialProject.existingQuote.duration) : '',
    proposal: initialProject.existingQuote?.proposal ?? '',
  })
  const [activeTab, setActiveTab] = useState<'details' | 'deliverables' | 'tech'>('details')
  const [isPending, startTransition] = useTransition()

  const orderedComments = useMemo(
    () =>
      [...comments].sort(
        (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
      ),
    [comments],
  )

  function submitBid() {
    const amount = Number(quoteDraft.amount)
    const duration = Number(quoteDraft.duration)
    const proposal = quoteDraft.proposal.trim()

    if (!amount || !duration || !proposal) {
      return
    }

    startTransition(() => {
      void submitVendorProjectQuote({
        projectId: initialProject.id,
        amount,
        currency: 'USD',
        duration,
        proposal,
      }).then((quote) => {
        setExistingQuote(quote)
        setShowBidForm(false)
      })
    })
  }

  function sendMessage() {
    const message = newMessage.trim()
    if (!message) {
      return
    }

    startTransition(() => {
      void addProjectComment({ projectId: initialProject.id, message }).then((comment) => {
        setComments((current) => [...current, comment])
        setNewMessage('')
      })
    })
  }

  return {
    activeTab,
    comments: orderedComments,
    existingQuote,
    isPending,
    newMessage,
    quoteDraft,
    sendMessage,
    setActiveTab,
    setNewMessage,
    setQuoteDraft,
    setShowBidForm,
    setShowChat,
    showBidForm,
    showChat,
    submitBid,
  }
}
