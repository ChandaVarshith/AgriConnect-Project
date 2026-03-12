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
    const [filterNameOrPhone, setFilterNameOrPhone] = useState('')
    const [filterCropOrIssue, setFilterCropOrIssue] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterType, setFilterType] = useState('all')
    const [sortBy, setSortBy] = useState('date')
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
                applyFilters(data, '', '', 'all', 'all', 'date')
            })
            .catch(() => setError('Failed to load farmer requests.'))
            .finally(() => setL(false))
    }, [])

    const applyFilters = (data, namePhone, cropIssue, statusState, typeState, sortMode) => {
        let result = [...data]

        if (namePhone) {
            const lower = namePhone.toLowerCase()
            result = result.filter(q =>
                q.farmerId?.name?.toLowerCase().includes(lower) ||
                q.farmerId?.phone?.toLowerCase().includes(lower)
            )
        }
        if (cropIssue) {
            const lower = cropIssue.toLowerCase()
            result = result.filter(q =>
                q.cropType?.toLowerCase().includes(lower) ||
                q.description?.toLowerCase().includes(lower) ||
                q.location?.toLowerCase().includes(lower)
            )
        }
        if (statusState !== 'all') {
            result = result.filter(q => q.status === statusState)
        }
        
        if (typeState === 'disease') {
            result = result.filter(q => !!q.imageUrl)
        } else if (typeState === 'general') {
            result = result.filter(q => !q.imageUrl)
        }

        result.sort((a, b) => {
            if (sortMode === 'date') return new Date(b.createdAt) - new Date(a.createdAt)
            if (sortMode === 'date_asc') return new Date(a.createdAt) - new Date(b.createdAt)
            return a.cropType?.localeCompare(b.cropType)
        })
        
        setFiltered(result)
    }

    const handleFilterChange = (type, value) => {
        let newNamePhone = filterNameOrPhone
        let newCropIssue = filterCropOrIssue
        let newStatus = filterStatus
        let newType = filterType
        let newSortBy = sortBy

        if (type === 'nameOrPhone') { setFilterNameOrPhone(value); newNamePhone = value }
        if (type === 'cropOrIssue') { setFilterCropOrIssue(value); newCropIssue = value }
        if (type === 'status') { setFilterStatus(value); newStatus = value }
        if (type === 'type') { setFilterType(value); newType = value }
        if (type === 'sort') { setSortBy(value); newSortBy = value }

        applyFilters(queries, newNamePhone, newCropIssue, newStatus, newType, newSortBy)
    }

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

            {/* ── Advanced Search + Filter Bar ──────────── */}
            <div className="farmer-req-toolbar-advanced">
                <div className="farmer-req-filters-row">
                    <div className="farmer-req-search-box">
                        <span className="farmer-req-search-icon">👤</span>
                        <input
                            placeholder="Farmer name or phone…"
                            value={filterNameOrPhone}
                            onChange={e => handleFilterChange('nameOrPhone', e.target.value)}
                            className="farmer-req-search-input"
                        />
                    </div>
                    <div className="farmer-req-search-box">
                        <span className="farmer-req-search-icon">🌾</span>
                        <input
                            placeholder="Crop disease or issue…"
                            value={filterCropOrIssue}
                            onChange={e => handleFilterChange('cropOrIssue', e.target.value)}
                            className="farmer-req-search-input"
                        />
                    </div>
                    <select
                        className="farmer-req-select"
                        value={filterType}
                        onChange={e => handleFilterChange('type', e.target.value)}
                    >
                        <option value="all">All Request Types</option>
                        <option value="disease">Disease Scans Only</option>
                        <option value="general">General Queries Only</option>
                    </select>

                    <select
                        className="farmer-req-select"
                        value={filterStatus}
                        onChange={e => handleFilterChange('status', e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
                
                <div className="farmer-req-sort-chips">
                    <span style={{color: '#888', fontSize: '0.85rem', fontWeight: 600}}>Sort by:</span>
                    {[{ k: 'date', l: 'Newest First' }, { k: 'date_asc', l: 'Oldest' }, { k: 'crop', l: 'Crop Name' }].map(({ k, l }) => (
                        <button
                            key={k}
                            onClick={() => handleFilterChange('sort', k)}
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
                        
                        // Parse crop type for badge formatting
                        const isDiseaseScan = q.cropType?.startsWith('[Disease Scan]');
                        const rawCrop = isDiseaseScan ? q.cropType.replace('[Disease Scan] ', '') : q.cropType;

                        return (
                            <div key={q._id} className="farmer-req-card" style={{
                                borderLeft: `4px solid ${q.status === 'resolved' ? '#4caf50' : '#f39c12'}`
                            }}>
                                <div className="farmer-req-card-header">
                                    <div className="farmer-req-card-info">
                                        <h4 className="farmer-req-crop">
                                            {isDiseaseScan && <span style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', marginRight: '8px', border: '1px solid rgba(34,197,94,0.4)' }}>🦠 Disease Scan</span>}
                                            🌾 {rawCrop}
                                        </h4>
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
