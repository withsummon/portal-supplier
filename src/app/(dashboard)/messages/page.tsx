'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, User, Search, MoreVertical, Phone, Video, Paperclip, Smile, MessageSquare } from 'lucide-react';

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
    avatar?: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: '1',
        participantName: 'Summon Admin',
        participantRole: 'Support Team',
        lastMessage: 'Thank you for your patience. We will review your project shortly.',
        lastMessageTime: '2 hours ago',
        unreadCount: 1,
        messages: [
            { id: '1', senderId: 'admin', text: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 3600000 * 24), read: true },
            { id: '2', senderId: 'user', text: 'Hi, I submitted a project yesterday and wanted to check the status.', timestamp: new Date(Date.now() - 3600000 * 23), read: true },
            { id: '3', senderId: 'admin', text: 'Thank you for your patience. We will review your project shortly.', timestamp: new Date(Date.now() - 3600000 * 2), read: false },
        ],
    },
    {
        id: '2',
        participantName: 'Ahmad Rizki',
        participantRole: 'Project Manager',
        lastMessage: 'The client has approved the proposal. Please proceed with the next steps.',
        lastMessageTime: '1 day ago',
        unreadCount: 0,
        messages: [
            { id: '1', senderId: 'admin', text: 'Your project PRJ-001 has been accepted!', timestamp: new Date(Date.now() - 3600000 * 48), read: true },
            { id: '2', senderId: 'user', text: 'Great! What are the next steps?', timestamp: new Date(Date.now() - 3600000 * 47), read: true },
            { id: '3', senderId: 'admin', text: 'The client has approved the proposal. Please proceed with the next steps.', timestamp: new Date(Date.now() - 3600000 * 24), read: true },
        ],
    },
    {
        id: '3',
        participantName: 'Diana Sari',
        participantRole: 'Sales Director',
        lastMessage: 'Can we schedule a call to discuss the enterprise plan?',
        lastMessageTime: '3 days ago',
        unreadCount: 0,
        messages: [
            { id: '1', senderId: 'admin', text: 'Hi, we would like to discuss partnership opportunities.', timestamp: new Date(Date.now() - 3600000 * 72), read: true },
            { id: '2', senderId: 'user', text: 'Of course! What aspects are you interested in?', timestamp: new Date(Date.now() - 3600000 * 71), read: true },
            { id: '3', senderId: 'admin', text: 'Can we schedule a call to discuss the enterprise plan?', timestamp: new Date(Date.now() - 3600000 * 24 * 3), read: true },
        ],
    },
];

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [activeConversationId, setActiveConversationId] = useState<string>('1');
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeConversation = conversations.find(c => c.id === activeConversationId);

    const filteredConversations = conversations.filter(c =>
        c.participantName.toLowerCase().includes(searchQuery.toLowerCase())
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
            senderId: 'user',
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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="animate-in" style={{ height: 'calc(100vh - 140px)', display: 'flex', gap: 'var(--sp-4)' }}>
            {/* Conversations List */}
            <div className="card" style={{ width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: 'var(--sp-5)', borderBottom: '1px solid var(--border-default)' }}>
                    <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-4)' }}>Messages</h1>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input"
                            style={{ paddingLeft: '36px', fontSize: 'var(--fs-sm)' }}
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {filteredConversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => setActiveConversationId(conv.id)}
                            style={{
                                padding: 'var(--sp-4) var(--sp-5)',
                                cursor: 'pointer',
                                background: activeConversationId === conv.id ? 'var(--blue-50)' : 'transparent',
                                borderLeft: activeConversationId === conv.id ? '3px solid var(--blue-600)' : '3px solid transparent',
                                borderBottom: '1px solid var(--border-default)',
                                transition: 'all 150ms ease',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    background: 'var(--blue-100)',
                                    color: 'var(--blue-600)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'var(--fw-bold)',
                                    fontSize: 'var(--fs-sm)',
                                    flexShrink: 0,
                                }}>
                                    {conv.participantName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                        <span style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>
                                            {conv.participantName}
                                        </span>
                                        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                                            {conv.lastMessageTime}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                                            {conv.lastMessage}
                                        </span>
                                        {conv.unreadCount > 0 && (
                                            <span style={{
                                                background: 'var(--blue-600)',
                                                color: 'white',
                                                fontSize: '10px',
                                                fontWeight: 'var(--fw-bold)',
                                                padding: '2px 6px',
                                                borderRadius: 'var(--radius-full)',
                                                minWidth: '18px',
                                                textAlign: 'center',
                                            }}>
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div style={{
                            padding: 'var(--sp-4) var(--sp-5)',
                            borderBottom: '1px solid var(--border-default)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--blue-100)',
                                    color: 'var(--blue-600)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'var(--fw-bold)',
                                    fontSize: 'var(--fs-sm)',
                                }}>
                                    {activeConversation.participantName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>
                                        {activeConversation.participantName}
                                    </div>
                                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                                        {activeConversation.participantRole}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                                <button className="btn btn-ghost btn-sm" style={{ padding: '8px' }}>
                                    <Phone size={16} />
                                </button>
                                <button className="btn btn-ghost btn-sm" style={{ padding: '8px' }}>
                                    <Video size={16} />
                                </button>
                                <button className="btn btn-ghost btn-sm" style={{ padding: '8px' }}>
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                            {activeConversation.messages.map((message) => (
                                <div
                                    key={message.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: message.senderId === 'user' ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    <div style={{
                                        maxWidth: '70%',
                                        padding: 'var(--sp-3) var(--sp-4)',
                                        borderRadius: 'var(--radius-lg)',
                                        background: message.senderId === 'user' ? 'var(--blue-600)' : 'var(--neutral-100)',
                                        color: message.senderId === 'user' ? 'white' : 'var(--text-primary)',
                                    }}>
                                        <p style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.5, margin: 0 }}>
                                            {message.text}
                                        </p>
                                        <div style={{
                                            fontSize: '10px',
                                            marginTop: '4px',
                                            opacity: 0.7,
                                            textAlign: 'right',
                                        }}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div style={{
                            padding: 'var(--sp-4) var(--sp-5)',
                            borderTop: '1px solid var(--border-default)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--sp-3)',
                        }}>
                            <button className="btn btn-ghost btn-sm" style={{ padding: '8px' }}>
                                <Paperclip size={16} />
                            </button>
                            <button className="btn btn-ghost btn-sm" style={{ padding: '8px' }}>
                                <Smile size={16} />
                            </button>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="input"
                                style={{ flex: 1 }}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                style={{ padding: '10px' }}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'var(--neutral-100)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <MessageSquare size={32} style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
