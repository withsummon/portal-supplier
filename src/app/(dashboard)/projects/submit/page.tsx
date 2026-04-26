'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, ArrowRight, Check, Upload, X, FileText,
    Plus, Trash2, ChevronLeft, CheckCircle
} from 'lucide-react';

// ---- Types ----
interface FormData {
    // Step 1
    projectName: string;
    clientName: string;
    category: string;
    description: string;
    // Step 2
    requirements: string;
    deliverables: string[];
    techStack: string[];
    // Step 3
    startDate: string;
    endDate: string;
    budgetRange: string;
    priority: string;
    // Step 4
    files: File[];
    currency: string;
}

const CATEGORIES = [
    'Web Development', 'Mobile App', 'Data & AI', 'Cloud Infrastructure',
    'Design', 'Marketing', 'Consulting', 'Other',
];

const BUDGET_RANGES: Record<string, { label: string; value: string }[]> = {
    USD: [
        { label: '$10K – $50K', value: '10K–50K' },
        { label: '$50K – $100K', value: '50K–100K' },
        { label: '$100K – $500K', value: '100K–500K' },
        { label: '$500K – $1M', value: '500K–1M' },
        { label: '$1M+', value: '1M+' },
    ],
    IDR: [
        { label: 'Rp 150 Jt – Rp 500 Jt', value: '150Jt–500Jt' },
        { label: 'Rp 500 Jt – Rp 1 M', value: '500Jt–1M' },
        { label: 'Rp 1 M – Rp 5 M', value: '1M–5M' },
        { label: 'Rp 5 M – Rp 15 M', value: '5M–15M' },
        { label: 'Rp 15 M+', value: '15M+' },
    ],
    EUR: [
        { label: '€10K – €50K', value: '10K–50K' },
        { label: '€50K – €100K', value: '50K–100K' },
        { label: '€100K – €500K', value: '100K–500K' },
        { label: '€500K – €1M', value: '500K–1M' },
        { label: '€1M+', value: '1M+' },
    ],
    SGD: [
        { label: 'S$15K – S$75K', value: '15K–75K' },
        { label: 'S$75K – S$150K', value: '75K–150K' },
        { label: 'S$150K – S$750K', value: '150K–750K' },
        { label: 'S$750K – S$1.5M', value: '750K–1.5M' },
        { label: 'S$1.5M+', value: '1.5M+' },
    ],
};

const CURRENCIES = [
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

const PRIORITIES = [
    { value: 'low', label: 'Low', desc: 'Non-urgent, flexible timeline' },
    { value: 'medium', label: 'Medium', desc: 'Normal business requirement' },
    { value: 'high', label: 'High', desc: 'Important, affects operations' },
    { value: 'critical', label: 'Critical', desc: 'Urgent, immediate attention needed' },
];

const TECH_OPTIONS = [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Python', 'FastAPI',
    'Django', 'Java', 'Spring Boot', 'PHP', 'Laravel', 'PostgreSQL', 'MySQL',
    'MongoDB', 'Redis', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Terraform', 'Figma',
];

const STEPS = [
    { label: 'Project Basics', desc: 'Name & category' },
    { label: 'Requirements', desc: 'Scope & deliverables' },
    { label: 'Timeline', desc: 'Dates & budget' },
    { label: 'Attachments', desc: 'Upload files' },
    { label: 'Review', desc: 'Confirm & submit' },
];

// ---- Step Components ----
function Step1({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: unknown) => void }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div className="form-group">
                <label className="form-label">Project Name <span className="form-required">*</span></label>
                <input className="input" placeholder="e.g. E-Commerce Platform Revamp" value={data.projectName}
                    onChange={e => onChange('projectName', e.target.value)} />
                <span className="form-hint">Give your project a clear, descriptive name.</span>
            </div>
            <div className="form-group">
                <label className="form-label">Client Name <span className="form-required">*</span></label>
                <input className="input" placeholder="e.g. PT Maju Bersama" value={data.clientName}
                    onChange={e => onChange('clientName', e.target.value)} />
            </div>
            <div className="form-group">
                <label className="form-label">Project Category <span className="form-required">*</span></label>
                <select className="select" value={data.category} onChange={e => onChange('category', e.target.value)}>
                    <option value="">Select a category...</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Brief Description <span className="form-required">*</span></label>
                <textarea className="input input-textarea" rows={4} placeholder="Provide a brief overview of the project, its goals, and the problem it solves..."
                    value={data.description} onChange={e => onChange('description', e.target.value)} />
                <span className="form-hint">{data.description.length}/1000 characters</span>
            </div>
        </div>
    );
}

