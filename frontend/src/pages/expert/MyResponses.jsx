import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'

const ExpertMyResponses = () => {
    const [responses, setResponses] = useState([])
    const [loading, setL] = useState(true)

    useEffect(() => {
        queryService.getExpertResponses().then(r => setResponses(r.data)).catch(() => { }).finally(() => setL(false))
    }, [])

    return (
        <PageLayout role="expert" title="My Responses">
            {loading ? (
                <p style={{ color: '#aaa' }}>Loading…</p>
            ) : (
                <div style={{ display: 'grid', gap: 16, maxWidth: 860 }}>
                    {responses.length === 0 && <p style={{ color: '#888' }}>No responses yet.</p>}
                    {responses.map(r => (
                        <div key={r._id} style={{
                            background: 'rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderLeft: '4px solid #4caf50',
                            borderRadius: 10, padding: '18px 22px',
                        }}>
                            {/* Heading: show query topic, not the response text */}
                            <h4 style={{ color: '#fff', marginBottom: 10, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.05rem', letterSpacing: '0.04em' }}>
                                🌾 Query: {r.queryId?.cropType || 'Farming Query'}
                                {r.queryId?.location && (
                                    <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 400, marginLeft: 10 }}>
                                        📍 {r.queryId.location}
                                    </span>
                                )}
                            </h4>

                            {/* Farmer's original description */}
                            {r.queryId?.description && (
                                <div style={{
                                    background: 'rgba(0,0,0,0.2)', borderRadius: 6,
                                    padding: '8px 12px', marginBottom: 12,
                                    borderLeft: '3px solid rgba(255,255,255,0.15)',
                                }}>
                                    <span style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Farmer's Question: </span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.83rem' }}>{r.queryId.description}</span>
                                </div>
                            )}

                            {/* Expert's response */}
                            <div style={{
                                background: 'rgba(34,197,94,0.07)', borderRadius: 6,
                                padding: '10px 14px', marginBottom: 12,
                                border: '1px solid rgba(34,197,94,0.15)',
                            }}>
                                <span style={{ color: '#4ade80', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Response: </span>
                                <p style={{ color: '#d1fae5', fontSize: '0.88rem', marginTop: 4, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{r.responseText}</p>
                            </div>

                            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                                    🗓 {new Date(r.createdAt).toLocaleString()}
                                </p>
                                <p style={{ fontSize: '0.78rem', margin: 0 }}>
                                    Status: <span style={{ color: '#4ade80', fontWeight: 700 }}>Resolved</span>
                                </p>
                                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                                    Farmer: {r.queryId?.farmerId?.phone || r.queryId?.farmerId?.email || '—'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageLayout>
    )
}

export default ExpertMyResponses
