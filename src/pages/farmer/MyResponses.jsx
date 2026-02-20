import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import queryService from '../../services/queryService'

const MyResponses = () => {
    const [queries, setQ] = useState([])
    const [loading, setL] = useState(true)
    const [expanded, setE] = useState(null)

    useEffect(() => {
        queryService.getMyQueries().then(r => setQ(r.data)).finally(() => setL(false))
    }, [])

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
            <Navbar role="farmer" />
            <div className="content-page">
                <div className="section-title">My Responses</div>
                {loading ? <p className="text-muted">Loading…</p> : (
                    <div style={{ display: 'grid', gap: 14 }}>
                        {queries.map(q => (
                            <div key={q._id} className="info-card"
                                style={{ borderLeft: `4px solid ${q.status === 'resolved' ? '#4caf50' : '#f39c12'}`, cursor: 'pointer' }}
                                onClick={() => setE(expanded === q._id ? null : q._id)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                                    <div>
                                        <h4>{q.cropType}</h4>
                                        <p style={{ fontSize: '0.82rem', color: '#bbb', marginTop: 4 }}>{q.description?.substring(0, 100)}…</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                                        <span className={`badge ${q.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>{q.status}</span>
                                        <span style={{ color: '#666', fontSize: '0.8rem' }}>{expanded === q._id ? '▲' : '▼'}</span>
                                    </div>
                                </div>
                                {expanded === q._id && (
                                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                        <p style={{ fontSize: '0.82rem', color: '#ccc', marginBottom: 10 }}><strong>Your Query:</strong> {q.description}</p>
                                        {q.response
                                            ? <p style={{ fontSize: '0.82rem', color: '#4caf50' }}><strong>Expert Response:</strong> {q.response}</p>
                                            : <p style={{ fontSize: '0.82rem', color: '#999' }}>⏳ Awaiting expert response…</p>
                                        }
                                        <p style={{ fontSize: '0.75rem', color: '#555', marginTop: 10 }}>📅 {new Date(q.createdAt).toLocaleDateString()}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                        {queries.length === 0 && <p className="text-muted">No queries submitted yet.</p>}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyResponses
