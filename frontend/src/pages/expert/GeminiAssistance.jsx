import React, { useState, useRef, useEffect } from 'react'
import PageLayout from '../../components/PageLayout'

const GeminiAssistance = () => {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const chatEndRef = useRef(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim()) return
        const userMsg = { role: 'user', text: input.trim() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY
            if (!apiKey) {
                setMessages(prev => [...prev, { role: 'assistant', text: 'Please set VITE_GEMINI_API_KEY in your .env file to use Gemini.' }])
                setLoading(false)
                return
            }
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: userMsg.text }] }]
                    }),
                }
            )
            const data = await res.json()
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.'
            setMessages(prev => [...prev, { role: 'assistant', text: reply }])
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Failed to connect to Gemini API.' }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageLayout role="expert" title="Gemini AI Assistance">
            <div style={{
                background: 'rgba(240,240,235,0.94)', backdropFilter: 'blur(4px)',
                borderRadius: 8, width: '100%', maxWidth: 700,
                display: 'flex', flexDirection: 'column',
                minHeight: 480, maxHeight: '65vh',
            }}>
                {/* Chat Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {messages.length === 0 && (
                        <p style={{ color: '#888', textAlign: 'center', marginTop: 60, fontSize: '0.9rem' }}>
                            Ask Gemini about farming, crops, soil, weather, or any agriculture topic…
                        </p>
                    )}
                    {messages.map((m, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            <div style={{
                                maxWidth: '78%', padding: '12px 16px', borderRadius: 8,
                                background: m.role === 'user' ? '#3b82f6' : 'rgba(240,240,240,0.8)',
                                color: m.role === 'user' ? '#fff' : '#1a1a1a',
                                fontSize: '0.88rem', lineHeight: 1.6,
                                border: m.role === 'user' ? 'none' : '1px solid #ddd',
                                whiteSpace: 'pre-wrap',
                            }}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <div style={{
                                background: 'rgba(240,240,240,0.8)', borderRadius: 8,
                                padding: '10px 16px', fontSize: '0.85rem', color: '#666',
                                border: '1px solid #ddd',
                            }}>
                                Thinking…
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} style={{ display: 'flex', borderTop: '1px solid #ddd', padding: '12px 16px', gap: 10 }}>
                    <input
                        type="text"
                        placeholder="Ask Gemini about farming, crops, soil…"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        style={{
                            flex: 1, padding: '10px 14px', border: '1px solid #ddd',
                            borderRadius: 4, fontSize: '0.9rem', outline: 'none',
                            background: '#fff', color: '#1a1a1a',
                        }}
                    />
                    <button type="submit" disabled={loading} style={{
                        padding: '10px 22px', background: '#4caf50', color: '#fff',
                        border: 'none', borderRadius: 4,
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700, letterSpacing: '0.06em', fontSize: '0.95rem',
                        cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase',
                    }}>
                        Send
                    </button>
                </form>
            </div>
        </PageLayout>
    )
}

export default GeminiAssistance
