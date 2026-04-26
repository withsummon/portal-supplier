'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, FolderOpen, BookOpen, Cpu, ArrowRight } from 'lucide-react'

export interface CommandBarProject {
  id: string
  name: string
  projectId: string
  clientName?: string | null
}

const RESEARCH_ARTICLES = [
  {
    title: 'The State of AI Transformation in Enterprise 2024',
    slug: 'ai-transformation-enterprise-2024',
  },
  { title: 'Building a Robust Security Framework for LLMs', slug: 'security-framework-llms' },
  { title: 'The Future of Computer Vision in Manufacturing', slug: 'future-computer-vision' },
  {
    title: 'Scalable Data Architectures for Multi-tenant Systems',
    slug: 'scalable-data-architectures',
  },
  {
    title: 'Case Study: AI-Powered Supply Chain for GoTo Group',
    slug: 'case-study-goto-supply-chain',
  },
  { title: 'Navigating AI Governance in Southeast Asia', slug: 'ai-governance-sea' },
  { title: 'RAG vs Fine-Tuning: When to Use Each', slug: 'rag-vs-fine-tuning' },
  { title: 'Case Study: Bank Mandiri Fraud Detection System', slug: 'case-study-mandiri-fraud' },
]

const FACTORY_PRODUCTS = [
  { name: 'Summon AI Assistant', id: 'assistant' },
  { name: 'Summon Smart Chatbot', id: 'chatbot' },
  { name: 'Summon Data Pipeline', id: 'pipeline' },
  { name: 'Summon Vision', id: 'vision' },
  { name: 'Summon Analytics Hub', id: 'analytics' },
  { name: 'Summon Sentinel', id: 'sentinel' },
]

interface SearchResult {
  type: 'project' | 'research' | 'factory'
  title: string
  subtitle: string
  href: string
}

interface CommandBarProps {
  projects: CommandBarProject[]
}

export default function CommandBar({ projects }: CommandBarProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const updateOpenState = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      setQuery('')
      setSelectedIndex(0)
    }

    setOpen(nextOpen)
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        updateOpenState(!open)
      }
      if (e.key === 'Escape') updateOpenState(false)
    },
    [open, updateOpenState],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (!open) return

    const timeoutId = window.setTimeout(() => inputRef.current?.focus(), 50)

    return () => window.clearTimeout(timeoutId)
  }, [open])

  const results: SearchResult[] = []

  if (query.trim().length > 0) {
    const q = query.toLowerCase()

    // Projects
    projects
      .filter((p) => p.name.toLowerCase().includes(q) || p.projectId.toLowerCase().includes(q))
      .forEach((p) =>
        results.push({
          type: 'project',
          title: p.name,
          subtitle: `${p.projectId} · ${p.clientName ?? ''}`,
          href: `/projects/${p.id}`,
        }),
      )

    // Research
    RESEARCH_ARTICLES.filter((a) => a.title.toLowerCase().includes(q)).forEach((a) =>
      results.push({
        type: 'research',
        title: a.title,
        subtitle: 'Research Blog',
        href: `/research/${a.slug}`,
      }),
    )

    // Factory
    FACTORY_PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)).forEach((p) =>
      results.push({
        type: 'factory',
        title: p.name,
        subtitle: 'Summon Factory',
        href: '/factory',
      }),
    )
  }

  const navigate = (href: string) => {
    updateOpenState(false)
    router.push(href)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      navigate(results[selectedIndex].href)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FolderOpen size={15} style={{ color: 'var(--blue-600)' }} />
      case 'research':
        return <BookOpen size={15} style={{ color: 'var(--color-purple)' }} />
      case 'factory':
        return <Cpu size={15} style={{ color: 'var(--color-success)' }} />
      default:
        return <Search size={15} />
    }
  }

  if (!open) return null

  return (
    <div
      className="modal-backdrop"
      onClick={() => updateOpenState(false)}
      style={{ alignItems: 'flex-start', paddingTop: '20vh' }}
    >
      <div className="command-bar" onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className="command-bar-input-wrapper">
          <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search projects, research, and factory products..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleInputKeyDown}
            className="command-bar-input"
          />
          <kbd className="command-bar-kbd">ESC</kbd>
        </div>

        {/* Results */}
        {query.trim().length > 0 && (
          <div className="command-bar-results">
            {results.length > 0 ? (
              results.map((r, i) => (
                <div
                  key={`${r.type}-${r.href}-${i}`}
                  className={`command-bar-item${i === selectedIndex ? ' selected' : ''}`}
                  onClick={() => navigate(r.href)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <div className="command-bar-item-icon">{getIcon(r.type)}</div>
                  <div className="command-bar-item-text">
                    <div className="command-bar-item-title">{r.title}</div>
                    <div className="command-bar-item-subtitle">{r.subtitle}</div>
                  </div>
                  <ArrowRight
                    size={12}
                    style={{ color: 'var(--text-muted)', opacity: i === selectedIndex ? 1 : 0 }}
                  />
                </div>
              ))
            ) : (
              <div className="command-bar-empty">
                <Search
                  size={20}
                  style={{ color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}
                />
                <span>No results for &ldquo;{query}&rdquo;</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="command-bar-footer">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  )
}
