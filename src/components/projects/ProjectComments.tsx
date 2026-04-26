'use client';

import { useState, useEffect } from 'react';
import { Send, Paperclip, Clock } from 'lucide-react';

interface Comment {
    id: string;
    author: string;
    role: 'seller' | 'admin';
    message: string;
    timestamp: string;
}

const MOCK_COMMENTS: Comment[] = [
    {
        id: 'c1',
        author: 'Summon Admin',
        role: 'admin',
        message: 'Please provide more detail on the SAP version being used and expected data volume per day.',
        timestamp: '2 hours ago',
    },
];

export default function ProjectComments({ projectStatus }: { projectStatus: string }) {
    const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Simulate typing indicator after mount when status is need_clarification
    useEffect(() => {
        if (projectStatus === 'need_clarification') {
            const timer = setTimeout(() => setIsTyping(true), 2000);
            return () => clearTimeout(timer);
        }

        return undefined;
    }, [projectStatus]);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        setSending(true);
        setIsTyping(false);
        setTimeout(() => {
            setComments(prev => [...prev, {
                id: `c${prev.length + 1}`,
                author: 'Budi Santoso',
                role: 'seller',
                message: newMessage.trim(),
                timestamp: 'Just now',
            }]);
            setNewMessage('');
            setSending(false);
            // Show typing again after seller replies
            if (projectStatus === 'need_clarification') {
                setTimeout(() => setIsTyping(true), 3000);
            }
        }, 500);
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">Messages &amp; Clarifications</div>
                <span style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text-muted)',
                    background: 'var(--neutral-100)',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-full)',
                }}>
                    {comments.length}
                </span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
                {/* Comment List */}
                <div style={{ maxHeight: '360px', overflowY: 'auto', padding: 'var(--sp-5)' }}>
                    {comments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                            No messages yet. Start a conversation with the Summon team.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                            {comments.map((c) => (
                                <div key={c.id} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: c.role === 'seller' ? 'flex-end' : 'flex-start',
                                }}>
                                    <div style={{
                                        maxWidth: '85%',
                                        padding: 'var(--sp-3) var(--sp-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        background: c.role === 'seller' ? 'var(--blue-600)' : 'var(--neutral-50)',
                                        color: c.role === 'seller' ? 'white' : 'var(--text-primary)',
                                        border: c.role === 'admin' ? '1px solid var(--border-default)' : 'none',
                                    }}>
                                        <div style={{
                                            fontSize: 'var(--fs-xs)',
                                            fontWeight: 'var(--fw-semibold)',
                                            marginBottom: '4px',
                                            opacity: c.role === 'seller' ? 0.85 : 1,
                                            color: c.role === 'admin' ? 'var(--text-muted)' : undefined,
                                        }}>
                                            {c.author}
                                        </div>
                                        <div style={{
                                            fontSize: 'var(--fs-sm)',
                                            lineHeight: 'var(--lh-relaxed)',
                                        }}>
                                            {c.message}
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        marginTop: '4px',
                                        fontSize: 'var(--fs-xs)',
                                        color: 'var(--text-muted)',
                                    }}>
                                        <Clock size={10} />
                                        <span>{c.timestamp}</span>
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div style={{
                                    display: 'flex', alignItems: 'flex-start', flexDirection: 'column',
                                }}>
                                    <div style={{
                                        padding: 'var(--sp-3) var(--sp-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'var(--neutral-50)',
                                        border: '1px solid var(--border-default)',
                                        display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
                                    }}>
                                        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            Summon Admin
                                        </span>
                                        <span className="typing-dots">
                                            <span className="typing-dot" />
                                            <span className="typing-dot" />
                                            <span className="typing-dot" />
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Reply Input */}
                <div style={{
                    padding: 'var(--sp-4) var(--sp-5)',
                    borderTop: '1px solid var(--border-default)',
                    background: 'var(--neutral-50)',
                    borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                }}>
                    {projectStatus === 'need_clarification' && (
                        <div style={{
                            fontSize: 'var(--fs-xs)',
                            color: 'var(--color-purple)',
                            fontWeight: 'var(--fw-semibold)',
                            marginBottom: 'var(--sp-3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-purple)', flexShrink: 0 }} />
                            Admin is waiting for your response
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                        <button className="btn btn-ghost btn-sm" title="Attach file" style={{ flexShrink: 0 }}>
                            <Paperclip size={15} />
                        </button>
                        <input
                            className="input"
                            placeholder="Type your reply to the Summon team..."
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            style={{ flex: 1, fontSize: 'var(--fs-sm)' }}
                        />
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleSend}
                            disabled={!newMessage.trim() || sending}
                            style={{ flexShrink: 0, gap: '6px' }}
                        >
                            <Send size={14} />
                            {sending ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
