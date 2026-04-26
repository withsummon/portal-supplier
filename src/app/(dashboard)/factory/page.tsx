'use client';

import {
    Cpu,
    Database,
    Eye,
    BarChart3,
    Shield,
    MessageSquareText,
    Search,
    ChevronRight,
    ChevronLeft,
    X,
    CheckCircle2,
    Building2,
    ArrowRight,
    MessageCircle,
    Briefcase,
    FileSliders
} from 'lucide-react';
import { useState, useEffect } from 'react';

const PRODUCTS = [
    {
        id: 'assistant',
        name: 'Summon AI Assistant',
        category: 'conversational-ai',
        description: 'Enterprise conversational AI for customer support and internal knowledge management. Built on RAG architecture.',
        longDescription: 'Summon AI Assistant is our flagship conversational AI platform, purpose-built for high-stakes enterprise environments. It uses proprietary Retrieval-Augmented Generation (RAG) architecture to deliver accurate, context-aware responses grounded in your client\'s own data. Designed for deployment across customer support, HR helpdesks, and internal knowledge bases.',
        features: ['Multi-language support (ID, EN, JP, etc.)', 'Context-aware reasoning with RAG', 'Seamless CRM & ticketing integration', 'SLA-backed 99.9% uptime', 'Custom knowledge base training', 'Real-time analytics dashboard'],
        useCases: ['Enterprise customer support automation', 'Internal knowledge management', 'HR & IT helpdesk', 'Multilingual sales support'],
        clients: ['Telkom Indonesia', 'Bank Mandiri', 'GoTo Group'],
        icon: Cpu,
        iconBg: 'var(--blue-50)',
        iconColor: 'var(--blue-600)',
        badge: 'NEW',
        images: ['/assets/factory/ai-assistant-1.png', '/assets/factory/ai-assistant-2.png'],
        pitchDeckPdf: '/assets/factory/pitch-ai-assistant.pdf',
    },
    {
        id: 'chatbot',
        name: 'Summon Smart Chatbot',
        category: 'conversational-ai',
        description: 'Lightweight chatbot for lead qualification, FAQ handling, and appointment scheduling across channels.',
        longDescription: 'A lightweight, omnichannel chatbot designed for small-to-medium sales teams. It handles lead qualification, FAQ responses, and appointment scheduling across WhatsApp, Line, and web chat. Quick to deploy with pre-built templates.',
        features: ['Omnichannel (WhatsApp, Line, Web)', 'Pre-built conversation templates', 'Lead scoring & qualification', 'Calendar integration', 'No-code flow builder', 'Webhook & API integration'],
        useCases: ['Lead qualification for sales teams', 'Customer FAQ handling', 'Appointment scheduling', 'Event registration'],
        clients: ['Astra International', 'Tokopedia'],
        icon: MessageSquareText,
        iconBg: 'var(--color-info-bg)',
        iconColor: 'var(--color-info)',
        images: ['/assets/factory/chatbot-1.png', '/assets/factory/chatbot-2.png'],
        pitchDeckPdf: '/assets/factory/pitch-chatbot.pdf',
    },
    {
        id: 'pipeline',
        name: 'Summon Data Pipeline',
        category: 'infrastructure',
        description: 'End-to-end data processing platform. Automates ingestion, transformation, and analysis for enterprise migrations.',
        longDescription: 'Summon Data Pipeline is an end-to-end data processing platform that automates ingestion, transformation, and analysis. Ideal for large-scale enterprise data migrations, regulatory reporting, and building the data foundation for AI initiatives.',
        features: ['Real-time & batch streaming', 'Automated data cleaning & validation', 'Regulatory compliance auto-checks', 'Pre-built ETL connectors (50+)', 'Data lineage tracking', 'Multi-cloud support (AWS, GCP, Azure)'],
        useCases: ['Enterprise data migration', 'Real-time analytics pipelines', 'Regulatory reporting', 'Data lake consolidation'],
        clients: ['Bank Mandiri', 'Telkom Indonesia'],
        icon: Database,
        iconBg: 'var(--color-purple-bg)',
        iconColor: 'var(--color-purple)',
        images: ['/assets/factory/pipeline-1.png', '/assets/factory/pipeline-2.png'],
        pitchDeckPdf: '/assets/factory/pitch-pipeline.pdf',
    },
    {
        id: 'vision',
        name: 'Summon Vision',
        category: 'computer-vision',
        description: 'Computer vision for quality inspection and security. Detects anomalies with sub-millimeter precision in manufacturing.',
        longDescription: 'Summon Vision brings AI-powered visual intelligence to manufacturing and security environments. With sub-millimeter defect detection, predictive maintenance alerts, and edge computing optimization, it integrates directly into existing production lines.',
        features: ['Real-time defect detection', 'Predictive maintenance alerts', 'Edge computing optimized', 'Custom model training', 'Integration with SCADA/PLC systems', 'Dashboard with anomaly heatmaps'],
        useCases: ['Manufacturing quality control', 'Security & access monitoring', 'Predictive maintenance', 'Supply chain visual inspection'],
        clients: ['Astra International'],
        icon: Eye,
        iconBg: 'var(--color-success-bg)',
        iconColor: 'var(--color-success)',
        images: ['/assets/factory/vision-1.png', '/assets/factory/vision-2.png'],
        pitchDeckPdf: '/assets/factory/pitch-vision.pdf',
    },
    {
        id: 'analytics',
        name: 'Summon Analytics Hub',
        category: 'analytics',
        description: 'Business intelligence dashboards with AI-powered insights. Real-time KPI tracking and anomaly detection.',
        longDescription: 'Summon Analytics Hub transforms raw data into actionable insights with AI-powered dashboards. It provides real-time KPI tracking, automated anomaly detection, and natural language querying — so business users can ask questions without writing SQL.',
        features: ['AI-powered insight generation', 'Natural language querying', 'Real-time KPI dashboards', 'Automated anomaly detection', 'Scheduled report generation', 'Role-based access control'],
        useCases: ['Executive dashboards', 'Sales performance tracking', 'Financial reporting', 'Marketing analytics'],
        clients: ['GoTo Group', 'Tokopedia'],
        icon: BarChart3,
        iconBg: 'var(--color-warning-bg)',
        iconColor: 'var(--color-warning)',
        images: ['/assets/factory/analytics-1.png', '/assets/factory/analytics-2.png'],
        pitchDeckPdf: '/assets/factory/pitch-analytics.pdf',
    },
    {
        id: 'sentinel',
        name: 'Summon Sentinel',
        category: 'security',
        description: 'AI-driven cybersecurity monitoring. Detects threats in real-time using behavioral analysis and anomaly detection.',
        longDescription: 'Summon Sentinel is an AI-driven cybersecurity platform that provides real-time threat detection using behavioral analysis and machine learning. It monitors network traffic, user behavior, and system logs to identify and respond to threats before they cause damage.',
        features: ['Real-time threat detection', 'Behavioral analysis engine', 'Automated incident response', 'SIEM integration', 'Compliance reporting (ISO 27001)', 'Threat intelligence feeds'],
        useCases: ['SOC operations', 'Fraud detection', 'Network security monitoring', 'Compliance auditing'],
        clients: ['Bank Mandiri', 'Telkom Indonesia'],
        icon: Shield,
        iconBg: 'var(--color-danger-bg)',
        iconColor: 'var(--color-danger)',
        images: ['/assets/factory/security-1.png'],
        pitchDeckPdf: '/assets/factory/pitch-security.pdf',
    },
];

