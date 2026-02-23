import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'
import { Link } from 'react-router-dom'

const FarmerRequests = () => {
    const [queries, setQ] = useState([])
    const [filtered, setFiltered] = useState([])
    const [sortBy, setSortBy] = useState('date')
    const [search, setSearch] = useState('')
    const [loading, setL] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        queryService.getAllQueries()
            .then(r => {
                const data = Array.isArray(r.data) ? r.data : []
                setQ(data)
                applyFilterSort(data, '', 'date')
            })
            .catch(err => {
                console.error('Failed to load queries:', err)
                setError('Failed to load farmer requests.')
            })
            .finally(() => setL(false))
    }, [])

    const applyFilterSort = (data, term, sort) => {
        let result = [...data]
        // search filter
        if (term) {
            const lower = term.toLowerCase()
            result = result.filter(q =>
                q.cropType?.toLowerCase().includes(lower) ||
                q.description?.toLowerCase().includes(lower) ||
                q.location?.toLowerCase().includes(lower) ||
                q.farmerId?.name?.toLowerCase().includes(lower)
            )
        }
        // sort
        result.sort((a, b) =>
            sort === 'date' ? new Date(b.createdAt) - new Date(a.createdAt)
                : a.cropType?.localeCompare(b.cropType)
        )
        setFiltered(result)
    }

    const handleSearch = (val) => {
        setSearch(val)
        applyFilterSort(queries, val, sortBy)
    }

    const handleSort = (key) => {
        setSortBy(key)
        applyFilterSort(queries, search, key)
    }

    return (
        <PageLayout role="expert" title="Farmer Incoming Requests">
            {/* Search */}
            <input
                placeholder="Search by crop, location, farmer name…"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                style={{
                    width: '100%', maxWidth: 460, padding: '10px 16px',
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8, color: '#fff', fontSize: '0.88rem', marginBottom: 16,
                    outline: 'none',
                }}
            />

            {/* Sort buttons */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                <span style={{ color: '#999', fontSize: '0.85rem', alignSelf: 'center' }}>Sort by:</span>
                {[{ k: 'date', l: 'Date' }, { k: 'crop', l: 'Crop Type' }].map(({ k, l }) => (
                    <button key={k} onClick={() => handleSort(k)} style={{
                        padding: '6px 14px', borderRadius: 5, border: 'none', cursor: 'pointer',
                        background: sortBy === k ? '#e02020' : 'rgba(255,255,255,0.1)',
                        color: '#fff', fontSize: '0.82rem', fontWeight: 600,
                    }}>{l}</button>
                ))}
            </div>

            {error && <p style={{ color: '#ef4444' }}>{error}</p>}

            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : (
                <div style={{ display: 'grid', gap: 14, maxWidth: 860 }}>
                    {filtered.length === 0 && <p style={{ color: '#888' }}>No incoming requests found.</p>}
                    {filtered.map(q => (
                        <div key={q._id} style={{
                            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderLeft: `4px solid ${q.status === 'resolved' ? '#4caf50' : '#f39c12'}`,
                            borderRadius: 10, padding: '18px 22px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                                <div>
                                    <h4 style={{ color: '#fff', marginBottom: 4 }}>🌾 {q.cropType}</h4>
                                    {q.farmerId?.name && (
                                        <p style={{ fontSize: '0.8rem', color: '#4caf50', marginBottom: 4 }}>
                                            👤 {q.farmerId.name} {q.farmerId.phone ? `· 📱 ${q.farmerId.phone}` : ''}
                                        </p>
                                    )}
                                    <p style={{ fontSize: '0.82rem', color: '#bbb', maxWidth: 600 }}>
                                        {q.description?.substring(0, 150)}{q.description?.length > 150 ? '…' : ''}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: 6 }}>
                                        📍 {q.location || 'N/A'} · {new Date(q.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700,
                                        background: q.status === 'resolved' ? '#4caf50' : '#f39c12',
                                        color: '#000', textTransform: 'capitalize',
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
