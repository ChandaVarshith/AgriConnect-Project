import React, { useState, useRef, useEffect } from 'react'
import PageLayout from '../../components/PageLayout'
import './AgriBotAssistance.css'

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

const AgriBotAssistance = () => {
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
            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
            if (!apiKey) {
                setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ API key not configured. Please set VITE_OPENROUTER_API_KEY in the .env file.' }])
                return
            }

            const res = await fetch(
                `https://openrouter.ai/api/v1/chat/completions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'google/gemini-2.0-flash-001',
                        messages: [
                            { role: 'user', content: SYSTEM_CONTEXT + question }
                        ]
                    }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                const errMsg = data?.error?.message || `API error ${res.status}`
                throw new Error(errMsg)
            }

            const reply = data?.choices?.[0]?.message?.content || 'No response from AgriBot AI.'
            setMessages(prev => [...prev, { role: 'assistant', text: reply }])
        } catch (err) {
            const errText = err.message || 'Failed to connect to OpenRouter API.'
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
            <div className="gemini-assist-container">

                {/* ── Suggestion chips (shown only when no messages) ── */}
                {messages.length === 0 && (
                    <div className="gemini-assist-suggestions-header">
                        <p className="gemini-assist-suggestions-title">
                            💡 Quick Questions
                        </p>
                        <div className="gemini-assist-suggestions-grid">
                            {SUGGESTIONS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => sendMessage(s)}
                                    className="gemini-assist-suggestion-btn"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Chat window ── */}
                <div className="gemini-assist-chat-window">
                    {/* Header */}
                    <div className="gemini-assist-header">
                        <div className="gemini-assist-status-dot" />
                        <span className="gemini-assist-header-title">
                            AGRIBOT ONLINE — Farming AI Assistant
                        </span>
                    </div>

                    {/* Messages */}
                    <div className="gemini-assist-messages">
                        {messages.length === 0 && (
                            <div className="gemini-assist-empty">
                                <div className="gemini-assist-empty-icon">🌾</div>
                                <p className="gemini-assist-empty-text">
                                    Ask me anything about farming, crops, irrigation, soil, or agricultural schemes!
                                </p>
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <div key={i} className={`gemini-assist-msg-row ${m.role}`}>
                                {m.role === 'assistant' && (
                                    <div className="gemini-assist-avatar-bot">🌿</div>
                                )}
                                <div className={`gemini-assist-bubble ${m.role}`}>
                                    {m.role === 'user' ? m.text : m.text}
                                </div>
                                {m.role === 'user' && (
                                    <div className="gemini-assist-avatar-user">👤</div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="gemini-assist-loading-row">
                                <div className="gemini-assist-avatar-bot">🌿</div>
                                <div className="gemini-assist-loading-bubble">
                                    <span className="gemini-assist-dot">●</span>
                                    <span className="gemini-assist-dot">●</span>
                                    <span className="gemini-assist-dot">●</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input area */}
                    <form onSubmit={handleSubmit} className="gemini-assist-input-form">
                        <input
                            type="text"
                            placeholder="Ask about crops, irrigation, soil, schemes…"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            disabled={loading}
                            className="gemini-assist-input"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="gemini-assist-send-btn"
                        >
                            {loading ? '…' : 'Send ➤'}
                        </button>
                    </form>
                </div>
            </div>
        </PageLayout>
    )
}

export default AgriBotAssistance
