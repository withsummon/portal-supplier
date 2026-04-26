'use client';

import { Book, CheckCircle, Star, TrendingUp, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const featuredArticles = [
    {
        id: 'feat-1',
        title: 'Mastering Project Submissions',
        desc: 'Learn how to structure your project submissions for faster admin approval.',
        icon: Star,
        color: 'var(--blue-600)',
        bg: 'var(--blue-50)',
        readTime: '5 min read'
    },
    {
        id: 'feat-2',
        title: 'Compliance & Safety Guidelines',
        desc: 'Essential standards for all vendors and sellers on the Summon platform.',
        icon: CheckCircle,
        color: 'var(--color-success)',
        bg: 'var(--color-success-bg)',
        readTime: '8 min read'
    }
];

const mostRead = [
    { id: 'mr-1', title: 'Setting up your company profile', views: '1.2k views' },
    { id: 'mr-2', title: 'Payment cycles and invoicing', views: '950 views' },
    { id: 'mr-3', title: 'Communicating with Summon Admins', views: '820 views' },
    { id: 'mr-4', title: 'Document standards for attachments', views: '740 views' },
];

const mostUseful = [
    { id: 'mu-1', title: 'Project Status Definitions', rating: '4.9/5' },
    { id: 'mu-2', title: 'Troubleshooting login issues', rating: '4.8/5' },
    { id: 'mu-3', title: 'API Integration Basics', rating: '4.7/5' },
];

export default function WikiPage() {
    return (
        <div className="animate-in">
            <div style={{ marginBottom: 'var(--sp-8)' }}>
                <h1 style={{ fontSize: 'var(--fs-3xl)', marginBottom: 'var(--sp-2)' }}>Summon Wiki</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome to the knowledge hub. Find articles and guides to help you use the portal effectively.</p>
            </div>

            {/* Featured Section */}
            <div style={{ marginBottom: 'var(--sp-10)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                    <Star size={18} color="var(--blue-600)" />
                    <h2 style={{ fontSize: 'var(--fs-xl)' }}>Featured Articles</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--sp-5)' }}>
                    {featuredArticles.map((article) => {
                        const Icon = article.icon;
                        return (
                            <div key={article.id} className="card" style={{ padding: 'var(--sp-6)', cursor: 'pointer', transition: 'transform 0.2s', borderLeft: `4px solid ${article.color}` }}>
                                <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: 'var(--radius-lg)',
                                        background: article.bg, display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', flexShrink: 0
                                    }}>
                                        <Icon size={24} color={article.color} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-2)' }}>
                                            <h3 style={{ fontSize: 'var(--fs-lg)' }}>{article.title}</h3>
                                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'var(--fw-bold)' }}>{article.readTime}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--sp-4)', lineHeight: '1.5' }}>
                                            {article.desc}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: article.color, fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-bold)' }}>
                                            Read Article <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-8)' }}>
                {/* Most Read */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                        <TrendingUp size={18} color="var(--color-purple)" />
                        <h2 style={{ fontSize: 'var(--fs-xl)' }}>Most Read</h2>
                    </div>
                    <div className="card">
                        <div style={{ padding: 'var(--sp-2)' }}>
                            {mostRead.map((item, idx) => (
                                <div key={item.id} style={{
                                    padding: 'var(--sp-4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottom: idx === mostRead.length - 1 ? 'none' : '1px solid var(--border-default)',
                                    cursor: 'pointer'
                                }} className="sidebar-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                        <span style={{ color: 'var(--text-muted)', fontWeight: 'var(--fw-bold)', width: '20px' }}>{idx + 1}</span>
                                        <span style={{ fontWeight: 'var(--fw-medium)' }}>{item.title}</span>
                                    </div>
                                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{item.views}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Most Useful */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                        <HelpCircle size={18} color="var(--color-success)" />
                        <h2 style={{ fontSize: 'var(--fs-xl)' }}>Most Useful</h2>
                    </div>
                    <div className="card">
                        <div style={{ padding: 'var(--sp-2)' }}>
                            {mostUseful.map((item, idx) => (
                                <div key={item.id} style={{
                                    padding: 'var(--sp-4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottom: idx === mostUseful.length - 1 ? 'none' : '1px solid var(--border-default)',
                                    cursor: 'pointer'
                                }} className="sidebar-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                        <Book size={16} color="var(--color-success)" />
                                        <span style={{ fontWeight: 'var(--fw-medium)' }}>{item.title}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Star size={12} fill="var(--color-warning)" color="var(--color-warning)" />
                                        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{item.rating}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Support CTA */}
            <div style={{
                marginTop: 'var(--sp-12)',
                padding: 'var(--sp-8)',
                background: 'var(--blue-900)',
                borderRadius: 'var(--radius-xl)',
                color: 'white',
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: 'var(--sp-2)' }}>Still need help?</h2>
                <p style={{ opacity: 0.8, marginBottom: 'var(--sp-6)' }}>Our support team is available 24/7 to help you with any platform issues.</p>
                <button className="btn btn-primary btn-lg" style={{ background: 'white', color: 'var(--blue-900)', border: 'none' }}>
                    Contact Support
                </button>
            </div>
        </div>
    );
}
