'use client'

import {
  Download,
  Share2,
  Printer,
  Bookmark,
  ArrowLeft,
  Clock,
  User,
  Calendar,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'

// Article data keyed by slug — matches the research listing page
const ARTICLES: Record<
  string,
  {
    title: string
    subtitle: string
    category: string
    author: string
    role: string
    date: string
    readTime: string
    content: string[]
    downloads?: string[]
    relatedSlugs?: string[]
  }
> = {
  'ai-transformation-enterprise-2024': {
    title: 'The State of AI Transformation in Enterprise 2024',
    subtitle:
      'Our latest research reveals that while 85% of companies have started AI pilots, only 15% have achieved scale.',
    category: 'Technology Trends',
    author: 'Dr. Michael Chen',
    role: 'Chief AI Strategist',
    date: 'February 24, 2024',
    readTime: '12 min read',
    content: [
      'Enterprise AI implementation is at a critical juncture. After a year of intense experimentation with generative AI, companies are now facing the "pilot purgatory" – the difficult transition from small-scale demonstrations to full enterprise integration.',
      'Our survey of 1,000 global C-suite executives reveals a stark contrast between enthusiasm and execution. While AI is a top-three priority for 90% of organizations, the barriers to scale remain formidable: siloed data, legacy infrastructure, and a significant talent gap.',
      'To overcome these hurdles, leading organizations are adopting a "Platform First" approach. Rather than building bespoke models for single use-cases, they are investing in unified data pipelines and governance frameworks that can support multiple AI applications simultaneously.',
      'This research outlines the five essential pillars of AI transformation that distinguish the "AI Leaders" from those still struggling to find traction.',
    ],
    downloads: ['Full Report (74 pages)', 'Executive Summary', 'Appendix & Data Sets'],
    relatedSlugs: ['rag-vs-fine-tuning', 'security-framework-llms'],
  },
  'security-framework-llms': {
    title: 'Building a Robust Security Framework for LLMs',
    subtitle:
      'Large language models introduce novel attack surfaces. A practical security framework for production deployments.',
    category: 'AI & Machine Learning',
    author: 'Rina Kusuma',
    role: 'Head of AI Security',
    date: 'February 15, 2024',
    readTime: '8 min read',
    content: [
      'Large language models (LLMs) have transformed how enterprises interact with information, but they also introduce entirely new categories of risk. From prompt injection to data exfiltration through model outputs, the attack surface is vast and evolving rapidly.',
      'Our security team has spent the past year analyzing LLM deployments across banking, healthcare, and government sectors. The findings are clear: most organizations lack even basic guardrails around their production LLM systems.',
      'This article presents the Summon Security Framework for LLMs — a practical, layered approach covering input validation, output filtering, model isolation, audit logging, and continuous red-teaming. Each layer is designed to work independently, allowing incremental adoption.',
      'We also share real-world case studies from two financial institutions that implemented these controls and significantly reduced their exposure to adversarial prompts and data leakage incidents.',
    ],
    downloads: ['Security Framework Guide', 'Implementation Checklist'],
    relatedSlugs: ['rag-vs-fine-tuning', 'ai-transformation-enterprise-2024'],
  },
  'future-computer-vision': {
    title: 'The Future of Computer Vision in Manufacturing',
    subtitle:
      'How leading manufacturers are deploying computer vision for quality control, predictive maintenance, and beyond.',
    category: 'Industry Insights',
    author: 'Arief Nugroho',
    role: 'Computer Vision Lead',
    date: 'February 10, 2024',
    readTime: '10 min read',
    content: [
      'Manufacturing is undergoing a visual revolution. With the cost of high-resolution industrial cameras dropping 60% in the last three years, computer vision has become accessible to factories of all sizes.',
      'Our work with Astra International and other manufacturing partners has shown that CV systems can detect defects invisible to the human eye — sub-millimeter cracks, color inconsistencies, and dimensional drift — all in real-time on the production line.',
      'But the real value lies beyond defect detection. Predictive maintenance, powered by visual anomaly detection, can predict equipment failures up to 72 hours in advance, reducing unplanned downtime by 35%.',
      'This article covers the complete lifecycle of deploying CV in manufacturing: from camera selection and edge computing architecture to model training, MLOps, and continuous improvement loops.',
    ],
    downloads: ['CV Deployment Playbook', 'Edge Computing Guide'],
    relatedSlugs: ['ai-transformation-enterprise-2024', 'scalable-data-architectures'],
  },
  'scalable-data-architectures': {
    title: 'Scalable Data Architectures for Multi-tenant Systems',
    subtitle:
      'A deep dive into modern data architectures that support multi-tenancy at scale while maintaining isolation.',
    category: 'Technology Trends',
    author: 'Kevin Sanjaya',
    role: 'Data Architecture Lead',
    date: 'February 5, 2024',
    readTime: '15 min read',
    content: [
      'Multi-tenant architectures are the backbone of modern SaaS platforms, but designing a data layer that balances isolation, performance, and cost at scale remains one of the hardest problems in systems engineering.',
      'In this article, we compare three architectural patterns — siloed databases, shared schema with row-level security, and hybrid approaches — with real-world benchmarks from systems serving 10,000+ tenants.',
      'We also cover the emerging "data mesh" paradigm and how it intersects with multi-tenancy. Rather than centralizing all data, a mesh approach distributes ownership to domain teams while maintaining a unified governance layer.',
      'Finally, we share the Summon Data Pipeline architecture, which processes over 2 billion records daily for multi-tenant clients while maintaining sub-second query latency through intelligent partitioning and caching strategies.',
    ],
    downloads: ['Architecture Blueprint', 'Benchmarking Report'],
    relatedSlugs: ['ai-transformation-enterprise-2024', 'future-computer-vision'],
  },
  'case-study-goto-supply-chain': {
    title: 'Case Study: AI-Powered Supply Chain for GoTo Group',
    subtitle:
      'How Summon helped GoTo Group reduce delivery times by 23% through intelligent route optimization.',
    category: 'Case Studies',
    author: 'Summon Research Team',
    role: 'Applied AI Division',
    date: 'January 28, 2024',
    readTime: '6 min read',
    content: [
      "GoTo Group, one of Southeast Asia's largest technology platforms, faced a growing challenge: delivery times were increasing as their logistics network expanded to cover more regions across Indonesia.",
      "Summon's team deployed a multi-modal optimization engine that combines real-time traffic data, weather forecasts, and historical delivery patterns to dynamically adjust routing for thousands of concurrent deliveries.",
      'Within the first quarter of deployment, average delivery times dropped by 23%, while fuel costs decreased by 15%. The system also improved driver satisfaction by reducing average daily driving distance.',
      'This case study details the technical architecture, the data pipeline that feeds the optimization engine, and the iterative deployment approach that allowed GoTo to roll out changes progressively across their fleet.',
    ],
    downloads: ['Full Case Study'],
    relatedSlugs: ['case-study-mandiri-fraud', 'ai-transformation-enterprise-2024'],
  },
  'ai-governance-sea': {
    title: 'Navigating AI Governance in Southeast Asia',
    subtitle:
      'A comprehensive guide to AI regulation across ASEAN nations for enterprise deployments.',
    category: 'Industry Insights',
    author: 'Dr. Sarah Tan',
    role: 'Policy & Compliance Advisor',
    date: 'January 20, 2024',
    readTime: '14 min read',
    content: [
      'As AI adoption accelerates across Southeast Asia, regulatory frameworks are rapidly evolving. Singapore leads with its Model AI Governance Framework, while Indonesia, Thailand, and the Philippines are developing their own approaches.',
      'For enterprises deploying AI across multiple ASEAN markets, compliance is a moving target. Each country has different requirements for data residency, algorithmic transparency, and bias testing.',
      'This guide provides a country-by-country analysis of current and upcoming AI regulations across the six largest ASEAN economies, with practical recommendations for building compliance into your AI development lifecycle.',
      "We also examine the role of industry self-regulation and certification programs like Singapore's AI Verify, which may become de facto standards across the region.",
    ],
    downloads: ['Governance Guide (84 pages)', 'Country Comparison Matrix'],
    relatedSlugs: ['security-framework-llms', 'ai-transformation-enterprise-2024'],
  },
  'rag-vs-fine-tuning': {
    title: 'RAG vs Fine-Tuning: When to Use Each',
    subtitle:
      'Retrieval-augmented generation and fine-tuning solve different problems. We compare cost, accuracy, and latency.',
    category: 'AI & Machine Learning',
    author: 'Dr. Michael Chen',
    role: 'Chief AI Strategist',
    date: 'January 12, 2024',
    readTime: '9 min read',
    content: [
      'Two dominant approaches have emerged for customizing large language models to enterprise use cases: Retrieval-Augmented Generation (RAG) and fine-tuning. While both aim to make models more accurate for specific domains, they operate on fundamentally different principles.',
      "RAG keeps the base model frozen and supplements it with an external knowledge retrieval system. Fine-tuning modifies the model's weights using domain-specific training data. Each has clear advantages depending on the use case.",
      'Our benchmarks across 12 enterprise deployments show that RAG consistently outperforms fine-tuning for knowledge-intensive tasks where information changes frequently. Fine-tuning excels for domain-specific language patterns and stylistic requirements.',
      'This article includes a decision framework, cost comparison calculator, and deployment architecture patterns for both approaches, along with our recommendation for when to combine them in a hybrid pipeline.',
    ],
    downloads: ['Decision Framework', 'Cost Calculator Spreadsheet'],
    relatedSlugs: ['security-framework-llms', 'ai-transformation-enterprise-2024'],
  },
  'case-study-mandiri-fraud': {
    title: 'Case Study: Bank Mandiri Fraud Detection System',
    subtitle:
      'How Summon Sentinel reduced false positive rates by 40% while catching 99.7% of fraudulent transactions.',
    category: 'Case Studies',
    author: 'Summon Security Team',
    role: 'Applied Security Division',
    date: 'January 5, 2024',
    readTime: '7 min read',
    content: [
      "Bank Mandiri, Indonesia's largest bank by assets, processes over 50 million transactions daily. Their legacy rule-based fraud detection system was generating an unacceptable rate of false positives, causing customer friction and operational overhead.",
      'Summon deployed the Sentinel platform with a behavioural analysis engine trained on 18 months of transaction data. The system uses a multi-layer approach: real-time velocity checks, device fingerprinting, behavioral biometrics, and a gradient-boosted anomaly scoring model.',
      'Results after 6 months: false positive rates dropped from 12.3% to 7.4% (a 40% reduction), while the true positive detection rate increased to 99.7%. This resulted in an estimated Rp 120 billion in prevented fraud losses during the period.',
      "This case study covers the data pipeline architecture, model training approach, integration with the bank's existing transaction processing system, and the phased rollout strategy that minimized operational risk.",
    ],
    downloads: ['Full Case Study', 'Technical Architecture Diagram'],
    relatedSlugs: ['case-study-goto-supply-chain', 'security-framework-llms'],
  },
}

// Lookup helper to find an article title by slug
function getArticleTitle(slug: string): string {
  return ARTICLES[slug]?.title || slug
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const article = ARTICLES[slug]

  // 404 fallback
  if (!article) {
    return (
      <div className="animate-in" style={{ textAlign: 'center', padding: 'var(--sp-16)' }}>
        <h1
          style={{
            fontSize: 'var(--fs-3xl)',
            fontWeight: 'var(--fw-bold)',
            marginBottom: 'var(--sp-4)',
          }}
        >
          Article Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--sp-6)' }}>
          The article you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/research" className="btn btn-primary">
          ← Back to Research
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-in">
      {/* Back Link */}
      <Link
        href="/research"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--sp-2)',
          fontSize: 'var(--fs-sm)',
          fontWeight: 'var(--fw-medium)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--sp-8)',
          textDecoration: 'none',
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Research</span>
      </Link>

      <div style={{ maxWidth: '900px' }}>
        {/* Article Header */}
        <div style={{ marginBottom: 'var(--sp-8)' }}>
          <span
            style={{
              color: 'var(--blue-600)',
              fontWeight: 'var(--fw-bold)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: 'var(--fs-xs)',
              display: 'block',
              marginBottom: 'var(--sp-4)',
            }}
          >
            {article.category}
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--text-primary)',
              lineHeight: 'var(--lh-tight)',
              marginBottom: 'var(--sp-4)',
              letterSpacing: '-0.5px',
            }}
          >
            {article.title}
          </h1>
          <p
            style={{
              fontSize: 'var(--fs-xl)',
              color: 'var(--text-secondary)',
              lineHeight: 'var(--lh-relaxed)',
            }}
          >
            {article.subtitle}
          </p>
        </div>

        {/* Meta Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-8)',
            padding: 'var(--sp-5) 0',
            borderTop: '1px solid var(--border-default)',
            borderBottom: '1px solid var(--border-default)',
            marginBottom: 'var(--sp-8)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <User size={16} style={{ color: 'var(--text-muted)' }} />
            <div>
              <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>
                {article.author}
              </div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                {article.role}
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              fontSize: 'var(--fs-sm)',
              color: 'var(--text-muted)',
            }}
          >
            <Calendar size={16} />
            <span>{article.date}</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              fontSize: 'var(--fs-sm)',
              color: 'var(--text-muted)',
            }}
          >
            <Clock size={16} />
            <span>{article.readTime}</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--sp-2)' }}>
            <button className="btn btn-ghost btn-sm" title="Share">
              <Share2 size={15} />
            </button>
            <button className="btn btn-ghost btn-sm" title="Print">
              <Printer size={15} />
            </button>
            <button className="btn btn-ghost btn-sm" title="Download PDF">
              <Download size={15} />
            </button>
            <button className="btn btn-ghost btn-sm" title="Save">
              <Bookmark size={15} />
            </button>
          </div>
        </div>

        {/* Article + Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 'var(--sp-10)' }}>
          {/* Article Body */}
          <div>
            {article.content.map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: 'var(--fs-md)',
                  color: 'var(--text-primary)',
                  lineHeight: 1.8,
                  marginBottom: 'var(--sp-6)',
                }}
              >
                {p}
              </p>
            ))}

            {/* Download CTA */}
            <div
              style={{
                background: 'var(--blue-600)',
                color: 'white',
                padding: 'var(--sp-8)',
                borderRadius: 'var(--radius-lg)',
                marginTop: 'var(--sp-8)',
              }}
            >
              <h3
                style={{
                  fontSize: 'var(--fs-xl)',
                  fontWeight: 'var(--fw-bold)',
                  marginBottom: 'var(--sp-2)',
                }}
              >
                Download the Full Research
              </h3>
              <p style={{ opacity: 0.9, marginBottom: 'var(--sp-6)', fontSize: 'var(--fs-md)' }}>
                Get the comprehensive analysis, including detailed charts and actionable frameworks.
              </p>
              <button
                className="btn btn-primary"
                style={{ background: 'white', color: 'var(--blue-600)', borderColor: 'white' }}
              >
                <Download size={15} />
                Download PDF
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            {article.downloads && article.downloads.length > 0 && (
              <div className="card" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-6)' }}>
                <h4
                  style={{
                    fontSize: 'var(--fs-xs)',
                    fontWeight: 'var(--fw-bold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    marginBottom: 'var(--sp-4)',
                  }}
                >
                  Downloads
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                  {article.downloads.map((item) => (
                    <a
                      key={item}
                      href="#"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        color: 'var(--blue-600)',
                        fontSize: 'var(--fs-sm)',
                        fontWeight: 'var(--fw-medium)',
                        textDecoration: 'none',
                      }}
                    >
                      <FileText size={16} />
                      <span>{item}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {article.relatedSlugs && article.relatedSlugs.length > 0 && (
              <div className="card" style={{ padding: 'var(--sp-5)' }}>
                <h4
                  style={{
                    fontSize: 'var(--fs-xs)',
                    fontWeight: 'var(--fw-bold)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    marginBottom: 'var(--sp-4)',
                  }}
                >
                  Related Research
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                  {article.relatedSlugs.map((slug) => (
                    <Link key={slug} href={`/research/${slug}`} style={{ textDecoration: 'none' }}>
                      <div>
                        <h5
                          style={{
                            fontSize: 'var(--fs-sm)',
                            fontWeight: 'var(--fw-semibold)',
                            color: 'var(--text-primary)',
                            marginBottom: '2px',
                            lineHeight: 'var(--lh-tight)',
                          }}
                        >
                          {getArticleTitle(slug)}
                        </h5>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                          {ARTICLES[slug]?.readTime || 'Read more'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
