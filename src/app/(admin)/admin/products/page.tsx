'use client';

import { useState } from 'react';
import { 
    Search, Plus, Edit2, Trash2, Eye, EyeOff, 
    MoreVertical, Cpu, Database, BarChart3, Shield, 
    MessageSquareText, Image, X, Check, AlertCircle,
    FileText, Sparkles, Users, Building2, Upload, 
    FileIcon, ChevronLeft, ChevronRight, Link as LinkIcon,
    GripVertical, File
} from 'lucide-react';

// Product type matching the factory page
interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    longDescription: string;
    features: string[];
    useCases: string[];
    clients: string[];
    icon: string;
    iconBg: string;
    iconColor: string;
    badge?: string;
    visible: boolean;
    images: string[]; // Array of image URLs for carousel
    pitchDeckPdf: string | null; // PDF URL for pitch deck
}

// Initial mock data
const INITIAL_PRODUCTS: Product[] = [
    {
        id: 'assistant',
        name: 'Summon AI Assistant',
        category: 'conversational-ai',
        description: 'Enterprise conversational AI for customer support and internal knowledge management. Built on RAG architecture.',
        longDescription: 'Summon AI Assistant is our flagship conversational AI platform, purpose-built for high-stakes enterprise environments. It uses proprietary Retrieval-Augmented Generation (RAG) architecture to deliver accurate, context-aware responses grounded in your client\'s own data.',
        features: ['Multi-language support (ID, EN, JP, etc.)', 'Context-aware reasoning with RAG', 'Seamless CRM & ticketing integration', 'SLA-backed 99.9% uptime', 'Custom knowledge base training', 'Real-time analytics dashboard'],
        useCases: ['Enterprise customer support automation', 'Internal knowledge management', 'HR & IT helpdesk', 'Multilingual sales support'],
        clients: ['Telkom Indonesia', 'Bank Mandiri', 'GoTo Group'],
        icon: 'Cpu',
        iconBg: 'var(--blue-50)',
        iconColor: 'var(--blue-600)',
        badge: 'NEW',
        visible: true,
        images: [
            '/assets/factory/ai-assistant-1.png',
            '/assets/factory/ai-assistant-2.png',
            '/assets/factory/ai-assistant-3.png',
        ],
        pitchDeckPdf: '/assets/factory/pitch-ai-assistant.pdf',
    },
    {
        id: 'chatbot',
        name: 'Summon Smart Chatbot',
        category: 'conversational-ai',
        description: 'Lightweight chatbot for lead qualification, FAQ handling, and appointment scheduling across channels.',
        longDescription: 'A lightweight, omnichannel chatbot designed for small-to-medium sales teams. It handles lead qualification, FAQ responses, and appointment scheduling across WhatsApp, Line, and web chat.',
        features: ['Omnichannel (WhatsApp, Line, Web)', 'Pre-built conversation templates', 'Lead scoring & qualification', 'Calendar integration', 'No-code flow builder', 'Webhook & API integration'],
        useCases: ['Lead qualification for sales teams', 'Customer FAQ handling', 'Appointment scheduling', 'Event registration'],
        clients: ['Astra International', 'Tokopedia'],
        icon: 'MessageSquareText',
        iconBg: 'var(--color-info-bg)',
        iconColor: 'var(--color-info)',
        visible: true,
        images: [
            '/assets/factory/chatbot-1.png',
            '/assets/factory/chatbot-2.png',
        ],
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
        icon: 'Database',
        iconBg: 'var(--color-purple-bg)',
        iconColor: 'var(--color-purple)',
        visible: true,
        images: [
            '/assets/factory/pipeline-1.png',
            '/assets/factory/pipeline-2.png',
        ],
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
        icon: 'Eye',
        iconBg: 'var(--color-success-bg)',
        iconColor: 'var(--color-success)',
        visible: true,
        images: [
            '/assets/factory/vision-1.png',
            '/assets/factory/vision-2.png',
        ],
        pitchDeckPdf: '/assets/factory/pitch-vision.pdf',
    },
    {
        id: 'analytics',
        name: 'Summon Analytics Hub',
        category: 'analytics',
        description: 'Business intelligence dashboards with AI-powered insights. Real-time KPI tracking and anomaly detection.',
        longDescription: 'Summon Analytics Hub transforms raw data into actionable insights with AI-powered business intelligence. Features real-time KPI tracking, automated anomaly detection, and customizable dashboards for enterprise decision-making.',
        features: ['Real-time KPI dashboards', 'AI-powered anomaly detection', 'Custom report builder', 'Automated insights', 'Data visualization', 'Mobile-responsive'],
        useCases: ['Sales performance tracking', 'Customer behavior analysis', 'Financial reporting', 'Marketing campaign analysis'],
        clients: ['Shopee Indonesia'],
        icon: 'BarChart3',
        iconBg: 'var(--color-warning-bg)',
        iconColor: 'var(--color-warning)',
        visible: true,
        images: [
            '/assets/factory/analytics-1.png',
            '/assets/factory/analytics-2.png',
        ],
        pitchDeckPdf: '/assets/factory/pitch-analytics.pdf',
    },
    {
        id: 'security',
        name: 'Summon Security Shield',
        category: 'security',
        description: 'Enterprise security platform with AI threat detection and automated incident response.',
        longDescription: 'Summon Security Shield provides comprehensive enterprise security with AI-powered threat detection, automated incident response, and 24/7 monitoring. Built for large organizations requiring robust cybersecurity.',
        features: ['AI threat detection', 'Automated incident response', '24/7 security monitoring', 'Compliance reporting', 'Threat intelligence', 'Zero-trust architecture'],
        useCases: ['Enterprise cybersecurity', 'Compliance management', 'Threat prevention', 'Security operations center'],
        clients: ['Bank BRI', 'BNI'],
        icon: 'Shield',
        iconBg: 'var(--color-danger-bg)',
        iconColor: 'var(--color-danger)',
        visible: false,
        images: [
            '/assets/factory/security-1.png',
        ],
        pitchDeckPdf: '/assets/factory/pitch-security.pdf',
    },
];

