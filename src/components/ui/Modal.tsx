'use client'

import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  maxWidth?: string
  noPadding?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = '600px',
  noPadding = false,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (typeof document === 'undefined' || !isOpen) {
    return null
  }

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClose()
        } else if (e.key === 'Escape') {
          e.preventDefault()
          onClose()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Close modal"
    >
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
        style={{
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          cursor: 'default',
          ...(noPadding ? { padding: 0, overflow: 'hidden' } : {}),
        }}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