function Step2({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: unknown) => void }) {
    const [newDeliverable, setNewDeliverable] = useState('');

    const addDeliverable = () => {
        if (newDeliverable.trim()) {
            onChange('deliverables', [...data.deliverables, newDeliverable.trim()]);
            setNewDeliverable('');
        }
    };

    const removeDeliverable = (i: number) => {
        onChange('deliverables', data.deliverables.filter((_, idx) => idx !== i));
    };

    const toggleTech = (tech: string) => {
        const current = data.techStack;
        onChange('techStack', current.includes(tech) ? current.filter(t => t !== tech) : [...current, tech]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
            <div className="form-group">
                <label className="form-label">Detailed Requirements <span className="form-required">*</span></label>
                <textarea className="input input-textarea" rows={5}
                    placeholder="Describe the technical and functional requirements in detail. Include integrations, performance targets, compliance needs..."
                    value={data.requirements} onChange={e => onChange('requirements', e.target.value)} />
            </div>

            <div className="form-group">
                <label className="form-label">Key Deliverables</label>
                <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
                    <input className="input" placeholder="Add a deliverable..." value={newDeliverable}
                        onChange={e => setNewDeliverable(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addDeliverable())} />
                    <button type="button" className="btn btn-secondary" onClick={addDeliverable} style={{ flexShrink: 0 }}>
                        <Plus size={14} /> Add
                    </button>
                </div>
                {data.deliverables.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                        {data.deliverables.map((d, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                                padding: 'var(--sp-2) var(--sp-3)', background: 'var(--neutral-50)',
                                borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)',
                            }}>
                                <Check size={13} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                                <span style={{ flex: 1, fontSize: 'var(--fs-sm)' }}>{d}</span>
                                <button type="button" onClick={() => removeDeliverable(i)} style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', display: 'flex', padding: '4px' }}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="form-group">
                <label className="form-label">Preferred Tech Stack</label>
                <span className="form-hint" style={{ marginBottom: 'var(--sp-3)', display: 'block' }}>Select all that apply (optional).</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                    {TECH_OPTIONS.map(tech => (
                        <button key={tech} type="button" onClick={() => toggleTech(tech)}
                            className={`chip${data.techStack.includes(tech) ? ' selected' : ''}`}
                            style={{ cursor: 'pointer' }}>
                            {data.techStack.includes(tech) && <Check size={11} />}
                            {tech}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Step3({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: unknown) => void }) {
    const budgetOptions = BUDGET_RANGES[data.currency] ?? BUDGET_RANGES.USD ?? [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div className="grid-2">
                <div className="form-group">
                    <label className="form-label">Expected Start Date <span className="form-required">*</span></label>
                    <input className="input" type="date" value={data.startDate} onChange={e => onChange('startDate', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Expected End Date <span className="form-required">*</span></label>
                    <input className="input" type="date" value={data.endDate} onChange={e => onChange('endDate', e.target.value)} />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Budget & Currency <span className="form-required">*</span></label>
                <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
                    <div style={{ width: '140px' }}>
                        <select className="select" value={data.currency} onChange={e => {
                            onChange('currency', e.target.value);
                            onChange('budgetRange', '');
                        }}>
                            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <select className="select" value={data.budgetRange} onChange={e => onChange('budgetRange', e.target.value)}>
                            <option value="">Select budget range...</option>
                            {budgetOptions.map(b => (
                                <option key={b.value} value={b.label}>
                                    {b.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <span className="form-hint">
                    {data.currency === 'IDR'
                        ? 'Minimum project budget: Rp 150.000.000 (approx. $10K USD).'
                        : 'Minimum project budget: $10,000 USD equivalent.'}
                </span>
            </div>

            <div className="form-group">
                <label className="form-label">Priority Level <span className="form-required">*</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginTop: 'var(--sp-1)' }}>
                    {PRIORITIES.map(p => (
                        <label key={p.value} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)',
                            padding: 'var(--sp-4)', border: `2px solid ${data.priority === p.value ? 'var(--blue-500)' : 'var(--border-default)'}`,
                            borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                            background: data.priority === p.value ? 'var(--blue-50)' : 'white',
                            transition: 'all var(--transition-fast)',
                        }}>
                            <input type="radio" name="priority" value={p.value} checked={data.priority === p.value}
                                onChange={() => onChange('priority', p.value)} style={{ accentColor: 'var(--blue-600)', marginTop: '1px', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>{p.label}</div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>{p.desc}</div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Step4({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: unknown) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const addFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;
        const arr = Array.from(newFiles).filter(f => f.size <= 20 * 1024 * 1024);
        onChange('files', [...data.files, ...arr]);
    };

    const removeFile = (i: number) => onChange('files', data.files.filter((_, idx) => idx !== i));

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1048576).toFixed(1)} MB`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div
                className={`dropzone${dragging ? ' dragging' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
            >
                <div className="dropzone-icon"><Upload size={24} /></div>
                <div className="dropzone-title">Drop files here or click to upload</div>
                <div className="dropzone-hint">PDF, DOCX, XLSX, PNG, JPG — max 20MB per file</div>
                <input ref={inputRef} type="file" multiple style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.pptx"
                    onChange={e => addFiles(e.target.files)} />
            </div>

            {data.files.length > 0 && (
                <div>
                    <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>
                        Attached Files ({data.files.length})
                    </div>
                    <div className="file-list" style={{ marginTop: 0 }}>
                        {data.files.map((file, i) => (
                            <div key={i} className="file-item">
                                <div className="file-item-icon"><FileText size={16} /></div>
                                <span className="file-item-name">{file.name}</span>
                                <span className="file-item-size">{formatSize(file.size)}</span>
                                <button type="button" className="file-remove" onClick={() => removeFile(i)}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', padding: 'var(--sp-4)', background: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                💡 <strong>Tip:</strong> Upload a project brief, technical requirements document, or any reference materials that will help Summon understand your project better.
            </div>
        </div>
    );
}

function Step5({ data }: { data: FormData }) {
    const sections = [
        {
            title: 'Project Basics',
            items: [
                { label: 'Project Name', value: data.projectName || '—' },
                { label: 'Client Name', value: data.clientName || '—' },
                { label: 'Category', value: data.category || '—' },
                { label: 'Description', value: data.description ? data.description.slice(0, 120) + (data.description.length > 120 ? '...' : '') : '—' },
            ],
        },
        {
            title: 'Requirements',
            items: [
                { label: 'Requirements', value: data.requirements ? data.requirements.slice(0, 100) + '...' : '—' },
                { label: 'Deliverables', value: data.deliverables.length > 0 ? `${data.deliverables.length} items defined` : '—' },
                { label: 'Tech Stack', value: data.techStack.length > 0 ? data.techStack.join(', ') : 'Not specified' },
            ],
        },
        {
            title: 'Timeline & Budget',
            items: [
                { label: 'Start Date', value: data.startDate || '—' },
                { label: 'End Date', value: data.endDate || '—' },
                { label: 'Budget Range', value: `${data.currency} ${data.budgetRange}` || '—' },
                { label: 'Priority', value: data.priority ? data.priority.charAt(0).toUpperCase() + data.priority.slice(1) : '—' },
            ],
        },
        {
            title: 'Attachments',
            items: [
                { label: 'Files', value: data.files.length > 0 ? `${data.files.length} file(s) attached` : 'No files attached' },
            ],
        },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            <div style={{
                padding: 'var(--sp-4) var(--sp-5)',
                background: 'var(--blue-50)',
                border: '1px solid var(--blue-200)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
            }}>
                <CheckCircle size={18} style={{ color: 'var(--blue-600)', flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--blue-800)' }}>
                    Please review your project details before submitting. Once submitted, the Summon team will begin review within 1–2 business days.
                </span>
            </div>

            {sections.map(section => (
                <div key={section.title} className="card">
                    <div className="card-header" style={{ padding: 'var(--sp-4) var(--sp-5)' }}>
                        <div className="card-title" style={{ fontSize: 'var(--fs-sm)' }}>{section.title}</div>
                    </div>
                    <div style={{ padding: '0 var(--sp-5)' }}>
                        {section.items.map(({ label, value }) => (
                            <div key={label} className="info-row" style={{ padding: 'var(--sp-3) 0' }}>
                                <div className="info-label" style={{ width: '130px' }}>{label}</div>
                                <div className="info-value" style={{ fontSize: 'var(--fs-sm)' }}>{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ---- Main Wizard ----
export default function SubmitProjectPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState<FormData>({
        projectName: '', clientName: '', category: '', description: '',
        requirements: '', deliverables: [], techStack: [],
        startDate: '', endDate: '', budgetRange: '', priority: '',
        files: [],
        currency: 'IDR',
    });

    const updateField = (key: keyof FormData, value: unknown) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const handleNext = () => { if (step < 4) setStep(step + 1); };
    const handleBack = () => { if (step > 0) setStep(step - 1); };
    const currentStep = STEPS[step] ?? STEPS[0];

    const handleSubmit = () => {
        setSubmitted(true);
        setTimeout(() => { router.push('/projects'); }, 3000);
    };

    if (submitted) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
                <div style={{
                    width: 72, height: 72, borderRadius: '50%', background: 'var(--color-success-bg)',
                    border: '2px solid var(--color-success-border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 'var(--sp-6)', animation: 'fadeIn 0.4s ease',
                }}>
                    <CheckCircle size={36} style={{ color: 'var(--color-success)' }} />
                </div>
                <h2 style={{ fontSize: 'var(--fs-3xl)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-3)', letterSpacing: '-0.5px' }}>
                    Project Submitted!
                </h2>
                <p style={{ fontSize: 'var(--fs-md)', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 'var(--lh-relaxed)' }}>
                    Your project has been successfully submitted to Summon. Our team will review it within 1–2 business days.
                </p>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginTop: 'var(--sp-6)' }}>Redirecting to your projects...</p>
            </div>
        );
    }

    return (
        <div className="animate-in">
            {/* Header */}
            <div style={{ marginBottom: 'var(--sp-6)' }}>
                <Link href="/projects">
                    <button className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--sp-4)', paddingLeft: '4px' }}>
                        <ChevronLeft size={14} /> Back
                    </button>
                </Link>
                <h1 className="page-title">Submit New Project</h1>
                <p className="page-subtitle">Complete all steps to submit your project to Summon.</p>
            </div>

            {/* Stepper */}
            <div className="stepper" style={{ marginBottom: 'var(--sp-8)' }}>
                {STEPS.map((s, i) => (
                    <div key={i} className="stepper-item" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                            <div className={`stepper-circle${step === i ? ' active' : i < step ? ' completed' : ''}`}>
                                {i < step ? <Check size={14} /> : i + 1}
                            </div>
                            <div className="stepper-info">
                                <div className="stepper-label">{s.label}</div>
                                <div className="stepper-desc">{s.desc}</div>
                            </div>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`stepper-line${i < step ? ' completed' : ''}`} style={{ margin: '0 var(--sp-4)' }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--sp-6)' }}>
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title">Step {step + 1}: {currentStep?.label}</div>
                            <div className="card-subtitle">{currentStep?.desc}</div>
                        </div>
                        <span style={{
                            fontSize: 'var(--fs-xs)', color: 'var(--text-muted)',
                            background: 'var(--neutral-100)', padding: '2px 10px', borderRadius: 'var(--radius-full)',
                        }}>
                            {step + 1} / {STEPS.length}
                        </span>
                    </div>
                    <div className="card-body">
                        {step === 0 && <Step1 data={data} onChange={updateField} />}
                        {step === 1 && <Step2 data={data} onChange={updateField} />}
                        {step === 2 && <Step3 data={data} onChange={updateField} />}
                        {step === 3 && <Step4 data={data} onChange={updateField} />}
                        {step === 4 && <Step5 data={data} />}
                    </div>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: 'var(--sp-4) var(--sp-6)',
                        borderTop: '1px solid var(--border-default)',
                        background: 'var(--neutral-50)',
                        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                    }}>
                        <button className="btn btn-secondary" onClick={handleBack} disabled={step === 0}>
                            <ArrowLeft size={14} /> Previous
                        </button>
                        {step < 4 ? (
                            <button className="btn btn-primary" onClick={handleNext}>
                                Next Step <ArrowRight size={14} />
                            </button>
                        ) : (
                            <button className="btn btn-primary btn-lg" onClick={handleSubmit}>
                                <CheckCircle size={16} /> Submit Project
                            </button>
                        )}
                    </div>
                </div>

                {/* Help Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                    <div className="card" style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--sp-6))' }}>
                        <div className="card-header" style={{ padding: 'var(--sp-4) var(--sp-5)' }}>
                            <div className="card-title" style={{ fontSize: 'var(--fs-sm)' }}>
                                💡 Step Tips
                            </div>
                        </div>
                        <div className="card-body" style={{ padding: 'var(--sp-4) var(--sp-5)' }}>
                            {step === 0 && (
                                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
                                    <p><strong>Project Name</strong> should clearly identify what is being built.</p>
                                    <p style={{ marginTop: 'var(--sp-3)' }}><strong>Description</strong> should be concise but complete — cover the &apos;what&apos; and &apos;why&apos;.</p>
                                </div>
                            )}
                            {step === 1 && (
                                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
                                    <p><strong>Be specific</strong> in your requirements. The more detail you provide, the better vendors can respond.</p>
                                    <p style={{ marginTop: 'var(--sp-3)' }}>List <strong>each deliverable separately</strong> so nothing is overlooked.</p>
                                </div>
                            )}
                            {step === 2 && (
                                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
                                    <p>Set a <strong>realistic timeline</strong>. Projects with tight deadlines may have fewer vendor options.</p>
                                    <p style={{ marginTop: 'var(--sp-3)' }}>The <strong>budget range</strong> helps Summon match you with appropriate vendors.</p>
                                </div>
                            )}
                            {step === 3 && (
                                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
                                    <p>Upload any <strong>project briefs, wireframes, or technical specs</strong> that will help vendors understand the scope better.</p>
                                </div>
                            )}
                            {step === 4 && (
                                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
                                    <p>Review everything carefully. After submission, <strong>our admin team will review within 1–2 business days</strong>.</p>
                                    <p style={{ marginTop: 'var(--sp-3)' }}>You can track status updates from <strong>My Projects</strong>.</p>
                                </div>
                            )}
                        </div>

                        {/* Progress overview */}
                        <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderTop: '1px solid var(--border-default)' }}>
                            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 'var(--sp-3)' }}>
                                Progress
                            </div>
                            {STEPS.map((s, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
                                    <div style={{
                                        width: 18, height: 18, borderRadius: '50%',
                                        background: i < step ? 'var(--color-success-bg)' : i === step ? 'var(--blue-600)' : 'var(--neutral-200)',
                                        border: i < step ? '2px solid var(--color-success)' : i === step ? '2px solid var(--blue-600)' : '2px solid var(--border-default)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        {i < step && <Check size={10} style={{ color: 'var(--color-success)' }} />}
                                        {i === step && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                                    </div>
                                    <span style={{ fontSize: 'var(--fs-xs)', color: i <= step ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === step ? 'var(--fw-semibold)' : 'var(--fw-regular)' }}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
