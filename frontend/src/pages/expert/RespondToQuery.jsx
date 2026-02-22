import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import queryService from '../../services/queryService'

const BG = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1400&auto=format&fit=crop&q=80'

const RespondToQuery = () => {
    const { queryId } = useParams()
    const navigate = useNavigate()
    const [query, setQuery] = useState(null)
    const [response, setResponse] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        queryService.getQueryById(queryId).then(res => setQuery(res.data)).catch(console.error)
    }, [queryId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await queryService.submitResponse(queryId, { responseText: response })
            navigate('/expert/requests')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit response.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
            <Navbar role="expert" />
            <div className="content-page">
                <div className="section-title">Respond To Query</div>
                {!query ? (
                    <p className="text-muted">Loading query…</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, maxWidth: 760 }}>
                        {/* Query details */}
                        <div className="info-card" style={{ borderLeft: '4px solid #f39c12' }}>
                            <h4 style={{ marginBottom: 12 }}>🌾 Farmer's Query</h4>
                            <p style={{ fontSize: '0.88rem', color: '#bbb', marginBottom: 8 }}>
                                <strong style={{ color: '#fff' }}>Crop:</strong> {query.cropType}
                            </p>
                            <p style={{ fontSize: '0.88rem', color: '#bbb', marginBottom: 8 }}>
                                <strong style={{ color: '#fff' }}>Location:</strong> {query.location || '—'}
                            </p>
                            <p style={{ fontSize: '0.88rem', color: '#bbb' }}>
                                <strong style={{ color: '#fff' }}>Problem:</strong> {query.description}
                            </p>
                        </div>

                        {/* Response form */}
                        <div className="info-card">
                            <h4 style={{ marginBottom: 16 }}>📝 Your Response</h4>
                            <form onSubmit={handleSubmit}>
                                <textarea rows={6} placeholder="Type your expert advice here…" value={response}
                                    onChange={e => setResponse(e.target.value)} required
                                    style={{
                                        width: '100%', padding: '12px 14px',
                                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                                        borderRadius: 4, color: '#fff', fontSize: '0.9rem',
                                        outline: 'none', resize: 'vertical', marginBottom: 16,
                                    }} />
                                {error && <p style={{ color: '#e02020', fontSize: '0.85rem', marginBottom: 10 }}>{error}</p>}
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button type="submit" disabled={loading} className="btn btn-green">
                                        {loading ? 'Submitting…' : '📤 Send Response'}
                                    </button>
                                    <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RespondToQuery
