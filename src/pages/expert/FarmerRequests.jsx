import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
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
        const s = [...data].sort((a, b) => {
            if (key === 'date') return new Date(b.createdAt) - new Date(a.createdAt)
            return a.cropType?.localeCompare(b.cropType)
        })
        setSorted(s)
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
            <Navbar role="expert" />
            <div className="content-page">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <div className="section-title" style={{ marginBottom: 0 }}>Farmer Incoming Requests</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ color: '#999', fontSize: '0.85rem', alignSelf: 'center' }}>Sort by:</span>
                        {['date', 'crop'].map(k => (
                            <button key={k} onClick={() => sortData(queries, k)} className="btn"
                                style={{ background: sortBy === k ? '#e02020' : 'rgba(255,255,255,0.08)', color: '#fff', textTransform: 'capitalize', fontSize: '0.78rem', padding: '6px 14px' }}>
                                {k === 'date' ? 'Date' : 'Crop Type'}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? <p className="text-muted">Loading…</p> : (
                    <div style={{ display: 'grid', gap: 14 }}>
                        {sorted.map(q => (
                            <div key={q._id} className="info-card" style={{ borderLeft: `4px solid ${q.status === 'resolved' ? '#4caf50' : '#f39c12'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                                    <div>
                                        <h4 style={{ marginBottom: 4 }}>{q.cropType}</h4>
                                        <p style={{ fontSize: '0.82rem', color: '#bbb', maxWidth: 600 }}>{q.description?.substring(0, 120)}…</p>
                                        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: 6 }}>📍 {q.location} · {new Date(q.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <span className={`badge ${q.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>{q.status}</span>
                                        {q.status === 'pending' && (
                                            <Link to={`/expert/respond/${q._id}`} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '5px 14px' }}>Respond</Link>
                                        )}
                                        <Link to={`/expert/respond/${q._id}`} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '5px 14px' }}>View</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {sorted.length === 0 && <p className="text-muted">No incoming requests.</p>}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FarmerRequests
