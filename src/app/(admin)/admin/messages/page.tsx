'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, User, Search, MoreVertical, Phone, Video, Paperclip, Smile, MessageSquare, Building2 } from 'lucide-react';

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
    read: boolean;
}

interface Conversation {
    id: string;
    participantName: string;
    participantRole: string;
    participantCompany?: string;
    avatar?: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: '1',
        participantName: 'Budi Santoso',
        participantRole: 'Project Submitter',
        participantCompany: 'PT Arya Teknologi',
        lastMessage: 'Thank you for reviewing our project submission.',
        lastMessageTime: '10 minutes ago',
        unreadCount: 1,
        messages: [
            { id: '1', senderId: 'admin', text: 'Hello Budi, thank you for submitting your project.', timestamp: new Date(Date.now() - 3600000 * 2), read: true },
            { id: '2', senderId: 'user', text: 'Hi! Yes, we submitted "Cloud Infrastructure Migration" project yesterday.', timestamp: new Date(Date.now() - 3600000), read: true },
            { id: '3', senderId: 'admin', text: 'Great! Our team is currently reviewing the submission. We may need some clarification on the technical requirements.', timestamp: new Date(Date.now() - 1800000), read: true },
            { id: '4', senderId: 'user', text: 'Thank you for reviewing our project submission.', timestamp: new Date(Date.now() - 600000), read: false },
        ],
    },
    {
        id: '2',
        participantName: 'Rina Wijaya',
        participantRole: 'Vendor Contact',
        participantCompany: 'CV Maju Bersama',
        lastMessage: 'We would like to apply for the Web Development category.',
        lastMessageTime: '2 hours ago',
        unreadCount: 0,
        messages: [
            { id: '1', senderId: 'user', text: 'Hello, we are interested in becoming a verified vendor on Summon.', timestamp: new Date(Date.now() - 3600000 * 5), read: true },
            { id: '2', senderId: 'admin', text: 'Thank you for your interest! Please provide your company profile and portfolio.', timestamp: new Date(Date.now() - 3600000 * 4), read: true },
            { id: '3', senderId: 'user', text: 'We would like to apply for the Web Development category.', timestamp: new Date(Date.now() - 3600000 * 2), read: true },
        ],
    },
    {
        id: '3',
        participantName: 'Ahmad Fauzi',
        participantRole: 'Seller',
        participantCompany: 'PT Delta Solusi',
        lastMessage: 'When can we expect a response on our clarification?',
        lastMessageTime: '1 day ago',
        unreadCount: 0,
        messages: [
            { id: '1', senderId: 'admin', text: 'We need additional clarification on your "Data Analytics Dashboard" project.', timestamp: new Date(Date.now() - 3600000 * 48), read: true },
            { id: '2', senderId: 'user', text: 'Sure, I will provide the SAP version and data volume details.', timestamp: new Date(Date.now() - 3600000 * 24), read: true },
            { id: '3', senderId: 'user', text: 'When can we expect a response on our clarification?', timestamp: new Date(Date.now() - 3600000 * 24), read: true },
        ],
    },
];

