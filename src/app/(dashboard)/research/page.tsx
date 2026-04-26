'use client';

import { Clock, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const CATEGORIES = ['All', 'AI & Machine Learning', 'Technology Trends', 'Industry Insights', 'Case Studies'];

const ARTICLES = [
    {
        title: 'The State of AI Transformation in Enterprise 2024',
        slug: 'ai-transformation-enterprise-2024',
        category: 'Technology Trends',
        type: 'Report',
        date: 'February 24, 2024',
        readTime: '12 min read',
        excerpt: 'Our latest research reveals that while 85% of companies have started AI pilots, only 15% have achieved scale. Learn the 5 pillars of successful AI transformation.',
        cover: '/assets/research/cover-1.png',
    },
    {
        title: 'Building a Robust Security Framework for LLMs',
        slug: 'security-framework-llms',
        category: 'AI & Machine Learning',
        type: 'Article',
        date: 'February 15, 2024',
        readTime: '8 min read',
        excerpt: 'Large language models introduce new attack surfaces. We break down a practical security framework for production LLM deployments.',
        cover: '/assets/research/cover-2.png',
    },
    {
        title: 'The Future of Computer Vision in Manufacturing',
        slug: 'future-computer-vision',
        category: 'Industry Insights',
        type: 'Article',
        date: 'February 10, 2024',
        readTime: '10 min read',
        excerpt: 'How leading manufacturers are deploying computer vision for quality control, predictive maintenance, and supply chain optimization.',
        cover: '/assets/research/cover-3.png',
    },
    {
        title: 'Scalable Data Architectures for Multi-tenant Systems',
        slug: 'scalable-data-architectures',
        category: 'Technology Trends',
        type: 'Article',
        date: 'February 5, 2024',
        readTime: '15 min read',
        excerpt: 'A deep dive into modern data architectures that support multi-tenancy at scale while maintaining isolation and performance.',
        cover: '/assets/research/cover-4.png',
    },
    {
        title: 'Case Study: AI-Powered Supply Chain for GoTo Group',
        slug: 'case-study-goto-supply-chain',
        category: 'Case Studies',
        type: 'Case Study',
        date: 'January 28, 2024',
        readTime: '6 min read',
        excerpt: 'How Summon helped GoTo Group reduce delivery times by 23% through intelligent route optimization and demand forecasting.',
        cover: '/assets/research/ai-transformation-hero.png',
    },
    {
        title: 'Navigating AI Governance in Southeast Asia',
        slug: 'ai-governance-sea',
        category: 'Industry Insights',
        type: 'Report',
        date: 'January 20, 2024',
        readTime: '14 min read',
        excerpt: 'A comprehensive guide to AI regulation across ASEAN nations. What enterprises need to know before deploying AI solutions.',
        cover: '/assets/research/cover-1.png',
    },
    {
        title: 'RAG vs Fine-Tuning: When to Use Each',
        slug: 'rag-vs-fine-tuning',
        category: 'AI & Machine Learning',
        type: 'Article',
        date: 'January 12, 2024',
        readTime: '9 min read',
        excerpt: 'Retrieval-augmented generation and fine-tuning solve different problems. We compare cost, accuracy, and latency tradeoffs.',
        cover: '/assets/research/cover-2.png',
    },
    {
        title: 'Case Study: Bank Mandiri Fraud Detection System',
        slug: 'case-study-mandiri-fraud',
        category: 'Case Studies',
        type: 'Case Study',
        date: 'January 5, 2024',
        readTime: '7 min read',
        excerpt: 'How Summon Sentinel reduced false positive rates by 40% while catching 99.7% of fraudulent transactions for Indonesia\'s largest bank.',
        cover: '/assets/research/cover-3.png',
    },
];

export default function ResearchBlog() {
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered = activeCategory === 'All'
        ? ARTICLES
        : ARTICLES.filter((a) => a.category === activeCategory);

    return (
        <div className="animate-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Research & Insights</h1>
                    <p className="page-subtitle">Thought leadership from the Summon AI engineering team.</p>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="tabs" style={{ marginBottom: 'var(--sp-8)' }}>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        className={`tab ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Section Label */}
            <div style={{
                fontSize: 'var(--fs-xs)',
                fontWeight: 'var(--fw-semibold)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                marginBottom: 'var(--sp-5)',
            }}>
                {activeCategory === 'All' ? 'All Insights' : activeCategory} — {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
            </div>

            {/* Article Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--sp-6)',
            }}>
                {filtered.map((article) => (
                    <Link
                        key={article.slug}
                        href={`/research/${article.slug}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            transition: 'transform 200ms ease',
                        }}>
                            {/* Cover Image */}
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '4/3',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                marginBottom: 'var(--sp-4)',
                                background: 'var(--neutral-100)',
                            }}>
                                <Image
                                    src={article.cover}
                                    alt={article.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>

                            {/* Type Badge */}
                            <div style={{
                                fontSize: 'var(--fs-xs)',
                                fontWeight: 'var(--fw-semibold)',
                                color: 'var(--blue-600)',
                                marginBottom: 'var(--sp-2)',
                            }}>
                                {article.type} — {article.category}
                            </div>

                            {/* Title */}
                            <h3 style={{
                                fontSize: 'var(--fs-md)',
                                fontWeight: 'var(--fw-bold)',
                                lineHeight: 'var(--lh-tight)',
                                color: 'var(--text-primary)',
                                marginBottom: 'var(--sp-3)',
                            }}>
                                {article.title}
                            </h3>

                            {/* Date + Excerpt */}
                            <p style={{
                                fontSize: 'var(--fs-sm)',
                                color: 'var(--text-secondary)',
                                lineHeight: 'var(--lh-relaxed)',
                            }}>
                                <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{article.date}</span> — {article.excerpt}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="empty-state" style={{ padding: 'var(--sp-16)' }}>
                    <div className="empty-state-icon">
                        <Bookmark size={24} />
                    </div>
                    <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)' }}>No articles found</h3>
                    <p className="text-sm text-secondary" style={{ marginTop: 'var(--sp-2)' }}>Try selecting a different category.</p>
                </div>
            )}
        </div>
    );
}
