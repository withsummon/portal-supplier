'use client';

import { useState } from 'react';
import { X, Send, Paperclip, MessageSquare } from 'lucide-react';

interface ReportIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReportIssueModal({ isOpen, onClose }: ReportIssueModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
            alert('Your report has been submitted. Thank you!');
        }, 1500);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div style={{ marginBottom: 'var(--sp-6)' }}>
                    <div style={{
                        background: 'var(--blue-50)',
                        padding: 'var(--sp-3) var(--sp-4)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-3)',
                        border: '1px solid var(--blue-100)',
                        marginBottom: 'var(--sp-6)'
                    }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            background: 'var(--blue-600)',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <MessageSquare size={12} fill="white" />
                        </div>
                        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--blue-800)' }}>
                            Connect with our user support expert on Telegram. <a href="#" style={{ color: 'var(--blue-600)', fontWeight: 'var(--fw-bold)', textDecoration: 'underline' }}>Start chat</a>
                        </p>
                    </div>

                    <h2 style={{ fontSize: 'var(--fs-xl)', marginBottom: 'var(--sp-1)' }}>Report an Issue</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>Describe the problem you're encountering and we'll help you fix it.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-fields" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
                    <div className="form-group">
                        <label className="form-label">Your involvement on Summon <span className="form-required">*</span></label>
                        <select className="select" required>
                            <option value="">Select your involvement</option>
                            <option value="seller">Seller / Project Submitter</option>
                            <option value="vendor">Vendor / Partner</option>
                            <option value="admin">System Admin</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Describe the issue <span className="form-required">*</span></label>
                        <textarea
                            className="input input-textarea"
                            placeholder="Tell us more about your experience..."
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Attachment (optional)</label>
                        <div style={{
                            border: '1px dashed var(--border-strong)',
                            padding: 'var(--sp-4)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                            background: 'var(--surface-hover)',
                            cursor: 'pointer'
                        }}>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-2)' }}>
                                <Paperclip size={16} color="var(--blue-600)" />
                                <span style={{ color: 'var(--blue-600)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-sm)' }}>Choose Files</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)' }}>no files selected</span>
                                <input type="file" multiple style={{ display: 'none' }} />
                            </label>
                        </div>
                        <p className="form-hint">You may select one or multiple files</p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Your email (optional)</label>
                        <input className="input" type="email" placeholder="Enter your email" />
                    </div>

                    <div style={{ marginTop: 'var(--sp-4)', display: 'flex', gap: 'var(--sp-3)' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                            style={{ minWidth: '100px' }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