export default function AdminMessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [activeConversationId, setActiveConversationId] = useState<string>('1');
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    const filteredConversations = conversations.filter(c =>
        c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.participantCompany?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeConversation?.messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !activeConversation) return;

        const message: Message = {
            id: Date.now().toString(),
            senderId: 'admin',
            text: newMessage,
            timestamp: new Date(),
            read: false,
        };

        setConversations(prev => prev.map(conv => {
            if (conv.id === activeConversationId) {
                return {
                    ...conv,
                    messages: [...conv.messages, message],
                    lastMessage: newMessage,
                    lastMessageTime: 'Just now',
                };
            }
            return conv;
        }));

        setNewMessage('');
    };

    return (
        <div className="animate-in" style={{ height: 'calc(100vh - 140px)', display: 'flex', gap: 'var(--sp-5)' }}>
            {/* Conversation List */}
            <div className="card" style={{ width: '340px', display: 'flex', flexDirection: 'column', padding: 0, flexShrink: 0 }}>
                <div style={{ padding: 'var(--sp-4)', borderBottom: '1px solid var(--border-default)' }}>
                    <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-3)' }}>Messages</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="input"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: '36px', fontSize: 'var(--fs-sm)' }}
                        />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {filteredConversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => setActiveConversationId(conv.id)}
                            style={{
                                padding: 'var(--sp-4)',
                                borderBottom: '1px solid var(--border-default)',
                                cursor: 'pointer',
                                background: conv.id === activeConversationId ? 'var(--surface-active)' : 'transparent',
                                transition: 'background var(--transition-fast)',
                            }}
                        >
                            <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: 'var(--radius-full)',
                                    background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {conv.participantCompany ? <Building2 size={18} color="var(--blue-600)" /> : <User size={18} color="var(--blue-600)" />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                        <span style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)', color: 'var(--text-primary)' }}>
                                            {conv.participantName}
                                        </span>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{conv.lastMessageTime}</span>
                                    </div>
                                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                        {conv.participantRole} {conv.participantCompany && `· ${conv.participantCompany}`}
                                    </div>
                                    <div style={{ 
                                        fontSize: 'var(--fs-xs)', 
                                        color: conv.unreadCount > 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        fontWeight: conv.unreadCount > 0 ? 'var(--fw-semibold)' : 'var(--fw-regular)',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    }}>
                                        {conv.lastMessage}
                                    </div>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <div style={{
                                        width: '18px', height: '18px', borderRadius: '50%',
                                        background: 'var(--blue-600)', color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '10px', fontWeight: 'var(--fw-bold)', flexShrink: 0,
                                    }}>
                                        {conv.unreadCount}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {activeConversation && (
                <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}>
                    {/* Chat Header */}
                    <div style={{ 
                        padding: 'var(--sp-4) var(--sp-5)', 
                        borderBottom: '1px solid var(--border-default)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: 'var(--radius-full)',
                                background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {activeConversation.participantCompany ? <Building2 size={18} color="var(--blue-600)" /> : <User size={18} color="var(--blue-600)" />}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>
                                    {activeConversation.participantName}
                                </div>
                                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                                    {activeConversation.participantRole} {activeConversation.participantCompany && `· ${activeConversation.participantCompany}`}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                            <button className="btn btn-ghost btn-sm" title="Voice call">
                                <Phone size={16} />
                            </button>
                            <button className="btn btn-ghost btn-sm" title="Video call">
                                <Video size={16} />
                            </button>
                            <button className="btn btn-ghost btn-sm" title="More options">
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                        {activeConversation.messages.map(message => (
                            <div
                                key={message.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: message.senderId === 'admin' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <div style={{
                                    maxWidth: '70%',
                                    padding: 'var(--sp-3) var(--sp-4)',
                                    borderRadius: 'var(--radius-lg)',
                                    background: message.senderId === 'admin' ? 'var(--blue-600)' : 'var(--neutral-100)',
                                    color: message.senderId === 'admin' ? 'white' : 'var(--text-primary)',
                                }}>
                                    <div style={{ fontSize: 'var(--fs-sm)', lineHeight: 'var(--lh-relaxed)' }}>
                                        {message.text}
                                    </div>
                                    <div style={{
                                        fontSize: '10px', marginTop: '4px',
                                        color: message.senderId === 'admin' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                                        textAlign: 'right',
                                    }}>
                                        {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div style={{ 
                        padding: 'var(--sp-4)', 
                        borderTop: '1px solid var(--border-default)',
                        display: 'flex', gap: 'var(--sp-3)', alignItems: 'center',
                    }}>
                        <button className="btn btn-ghost btn-sm" title="Attach file">
                            <Paperclip size={18} />
                        </button>
                        <input
                            className="input"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                            style={{ flex: 1 }}
                        />
                        <button className="btn btn-ghost btn-sm" title="Emoji">
                            <Smile size={18} />
                        </button>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            style={{ gap: '6px' }}
                        >
                            <Send size={16} />
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
