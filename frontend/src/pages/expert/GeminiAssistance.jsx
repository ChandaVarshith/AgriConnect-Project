import React, { useState, useRef, useEffect } from 'react'
import PageLayout from '../../components/PageLayout'

/* ── Farming system context prepended to every user message ── */
const SYSTEM_CONTEXT = `You are AgriBot, an expert agricultural assistant for AgriConnect — a platform that helps Indian farmers, agricultural experts, and financiers. 
You specialize in farming, agriculture, horticulture, irrigation, soil science, crop management, pest control, fertilizers, weather impacts on crops, government agricultural schemes, and rural finance.
Answer questions clearly and helpfully. When relevant, relate answers to Indian farming conditions.
Keep responses concise but informative. Use bullet points for lists.
If a question is completely unrelated to agriculture or farming, politely redirect the user back to agricultural topics.

User question: `

/* ── Suggested quick questions ── */
const SUGGESTIONS = [
    'What is drip irrigation?',
    'Best crops for summer season in India?',
    'How to treat fungal disease in wheat?',
    'What is the PM Kisan scheme?',
    'How to improve soil fertility?',
    'What is crop rotation and its benefits?',
]

const GeminiAssistance = () => {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const chatEndRef = useRef(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    const sendMessage = async (questionText) => {
        const question = (questionText || input).trim()
        if (!question) return

        const userMsg = { role: 'user', text: question }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)
        setError('')

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY
            if (!apiKey) {
                setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ API key not configured. Please set VITE_GEMINI_API_KEY in the .env file.' }])
                return
            }

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [{ text: SYSTEM_CONTEXT + question }]
                            }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 1024,
                        }
                    }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                const errMsg = data?.error?.message || `API error ${res.status}`
                throw new Error(errMsg)
            }

            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.'
            setMessages(prev => [...prev, { role: 'assistant', text: reply }])
        } catch (err) {
            const errText = err.message || 'Failed to connect to Gemini API.'
            setMessages(prev => [...prev, { role: 'assistant', text: `❌ ${errText}` }])
            setError(errText)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        sendMessage()
    }

    return (
        <PageLayout role="expert" title="🌱 AgriBot — AI Farming Assistant">
            <div style={{ maxWidth: 760, width: '100%' }}>

                {/* ── Suggestion chips (shown only when no messages) ── */}
                {messages.length === 0 && (
                    <div style={{ marginBottom: 24 }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            💡 Quick Questions
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {SUGGESTIONS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => sendMessage(s)}
                                    style={{
                                        padding: '7px 14px',
                                        background: 'rgba(34,197,94,0.1)',
                                        border: '1px solid rgba(34,197,94,0.3)',
                                        borderRadius: 20, color: '#4ade80',
                                        fontSize: '0.8rem', cursor: 'pointer',
                                        fontFamily: "'Inter', sans-serif",
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.2)' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)' }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Chat window ── */}
                <div style={{
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 16,
                    display: 'flex', flexDirection: 'column',
                    height: '58vh', minHeight: 400,
                    boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '14px 20px',
                        background: 'linear-gradient(135deg, rgba(22,163,74,0.3), rgba(34,197,94,0.1))',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                        <div style={{
                            width: 10, height: 10, borderRadius: '50%',
                            background: '#22c55e',
                            boxShadow: '0 0 8px rgba(34,197,94,0.8)',
                            animation: 'pulse 2s ease-in-out infinite',
                        }} />
                        <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.9rem', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em' }}>
                            AGRIBOT ONLINE — Farming AI Assistant
                        </span>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {messages.length === 0 && (
                            <div style={{ textAlign: 'center', marginTop: 60 }}>
                                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🌾</div>
                                <p style={{ color: '#475569', fontSize: '0.95rem' }}>
                                    Ask me anything about farming, crops, irrigation, soil, or agricultural schemes!
                                </p>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                {m.role === 'assistant' && (
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.85rem', marginRight: 8, flexShrink: 0, marginTop: 2,
                                    }}>🌿</div>
                                )}
                                <div style={{
                                    maxWidth: '75%', padding: '12px 16px',
                                    background: m.role === 'user'
                                        ? 'linear-gradient(135deg, #1d4ed8, #3b82f6)'
                                        : 'rgba(255,255,255,0.07)',
                                    color: '#f1f5f9',
                                    fontSize: '0.88rem', lineHeight: 1.7,
                                    border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                    whiteSpace: 'pre-wrap',
                                    borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                                }}>
                                    {m.text}
                                </div>
                                {m.role === 'user' && (
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        background: 'rgba(59,130,246,0.3)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.8rem', marginLeft: 8, flexShrink: 0, marginTop: 2,
                                    }}>👤</div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.85rem',
                                }}>🌿</div>
                                <div style={{
                                    background: 'rgba(34,197,94,0.1)',
                                    border: '1px solid rgba(34,197,94,0.25)',
                                    borderRadius: '12px 12px 12px 4px',
                                    padding: '12px 18px', fontSize: '0.85rem', color: '#4ade80',
                                    display: 'flex', gap: 4, alignItems: 'center',
                                }}>
                                    <span style={{ animation: 'dot 1.2s ease-in-out infinite' }}>●</span>
                                    <span style={{ animation: 'dot 1.2s ease-in-out 0.25s infinite' }}>●</span>
                                    <span style={{ animation: 'dot 1.2s ease-in-out 0.5s infinite' }}>●</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input area */}
                    <form onSubmit={handleSubmit} style={{
                        display: 'flex', gap: 10, padding: '14px 16px',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(0,0,0,0.3)',
                    }}>
                        <input
                            type="text"
                            placeholder="Ask about crops, irrigation, soil, schemes…"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            disabled={loading}
                            style={{
                                flex: 1, padding: '11px 16px',
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: 8, color: '#f1f5f9',
                                fontSize: '0.9rem', outline: 'none',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            style={{
                                padding: '11px 22px',
                                background: loading || !input.trim()
                                    ? 'rgba(22,163,74,0.3)'
                                    : 'linear-gradient(135deg, #16a34a, #22c55e)',
                                color: '#fff', border: 'none', borderRadius: 8,
                                fontFamily: "'Barlow Condensed', sans-serif",
                                fontWeight: 700, letterSpacing: '0.06em', fontSize: '0.95rem',
                                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                                textTransform: 'uppercase',
                                transition: 'all 0.2s',
                                boxShadow: loading ? 'none' : '0 4px 14px rgba(34,197,94,0.3)',
                            }}
                        >
                            {loading ? '…' : 'Send ➤'}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                @keyframes dot {
                    0%, 100% { opacity: 0.3; transform: translateY(0); }
                    50% { opacity: 1; transform: translateY(-3px); }
                }
            `}</style>
        </PageLayout>
    )
}

export default GeminiAssistance