const CATEGORIES = [
    { id: 'all', label: 'All Products' },
    { id: 'conversational-ai', label: 'Conversational AI' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'computer-vision', label: 'Computer Vision' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'security', label: 'Security' },
];

const ICON_OPTIONS = [
    { id: 'Cpu', label: 'AI/CPU', icon: Cpu },
    { id: 'Database', label: 'Database', icon: Database },
    { id: 'BarChart3', label: 'Analytics', icon: BarChart3 },
    { id: 'Shield', label: 'Security', icon: Shield },
    { id: 'MessageSquareText', label: 'Chat', icon: MessageSquareText },
    { id: 'Eye', label: 'Vision', icon: Eye },
    { id: 'Building2', label: 'Business', icon: Building2 },
    { id: 'Users', label: 'Users', icon: Users },
    { id: 'Sparkles', label: 'Sparkles', icon: Sparkles },
    { id: 'FileText', label: 'Document', icon: FileText },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        category: 'conversational-ai',
        description: '',
        longDescription: '',
        features: [''],
        useCases: [''],
        clients: [''],
        icon: 'Cpu',
        iconBg: 'var(--blue-50)',
        iconColor: 'var(--blue-600)',
        badge: '',
        visible: true,
        images: [''],
        pitchDeckPdf: '',
    });

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                ...product,
                features: product.features.length > 0 ? [...product.features] : [''],
                useCases: product.useCases.length > 0 ? [...product.useCases] : [''],
                clients: product.clients.length > 0 ? [...product.clients] : [''],
                images: product.images && product.images.length > 0 ? [...product.images] : [''],
                pitchDeckPdf: product.pitchDeckPdf || '',
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                category: 'conversational-ai',
                description: '',
                longDescription: '',
                features: [''],
                useCases: [''],
                clients: [''],
                icon: 'Cpu',
                iconBg: 'var(--blue-50)',
                iconColor: 'var(--blue-600)',
                badge: '',
                visible: true,
                images: [''],
                pitchDeckPdf: '',
            });
        }
        setShowModal(true);
    };

    const handleSave = () => {
        const cleanData = {
            ...formData,
            features: formData.features?.filter(f => f.trim() !== '') || [],
            useCases: formData.useCases?.filter(u => u.trim() !== '') || [],
            clients: formData.clients?.filter(c => c.trim() !== '') || [],
            images: formData.images?.filter(img => img.trim() !== '') || [],
            pitchDeckPdf: formData.pitchDeckPdf?.trim() || null,
        } as Product;

        if (editingProduct) {
            setProducts(products.map(p => p.id === editingProduct.id ? { ...cleanData, id: editingProduct.id } : p));
        } else {
            setProducts([...products, { ...cleanData, id: `product-${Date.now()}` } as Product]);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
        setShowDeleteConfirm(null);
    };

    const handleToggleVisibility = (id: string) => {
        setProducts(products.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...(formData.features || [])];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const addFeature = () => {
        setFormData({ ...formData, features: [...(formData.features || []), ''] });
    };

    const removeFeature = (index: number) => {
        const newFeatures = (formData.features || []).filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures });
    };

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Summon Factory</h1>
                    <p style={{ color: '#6b7280' }}>Kelola produk dan layanan yang tersedia di Summon Factory</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                    }}
                >
                    <Plus size={18} />
                    Tambah Produk
                </button>
            </div>

            {/* Filters */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                            }}
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            background: 'white',
                        }}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
                {filteredProducts.map((product) => (
                    <div 
                        key={product.id} 
                        style={{ 
                            background: 'white', 
                            borderRadius: '12px', 
                            border: '1px solid #e5e7eb',
                            overflow: 'hidden',
                            opacity: product.visible ? 1 : 0.6,
                        }}
                    >
                        {/* Card Header */}
                        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: product.iconBg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {product.icon === 'Cpu' && <Cpu size={24} style={{ color: product.iconColor }} />}
                                        {product.icon === 'Database' && <Database size={24} style={{ color: product.iconColor }} />}
                                        {product.icon === 'BarChart3' && <BarChart3 size={24} style={{ color: product.iconColor }} />}
                                        {product.icon === 'Shield' && <Shield size={24} style={{ color: product.iconColor }} />}
                                        {product.icon === 'MessageSquareText' && <MessageSquareText size={24} style={{ color: product.iconColor }} />}
                                        {product.icon === 'Eye' && <Eye size={24} style={{ color: product.iconColor }} />}
                                        {product.icon === 'Building2' && <Building2 size={24} style={{ color: product.iconColor }} />}
                                        {product.icon === 'Users' && <Users size={24} style={{ color: product.iconColor }} />}
                                        {product.icon === 'Sparkles' && <Sparkles size={24} style={{ color: product.iconColor }} />}
                                        {product.icon === 'FileText' && <FileText size={24} style={{ color: product.iconColor }} />}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{product.name}</h3>
                                            {product.badge && (
                                                <span style={{
                                                    background: '#3b82f6',
                                                    color: 'white',
                                                    fontSize: '10px',
                                                    fontWeight: '700',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                }}>
                                                    {product.badge}
                                                </span>
                                            )}
                                        </div>
                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                            {CATEGORIES.find(c => c.id === product.category)?.label}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button 
                                        onClick={() => handleToggleVisibility(product.id)}
                                        style={{
                                            padding: '6px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: product.visible ? '#10b981' : '#9ca3af',
                                            borderRadius: '4px',
                                        }}
                                        title={product.visible ? 'Sembunyikan' : 'Tampilkan'}
                                    >
                                        {product.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                    <button 
                                        onClick={() => handleOpenModal(product)}
                                        style={{
                                            padding: '6px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#6b7280',
                                            borderRadius: '4px',
                                        }}
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => setShowDeleteConfirm(product.id)}
                                        style={{
                                            padding: '6px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#ef4444',
                                            borderRadius: '4px',
                                        }}
                                        title="Hapus"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div style={{ padding: '16px' }}>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px', lineHeight: '1.5' }}>
                                {product.description}
                            </p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {product.features.slice(0, 3).map((feature, i) => (
                                    <span 
                                        key={i}
                                        style={{ 
                                            fontSize: '11px', 
                                            background: '#f3f4f6', 
                                            padding: '4px 8px', 
                                            borderRadius: '4px',
                                            color: '#6b7280',
                                        }}
                                    >
                                        {feature}
                                    </span>
                                ))}
                                {product.features.length > 3 && (
                                    <span style={{ fontSize: '11px', color: '#6b7280', padding: '4px 8px' }}>
                                        +{product.features.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                    <p>Tidak ada produk yang ditemukan</p>
                </div>
            )}

            {/* Edit/Create Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '700px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                    }}>
                        {/* Modal Header */}
                        <div style={{ 
                            padding: '20px 24px', 
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
                                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '24px' }}>
                            {/* Basic Info */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Nama Produk</label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                                    placeholder="Contoh: Summon AI Assistant"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Kategori</label>
                                    <select
                                        value={formData.category || ''}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                                    >
                                        {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Badge (opsional)</label>
                                    <input
                                        type="text"
                                        value={formData.badge || ''}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                                        placeholder="Contoh: NEW, POPULAR"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Deskripsi Singkat</label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                                    placeholder="Deskripsi singkat tentang produk..."
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Deskripsi Panjang</label>
                                <textarea
                                    value={formData.longDescription || ''}
                                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                                    rows={4}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                                    placeholder="Deskripsi lengkap tentang produk..."
                                />
                            </div>

                            {/* Icon Selection */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Icon</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {ICON_OPTIONS.map(icon => (
                                        <button
                                            key={icon.id}
                                            onClick={() => setFormData({ ...formData, icon: icon.id })}
                                            style={{
                                                padding: '10px',
                                                border: formData.icon === icon.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                background: 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <icon.icon size={20} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Fitur Utama</label>
                                {formData.features?.map((feature, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(i, e.target.value)}
                                            style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                                            placeholder={`Fitur ${i + 1}`}
                                        />
                                        <button 
                                            onClick={() => removeFeature(i)}
                                            style={{ padding: '8px', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button 
                                    onClick={addFeature}
                                    style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
                                >
                                    + Tambah Fitur
                                </button>
                            </div>

                            {/* Use Cases */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Use Cases</label>
                                {formData.useCases?.map((useCase, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                        <input
                                            type="text"
                                            value={useCase}
                                            onChange={(e) => {
                                                const newUseCases = [...(formData.useCases || [])];
                                                newUseCases[i] = e.target.value;
                                                setFormData({ ...formData, useCases: newUseCases });
                                            }}
                                            style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                                            placeholder={`Use Case ${i + 1}`}
                                        />
                                        <button 
                                            onClick={() => {
                                                const newUseCases = (formData.useCases || []).filter((_, idx) => idx !== i);
                                                setFormData({ ...formData, useCases: newUseCases });
                                            }}
                                            style={{ padding: '8px', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => setFormData({ ...formData, useCases: [...(formData.useCases || []), ''] })}
                                    style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
                                >
                                    + Tambah Use Case
                                </button>
                            </div>

                            {/* Images (Overview Carousel) - Drag & Drop */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                                    <Image size={14} style={{ display: 'inline', marginRight: '6px' }} />
                                    Gambar Overview (Drag & Drop)
                                </label>
                                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                                    Seret dan lepas file gambar (PNG/JPG) untuk carousel overview produk
                                </p>
                                
                                {/* Drop zone */}
                                <div
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const files = Array.from(e.dataTransfer.files);
                                        const imageFiles = files.filter(f => f.type.startsWith('image/'));
                                        const newImages = [...(formData.images || []), ...imageFiles.map(f => URL.createObjectURL(f))];
                                        setFormData({ ...formData, images: newImages });
                                    }}
                                    style={{
                                        border: '2px dashed #d1d5db',
                                        borderRadius: '12px',
                                        padding: '24px',
                                        textAlign: 'center',
                                        background: '#f9fafb',
                                        cursor: 'pointer',
                                        marginBottom: '12px',
                                    }}
                                >
                                    <Upload size={32} style={{ color: '#9ca3af', marginBottom: '8px' }} />
                                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                                        Seret & lepas gambar di sini
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                        atau
                                    </p>
                                    <label style={{
                                        display: 'inline-block',
                                        marginTop: '8px',
                                        padding: '8px 16px',
                                        background: '#3b82f6',
                                        color: 'white',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                    }}>
                                        Pilih File
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg"
                                            multiple
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                const newImages = [...(formData.images || []), ...files.map(f => URL.createObjectURL(f))];
                                                setFormData({ ...formData, images: newImages });
                                            }}
                                        />
                                    </label>
                                </div>

                                {/* Image previews */}
                                {formData.images && formData.images.length > 0 && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                        {formData.images.map((img, i) => (
                                            <div key={i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9', background: '#f3f4f6' }}>
                                                <img 
                                                    src={img} 
                                                    alt={`Preview ${i + 1}`} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                <button 
                                                    onClick={() => {
                                                        const newImages = (formData.images || []).filter((_, idx) => idx !== i);
                                                        setFormData({ ...formData, images: newImages });
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '4px',
                                                        right: '4px',
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        background: 'rgba(0,0,0,0.6)',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Pitch Deck PDF - Drag & Drop */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                                    <FileIcon size={14} style={{ display: 'inline', marginRight: '6px' }} />
                                    Pitch Deck PDF (Drag & Drop)
                                </label>
                                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                                    Seret & lepas file PDF untuk pitch deck (bisa di-download oleh seller)
                                </p>
                                
                                {/* PDF Drop zone */}
                                <div
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const files = Array.from(e.dataTransfer.files);
                                        const pdfFile = files.find(f => f.type === 'application/pdf');
                                        if (pdfFile) {
                                            setFormData({ ...formData, pitchDeckPdf: URL.createObjectURL(pdfFile) });
                                        }
                                    }}
                                    style={{
                                        border: formData.pitchDeckPdf ? '2px solid #10b981' : '2px dashed #d1d5db',
                                        borderRadius: '12px',
                                        padding: '24px',
                                        textAlign: 'center',
                                        background: formData.pitchDeckPdf ? '#f0fdf4' : '#f9fafb',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {formData.pitchDeckPdf ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <File size={32} style={{ color: '#10b981' }} />
                                            <span style={{ color: '#10b981', fontWeight: '500' }}>PDF Terupload!</span>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, pitchDeckPdf: '' }); }}
                                                style={{
                                                    marginLeft: '8px',
                                                    padding: '4px 8px',
                                                    background: '#fee2e2',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    color: '#ef4444',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload size={32} style={{ color: '#9ca3af', marginBottom: '8px' }} />
                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>
                                                Seret & lepas PDF di sini
                                            </p>
                                            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                                                atau
                                            </p>
                                            <label style={{
                                                display: 'inline-block',
                                                marginTop: '8px',
                                                padding: '8px 16px',
                                                background: '#3b82f6',
                                                color: 'white',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                            }}>
                                                Pilih File PDF
                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setFormData({ ...formData, pitchDeckPdf: URL.createObjectURL(file) });
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Visibility Toggle */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button
                                    onClick={() => setFormData({ ...formData, visible: !formData.visible })}
                                    style={{
                                        width: '48px',
                                        height: '24px',
                                        borderRadius: '12px',
                                        background: formData.visible ? '#3b82f6' : '#e5e7eb',
                                        border: 'none',
                                        cursor: 'pointer',
                                        position: 'relative',
                                    }}
                                >
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: 'white',
                                        position: 'absolute',
                                        top: '2px',
                                        left: formData.visible ? '26px' : '2px',
                                        transition: 'left 0.2s',
                                    }} />
                                </button>
                                <span style={{ fontSize: '14px' }}>
                                    {formData.visible ? 'Produk visible' : 'Produk tersembunyi'}
                                </span>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ 
                            padding: '16px 24px', 
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px',
                        }}>
                            <button 
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: '10px 20px',
                                    background: '#f3f4f6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                }}
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleSave}
                                style={{
                                    padding: '10px 20px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                }}
                            >
                                {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        width: '90%',
                        maxWidth: '400px',
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '12px' }} />
                            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Hapus Produk?</h3>
                            <p style={{ color: '#6b7280', marginTop: '8px' }}>
                                Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                onClick={() => setShowDeleteConfirm(null)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    background: '#f3f4f6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                }}
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => handleDelete(showDeleteConfirm)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                }}
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
