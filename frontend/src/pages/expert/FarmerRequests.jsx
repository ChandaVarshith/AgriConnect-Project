import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './FarmerRequests.css'

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    if (url.endsWith('/api')) url = url.slice(0, -4)
    return url
}

const FarmerRequests = () => {
    const [queries, setQ] = useState([])
    const [filtered, setFiltered] = useState([])
    const [sortBy, setSortBy] = useState('date')
    const [search, setSearch] = useState('')
    const [loading, setL] = useState(true)
    const [error, setError] = useState('')

    // image modal
    const [activeImage, setActiveImage] = useState(null)
    // per-query ML result
    const [mlResults, setMlResults] = useState({})
    const [mlLoading, setMlLoading] = useState({})

    useEffect(() => {
        queryService.getAllQueries()
            .then(r => {
                const data = Array.isArray(r.data) ? r.data : []
                setQ(data)
                applyFilterSort(data, '', 'date')
            })
            .catch(() => setError('Failed to load farmer requests.'))
            .finally(() => setL(false))
    }, [])

    const applyFilterSort = (data, term, sort) => {
        let result = [...data]
        if (term) {
            const lower = term.toLowerCase()
            result = result.filter(q =>
                q.cropType?.toLowerCase().includes(lower) ||
                q.description?.toLowerCase().includes(lower) ||
                q.location?.toLowerCase().includes(lower) ||
                q.farmerId?.name?.toLowerCase().includes(lower)
            )
        }
        result.sort((a, b) =>
            sort === 'date' ? new Date(b.createdAt) - new Date(a.createdAt)
                : a.cropType?.localeCompare(b.cropType)
        )
        setFiltered(result)
    }

    const handleSearch = (val) => { setSearch(val); applyFilterSort(queries, val, sortBy) }
    const handleSort = (key) => { setSortBy(key); applyFilterSort(queries, search, key) }

    // ── Run ML on a Cloudinary image URL via backend ─────────────────────────
    const handleScanImage = async (queryId, imageUrl) => {
        setMlLoading(prev => ({ ...prev, [queryId]: true }))
        setMlResults(prev => ({ ...prev, [queryId]: null }))
        try {
            const res = await axios.post(
                `${getBaseUrl()}/api/ml/predict-from-url`,
                { imageUrl },
                { withCredentials: true }
            )
            setMlResults(prev => ({ ...prev, [queryId]: res.data }))
        } catch (err) {
            setMlResults(prev => ({
                ...prev,
                [queryId]: { success: false, error: err.response?.data?.message || 'Analysis failed.' }
            }))
        } finally {
            setMlLoading(prev => ({ ...prev, [queryId]: false }))
        }
    }

    return (
        <PageLayout role="expert" title="Farmer Incoming Requests">

            {/* ── Search + Sort bar (AgriConnect-styled) ──────────── */}
            <div className="farmer-req-toolbar">
                <div className="farmer-req-search-wrap">
                    <span className="farmer-req-search-icon">🔍</span>
                    <input
                        placeholder="Search by crop, location, farmer name…"
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                        className="farmer-req-search-input"
                    />
                </div>
                <div className="farmer-req-sort-chips">
                    {[{ k: 'date', l: 'Newest First' }, { k: 'crop', l: 'Crop Type' }].map(({ k, l }) => (
                        <button
                            key={k}
                            onClick={() => handleSort(k)}
                            className={`farmer-req-chip ${sortBy === k ? 'active' : ''}`}
                        >{l}</button>
                    ))}
                </div>
            </div>

            {error && <p className="farmer-req-error">{error}</p>}

            {loading ? <p className="farmer-req-loading">Loading…</p> : (
                <div className="farmer-req-grid">
                    {filtered.length === 0 && <p className="farmer-req-empty">No incoming requests found.</p>}
                    {filtered.map(q => {
                        const ml = mlResults[q._id]
                        return (
                            <div key={q._id} className="farmer-req-card" style={{
                                borderLeft: `4px solid ${q.status === 'resolved' ? '#4caf50' : '#f39c12'}`
                            }}>
                                <div className="farmer-req-card-header">
                                    <div className="farmer-req-card-info">
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

                                        {/* ── Attached image row ──────────────────── */}
                                        {q.imageUrl && (
                                            <div className="farmer-req-image-row">
                                                <img
                                                    src={q.imageUrl}
                                                    alt="crop"
                                                    className="farmer-req-thumb"
                                                    onClick={() => setActiveImage(q.imageUrl)}
                                                    title="Click to enlarge"
                                                />
                                                <div className="farmer-req-image-actions">
                                                    <button
                                                        className="farmer-req-open-img-btn"
                                                        onClick={() => setActiveImage(q.imageUrl)}
                                                    >
                                                        🔍 View Image
                                                    </button>
                                                    <button
                                                        className="farmer-req-scan-btn"
                                                        onClick={() => handleScanImage(q._id, q.imageUrl)}
                                                        disabled={mlLoading[q._id]}
                                                    >
                                                        {mlLoading[q._id] ? '⏳ Scanning…' : '⚡ Scan for Disease'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* ── ML Result inline ────────────────────── */}
                                        {ml && (
                                            <div className={`farmer-req-ml-result ${ml.success && ml.isHealthy ? 'healthy' : 'diseased'}`}>
                                                {ml.success ? (
                                                    <>
                                                        <span>{ml.isHealthy ? '✅' : '⚠️'}</span>
                                                        <span><strong>{ml.prediction}</strong> — {ml.confidence}% confidence</span>
                                                    </>
                                                ) : (
                                                    <span>❌ {ml.error || 'Analysis failed.'}</span>
                                                )}
                                            </div>
                                        )}
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
                        )
                    })}
                </div>
            )}

            {/* ── Image Lightbox Modal ─────────────────────────────── */}
            {activeImage && (
                <div className="farmer-req-lightbox" onClick={() => setActiveImage(null)}>
                    <div className="farmer-req-lightbox-inner" onClick={e => e.stopPropagation()}>
                        <img src={activeImage} alt="Crop" className="farmer-req-lightbox-img" />
                        <button className="farmer-req-lightbox-close" onClick={() => setActiveImage(null)}>✕ Close</button>
                    </div>
                </div>
            )}
        </PageLayout>
    )
}

export default FarmerRequests
