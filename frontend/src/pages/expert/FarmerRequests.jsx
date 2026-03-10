import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'
import { Link } from 'react-router-dom'
import './FarmerRequests.css'

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
                className="farmer-req-search"
            />

            {/* Sort buttons */}
            <div className="farmer-req-sort-bar">
                <span className="farmer-req-sort-label">Sort by:</span>
                {[{ k: 'date', l: 'Date' }, { k: 'crop', l: 'Crop Type' }].map(({ k, l }) => (
                    <button key={k} onClick={() => handleSort(k)} className="farmer-req-sort-btn" style={{
                        background: sortBy === k ? '#e02020' : 'rgba(255,255,255,0.1)'
                    }}>{l}</button>
                ))}
            </div>

            {error && <p className="farmer-req-error">{error}</p>}

            {loading ? <p className="farmer-req-loading">Loading…</p> : (
                <div className="farmer-req-grid">
                    {filtered.length === 0 && <p className="farmer-req-empty">No incoming requests found.</p>}
                    {filtered.map(q => (
                        <div key={q._id} className="farmer-req-card" style={{
                            borderLeft: `4px solid ${q.status === 'resolved' ? '#4caf50' : '#f39c12'}`
                        }}>
                            <div className="farmer-req-card-header">
                                <div>
                                    <h4 className="farmer-req-crop">🌾 {q.cropType}</h4>
                                    {q.farmerId?.name && (
                                        <p className="farmer-req-farmer">
                                            👤 {q.farmerId.name} {q.farmerId.phone ? `· 📱 ${q.farmerId.phone}` : ''}
                                        </p>
                                    )}
                                    <p className="farmer-req-desc">
                                        {q.description?.substring(0, 150)}{q.description?.length > 150 ? '…' : ''}
                                    </p>
                                    <p className="farmer-req-meta">
                                        📍 {q.location || 'N/A'} · {new Date(q.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="farmer-req-actions">
                                    <span className="farmer-req-status-badge" style={{
                                        background: q.status === 'resolved' ? '#4caf50' : '#f39c12',
                                    }}>{q.status}</span>
                                    {q.status === 'pending' && (
                                        <Link to={`/expert/respond/${q._id}`} className="farmer-req-btn-primary">Respond</Link>
                                    )}
                                    <Link to={`/expert/respond/${q._id}`} className="farmer-req-btn-secondary">View</Link>
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
