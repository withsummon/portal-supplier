'use client'

import { useState, useTransition } from 'react'
import { addProjectComment } from '@/lib/actions/projects'
import type { ProjectCommentDto } from '@/lib/data/project-workflows'

export function useProjectComments(projectId: string, initialComments: ProjectCommentDto[]) {
  const [comments, setComments] = useState(initialComments)
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  function sendComment() {
    const nextMessage = message.trim()
    if (!nextMessage) {
      return
    }

    startTransition(() => {
      void addProjectComment({ projectId, message: nextMessage }).then((comment) => {
        setComments((current) => [comment, ...current])
        setMessage('')
      })
    })
  }

  return {
    comments,
    isPending,
    message,
    sendComment,
    setMessage,
  }
}