const TRUSTED_BY = ['Telkom Indonesia', 'Bank Mandiri', 'Astra International', 'GoTo Group', 'Tokopedia'];

export default function FactoryPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
    const [portfolio, setPortfolio] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('summon-portfolio');
            if (stored) {
                const items = JSON.parse(stored) as { id: string }[];
                setPortfolio(items.map(i => i.id));
            }
        } catch { /* empty */ }
    }, []);

    const togglePortfolio = (product: typeof PRODUCTS[0], e: React.MouseEvent) => {
        e.stopPropagation();
        setPortfolio(prev => {
            const isIn = prev.includes(product.id);
            const next = isIn ? prev.filter(id => id !== product.id) : [...prev, product.id];
            // Sync full items to localStorage
            try {
                const stored = localStorage.getItem('summon-portfolio');
                let items: typeof PRODUCTS = stored ? JSON.parse(stored) : [];
                if (isIn) {
                    items = items.filter(i => i.id !== product.id);
                } else {
                    items.push({
                        id: product.id,
                        name: product.name,
                        category: product.category,
                        description: product.description,
                        iconBg: product.iconBg,
                        iconColor: product.iconColor,
                    } as typeof PRODUCTS[0]);
                }
                localStorage.setItem('summon-portfolio', JSON.stringify(items));
            } catch { /* empty */ }
            return next;
        });
    };

    // Dynamic categories with accurate counts
    const categories = [
        { id: 'all', label: 'All Products', count: PRODUCTS.length },
        { id: 'saved', label: 'Saved', count: portfolio.length },
        { id: 'conversational-ai', label: 'Conversational AI', count: PRODUCTS.filter(p => p.category === 'conversational-ai').length },
        { id: 'infrastructure', label: 'Infrastructure', count: PRODUCTS.filter(p => p.category === 'infrastructure').length },
        { id: 'computer-vision', label: 'Computer Vision', count: PRODUCTS.filter(p => p.category === 'computer-vision').length },
        { id: 'analytics', label: 'Analytics & BI', count: PRODUCTS.filter(p => p.category === 'analytics').length },
        { id: 'security', label: 'Security', count: PRODUCTS.filter(p => p.category === 'security').length },
    ];

    const filtered = PRODUCTS.filter((p) => {
        const matchesCategory = activeCategory === 'all' || 
            (activeCategory === 'saved' ? portfolio.includes(p.id) : p.category === activeCategory);
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const activeCategoryLabel = categories.find((c) => c.id === activeCategory)?.label || 'All Products';

    return (
        <div className="animate-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Summon Factory</h1>
                    <p className="page-subtitle">Browse & resell Summon&apos;s enterprise AI solutions to your clients.</p>
                </div>
            </div>

            {/* Search */}
            <div style={{ marginBottom: 'var(--sp-6)' }}>
                <div className="header-search" style={{ maxWidth: '400px', background: 'white' }}>
                    <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search products by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
            </div>

            {/* Main Layout: Sidebar + Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--sp-6)' }}>
                {/* Category Sidebar */}
                <div className="card" style={{ alignSelf: 'flex-start', position: 'sticky', top: 'calc(var(--header-height) + var(--sp-6))' }}>
                    <div className="card-header">
                        <div className="card-title">Categories</div>
                    </div>
                    <div className="card-body" style={{ padding: 'var(--sp-3)' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: 'var(--sp-2) var(--sp-3)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: 'var(--fs-sm)',
                                    fontWeight: activeCategory === cat.id ? 'var(--fw-semibold)' : 'var(--fw-medium)',
                                    color: activeCategory === cat.id ? 'var(--blue-700)' : 'var(--text-secondary)',
                                    background: activeCategory === cat.id ? 'var(--blue-50)' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 150ms ease',
                                    textAlign: 'left',
                                }}
                            >
                                <span>{cat.label}</span>
                                <span style={{
                                    fontSize: 'var(--fs-xs)',
                                    color: activeCategory === cat.id ? 'var(--blue-600)' : 'var(--text-muted)',
                                    background: activeCategory === cat.id ? 'var(--blue-100)' : 'var(--neutral-100)',
                                    padding: '1px 8px',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: 'var(--fw-semibold)',
                                }}>
                                    {cat.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div>
                    <div style={{
                        fontSize: 'var(--fs-xs)',
                        fontWeight: 'var(--fw-semibold)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: 'var(--text-muted)',
                        marginBottom: 'var(--sp-4)',
                    }}>
                        {activeCategoryLabel} — {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
                    </div>

                    {filtered.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 'var(--sp-5)',
                        }}>
                            {filtered.map((product) => (
                                <div
                                    key={product.id}
                                    className="card"
                                    onClick={() => { setSelectedProduct(product); setCurrentImageIndex(0); }}
                                    style={{
                                        padding: 'var(--sp-6)',
                                        cursor: 'pointer',
                                        transition: 'all 200ms ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 'var(--sp-4)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'var(--radius-lg)',
                                            background: product.iconBg,
                                            color: product.iconColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <product.icon size={22} />
                                        </div>
                                        {product.badge && (
                                            <span className="badge badge-submitted" style={{ fontSize: '10px' }}>
                                                {product.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: 'var(--fs-md)',
                                            fontWeight: 'var(--fw-semibold)',
                                            color: 'var(--text-primary)',
                                            marginBottom: 'var(--sp-1)',
                                        }}>
                                            {product.name}
                                        </h3>
                                        <p style={{
                                            fontSize: 'var(--fs-sm)',
                                            color: 'var(--text-secondary)',
                                            lineHeight: 'var(--lh-relaxed)',
                                        }}>
                                            {product.description}
                                        </p>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginTop: 'auto',
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: 'var(--fs-sm)',
                                            fontWeight: 'var(--fw-semibold)',
                                            color: 'var(--blue-600)',
                                        }}>
                                            <span>Learn More</span>
                                            <ChevronRight size={14} />
                                        </div>
                                        <button
                                            onClick={(e) => togglePortfolio(product, e)}
                                            title={portfolio.includes(product.id) ? 'Remove from portfolio' : 'Add to portfolio'}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '4px',
                                                padding: '4px 10px', borderRadius: 'var(--radius-full)',
                                                fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer',
                                                background: portfolio.includes(product.id) ? 'var(--color-success-bg)' : 'var(--neutral-100)',
                                                color: portfolio.includes(product.id) ? 'var(--color-success)' : 'var(--text-muted)',
                                                transition: 'all 150ms ease',
                                            }}
                                        >
                                            <Briefcase size={12} />
                                            {portfolio.includes(product.id) ? 'Saved' : 'Portfolio'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state" style={{ padding: 'var(--sp-16)' }}>
                            <div className="empty-state-icon">
                                <Search size={24} />
                            </div>
                            <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)' }}>No products found</h3>
                            <p className="text-sm text-secondary" style={{ marginTop: 'var(--sp-2)' }}>Try adjusting your search or category filter.</p>
                        </div>
                    )}

                    {/* Trusted By Section */}
                    <div style={{
                        marginTop: 'var(--sp-12)',
                        paddingTop: 'var(--sp-8)',
                        borderTop: '1px solid var(--border-default)',
                        textAlign: 'center',
                    }}>
                        <p style={{
                            fontSize: 'var(--fs-xs)',
                            fontWeight: 'var(--fw-semibold)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: 'var(--text-muted)',
                            marginBottom: 'var(--sp-5)',
                        }}>
                            Trusted by leading enterprises in Southeast Asia
                        </p>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 'var(--sp-8)',
                        }}>
                            {TRUSTED_BY.map((name) => (
                                <span key={name} style={{
                                    fontSize: 'var(--fs-sm)',
                                    fontWeight: 'var(--fw-medium)',
                                    color: 'var(--text-muted)',
                                    opacity: 0.7,
                                }}>
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Detail Drawer */}
            {selectedProduct && (
                <div className="drawer-panel">
                        {/* Drawer Header */}
                        <div className="drawer-header">
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: 'var(--radius-lg)',
                                background: selectedProduct.iconBg,
                                color: selectedProduct.iconColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <selectedProduct.icon size={20} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', lineHeight: 1.2 }}>{selectedProduct.name}</h2>
                                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'var(--fw-semibold)' }}>
                                    {categories.find(c => c.id === selectedProduct.category)?.label}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                style={{
                                    width: '32px', height: '32px', borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-default)', background: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0,
                                    transition: 'all 150ms ease',
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Image Carousel */}
                        {selectedProduct.images && selectedProduct.images.length > 0 && (
                            <div style={{ marginBottom: 'var(--sp-4)' }}>
                                <div style={{
                                    position: 'relative',
                                    height: '180px',
                                    background: '#f3f4f6',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                }}>
                                    <img 
                                        src={selectedProduct.images[currentImageIndex]}
                                        alt={`${selectedProduct.name} image ${currentImageIndex + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    {selectedProduct.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? selectedProduct.images.length - 1 : currentImageIndex - 1)}
                                                style={{
                                                    position: 'absolute',
                                                    left: '8px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.9)',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                }}
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentImageIndex(currentImageIndex === selectedProduct.images.length - 1 ? 0 : currentImageIndex + 1)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '8px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.9)',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                }}
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '8px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                display: 'flex',
                                                gap: '6px',
                                            }}>
                                                {selectedProduct.images.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            width: '8px',
                                                            height: '8px',
                                                            borderRadius: '50%',
                                                            background: idx === currentImageIndex ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Drawer Body */}
                        <div className="drawer-body">
                            {/* Description */}
                            <p style={{
                                fontSize: 'var(--fs-sm)',
                                color: 'var(--text-secondary)',
                                lineHeight: 'var(--lh-relaxed)',
                                marginBottom: 'var(--sp-6)',
                            }}>
                                {selectedProduct.longDescription}
                            </p>

                            {/* Key Features */}
                            <div style={{ marginBottom: 'var(--sp-6)' }}>
                                <h4 style={{
                                    fontSize: 'var(--fs-xs)',
                                    fontWeight: 'var(--fw-semibold)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: 'var(--text-muted)',
                                    marginBottom: 'var(--sp-3)',
                                }}>
                                    Key Features
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-2)' }}>
                                    {selectedProduct.features.map((f, i) => (
                                        <div key={i} style={{
                                            display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
                                            fontSize: 'var(--fs-sm)', padding: 'var(--sp-2) 0',
                                        }}>
                                            <CheckCircle2 size={14} style={{ color: selectedProduct.iconColor, flexShrink: 0 }} />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Use Cases */}
                            <div style={{ marginBottom: 'var(--sp-6)' }}>
                                <h4 style={{
                                    fontSize: 'var(--fs-xs)',
                                    fontWeight: 'var(--fw-semibold)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: 'var(--text-muted)',
                                    marginBottom: 'var(--sp-3)',
                                }}>
                                    Common Use Cases
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                                    {selectedProduct.useCases.map((uc, i) => (
                                        <span key={i} className="chip">{uc}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Trusted By */}
                            <div style={{ marginBottom: 'var(--sp-6)' }}>
                                <h4 style={{
                                    fontSize: 'var(--fs-xs)',
                                    fontWeight: 'var(--fw-semibold)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: 'var(--text-muted)',
                                    marginBottom: 'var(--sp-3)',
                                }}>
                                    Used By
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                                    {selectedProduct.clients.map((client) => (
                                        <div key={client} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--sp-2)',
                                            padding: 'var(--sp-2) var(--sp-3)',
                                            background: 'var(--neutral-50)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--fs-sm)',
                                            fontWeight: 'var(--fw-medium)',
                                            color: 'var(--text-secondary)',
                                        }}>
                                            <Building2 size={13} />
                                            <span>{client}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="drawer-footer">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--sp-3)',
                            }}>
                                <button className="btn btn-primary" style={{ flex: 1, gap: '8px', justifyContent: 'center' }}>
                                    <MessageCircle size={15} />
                                    Ask Summon
                                </button>
                                {selectedProduct.pitchDeckPdf ? (
                                    <a
                                        href={selectedProduct.pitchDeckPdf}
                                        download
                                        className="btn btn-secondary"
                                        style={{ flex: 1, gap: '8px', justifyContent: 'center', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                                    >
                                        <FileSliders size={15} />
                                        Download Pitch Deck (PDF)
                                    </a>
                                ) : (
                                    <button
                                        className="btn btn-secondary"
                                        style={{ flex: 1, gap: '8px', justifyContent: 'center' }}
                                        onClick={() => {
                                            // Download pitch as a text file
                                            const content = `
# ${selectedProduct.name} Pitch

## Overview
${selectedProduct.longDescription}

## Key Features
${selectedProduct.features.map(f => `- ${f}`).join('\n')}

## Use Cases
${selectedProduct.useCases.join('\n')}

---
Generated by Summon Supplier Portal
`;
                                            const blob = new Blob([content], { type: 'text/plain' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `${selectedProduct.name.replace(/\s+/g, '-').toLowerCase()}-pitch.txt`;
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                            URL.revokeObjectURL(url);
                                        }}
                                    >
                                        <FileSliders size={15} />
                                        Download Pitch
                                    </button>
                                )}
                                <button
                                    onClick={(e) => togglePortfolio(selectedProduct, e)}
                                    title={portfolio.includes(selectedProduct.id) ? 'Remove from portfolio' : 'Add to portfolio'}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-default)', cursor: 'pointer',
                                        background: portfolio.includes(selectedProduct.id) ? 'var(--color-success-bg)' : 'white',
                                        color: portfolio.includes(selectedProduct.id) ? 'var(--color-success)' : 'var(--text-muted)',
                                        transition: 'all 150ms ease', flexShrink: 0,
                                    }}
                                >
                                    <Briefcase size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
            )}

        </div>
    );
}
