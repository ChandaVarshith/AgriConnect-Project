import React, { useState } from 'react'
import agribotService from '../services/agribotService'

const AgriBotPanel = ({ query, cropType, location }) => {
    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleAsk = async () => {
        setError('')
        setLoading(true)
        setResponse('')
        try {
            const text = await agribotService.askFarmingQuery(query, cropType, location)
            setResponse(text)
        } catch {
            setError('AgriBot AI is unavailable. Please check your API key.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ marginTop: 12 }}>
            <button className="btn btn-outline" onClick={handleAsk} disabled={loading}>
                {loading ? '🤖 Thinking…' : '✨ Get AI Suggestion from AgriBot AI'}
            </button>
            {error && <p style={{ color: 'var(--danger)', marginTop: 8, fontSize: '0.85rem' }}>{error}</p>}
            {response && (
                <div style={{
                    background: 'rgba(82,183,136,0.08)', borderLeft: '3px solid var(--primary-light)',
                    padding: '14px', borderRadius: 6, marginTop: 12
                }}>
                    <p style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: 6 }}>🤖 AgriBot AI Suggests:</p>
                    <p style={{ color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{response}</p>
                </div>
            )}
        </div>
    )
}

export default AgriBotPanel
