import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'
import { Link } from 'react-router-dom'

const FarmerRequests = () => {
    const [queries, setQ] = useState([])
    const [sorted, setSorted] = useState([])
    const [sortBy, setSortBy] = useState('date')
    const [loading, setL] = useState(true)

    useEffect(() => {
        queryService.getPendingQueries().then(r => { setQ(r.data); sortData(r.data, 'date') }).finally(() => setL(false))
    }, [])

    const sortData = (data, key) => {
        setSortBy(key)
        const s = [...data].sort((a, b) =>
            key === 'date' ? new Date(b.createdAt) - new Date(a.createdAt)
                : a.cropType?.localeCompare(b.cropType)
        )
        setSorted(s)
    }

    return (
        <PageLayout role="expert" title="Farmer Incoming Requests">
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                <span style={{ color: '#999', fontSize: '0.85rem', alignSelf: 'center' }}>Sort by:</span>
                {[{ k: 'date', l: 'Date' }, { k: 'crop', l: 'Crop Type' }].map(({ k, l }) => (
                    <button key={k} onClick={() => sortData(queries, k)} style={{
                        padding: '6px 14px', borderRadius: 5, border: 'none', cursor: 'pointer',
                        background: sortBy === k ? '#e02020' : 'rgba(255,255,255,0.1)',
                        color: '#fff', fontSize: '0.82rem', fontWeight: 600,
                    }}>{l}</button>
                ))}
            </div>

            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : (
                <div style={{ display: 'grid', gap: 14, maxWidth: 860 }}>
                    {sorted.length === 0 && <p style={{ color: '#888' }}>No incoming requests.</p>}
                    {sorted.map(q => (
                        <div key={q._id} style={{
                            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
                            border: `1px solid rgba(255,255,255,0.12)`,
                            borderLeft: `4px solid ${q.status === 'resolved' ? '#4caf50' : '#f39c12'}`,
                            borderRadius: 10, padding: '18px 22px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                                <div>
                                    <h4 style={{ color: '#fff', marginBottom: 4 }}>{q.cropType}</h4>
                                    <p style={{ fontSize: '0.82rem', color: '#bbb', maxWidth: 600 }}>{q.description?.substring(0, 120)}…</p>
                                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: 6 }}>📍 {q.location} · {new Date(q.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700,
                                        background: q.status === 'resolved' ? '#4caf50' : '#f39c12', color: '#000'
                                    }}>{q.status}</span>
                                    {q.status === 'pending' && (
                                        <Link to={`/expert/respond/${q._id}`} style={{
                                            padding: '5px 14px', background: '#3b82f6', color: '#fff',
                                            fontWeight: 700, fontSize: '0.78rem', borderRadius: 5,
                                            textDecoration: 'none', textTransform: 'uppercase',
                                        }}>Respond</Link>
                                    )}
                                    <Link to={`/expert/respond/${q._id}`} style={{
                                        padding: '5px 14px', background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                                        fontWeight: 700, fontSize: '0.78rem', borderRadius: 5,
                                        textDecoration: 'none', textTransform: 'uppercase',
                                    }}>View</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageLayout>
    )
}

export default FarmerRequests
