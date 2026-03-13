import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import './ExpertMarketplace.css'

const ExpertMarketplace = () => {
    const [pending, setPending] = useState([])
    const [approved, setApproved] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [toast, setToast] = useState('')
    const [rejectId, setRejectId] = useState(null)
    const [rejectReason, setRejectReason] = useState('')
    const [approvedSort, setApprovedSort] = useState('newest')
    const [approvedSearch, setApprovedSearch] = useState('')
    const [activeCat, setActiveCat] = useState('all')

    const CATEGORIES = ['vegetables', 'fruits', 'grains', 'dairy', 'other']

    const load = async () => {
        setLoading(true)
        setLoadError('')
        try {
            // Fetch pending and approved in parallel
            const [pRes, aRes] = await Promise.all([
                API.get('/marketplace/expert/pending'),
                API.get('/marketplace'),
            ])
            const pendingData = Array.isArray(pRes.data) ? pRes.data : (pRes.data?.listings || [])
            const approvedData = Array.isArray(aRes.data) ? aRes.data : (aRes.data?.listings || [])
            setPending(pendingData)
            setApproved(approvedData)
        } catch (err) {
            const status = err.response?.status
            const msg = err.response?.data?.message || err.message || 'Unknown error'
            if (status === 403) {
                setLoadError(`Access denied (403): Your account role may not be set to "expert". Please log out and log back in. (${msg})`)
            } else if (status === 401) {
                setLoadError('Not authenticated. Please log in again.')
            } else {
                setLoadError(`Failed to load marketplace data: ${msg}`)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500) }

    const approve = async (id) => {
        try {
            await API.put(`/marketplace/${id}/approve`)
            showToast('Approved! Listing is now live on the marketplace.')
            load()
        } catch (err) {
            showToast(`Failed to approve: ${err.response?.data?.message || err.message}`)
        }
    }

    const openReject = (id) => { setRejectId(id); setRejectReason('') }

    const confirmReject = async (id) => {
        if (!rejectReason.trim()) return
        try {
            await API.put(`/marketplace/${id}/reject`, { rejectionReason: rejectReason.trim() })
            showToast('Listing rejected and removed from database.')
            setRejectId(null); setRejectReason('')
            load()
        } catch (err) {
            showToast(`Failed to reject: ${err.response?.data?.message || err.message}`)
        }
    }

    const remove = async (id) => {
        try {
            await API.delete(`/marketplace/${id}/expert-remove`)
            showToast('Delete Removed from marketplace.')
            load()
        } catch (err) {
            showToast(`Failed to remove: ${err.response?.data?.message || err.message}`)
        }
    }

    // Sort + filter helper
    const getFilteredAndSorted = (listData) => {
        let list = [...listData]
        if (approvedSearch.trim()) {
            const q = approvedSearch.trim().toLowerCase()
            list = list.filter(l => {
                const name = (l.farmerId?.name || l.farmerName || '').toLowerCase()
                const phone = (l.farmerId?.phone || l.farmerPhone || '').toLowerCase()
                return name.includes(q) || phone.includes(q) || (l.name || '').toLowerCase().includes(q)
            })
        }
        if (activeCat !== 'all') {
            list = list.filter(l => (l.category || 'other').toLowerCase() === activeCat)
        }
        if (approvedSort === 'farmer_phone') {
            list.sort((a, b) => (a.farmerId?.phone || a.farmerPhone || '').localeCompare(b.farmerId?.phone || b.farmerPhone || ''))
        } else if (approvedSort === 'farmer_name') {
            list.sort((a, b) => (a.farmerId?.name || a.farmerName || '').localeCompare(b.farmerId?.name || b.farmerName || ''))
        } else if (approvedSort === 'az') {
            list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        } else if (approvedSort === 'price_asc') {
            list.sort((a, b) => Number(a.price) - Number(b.price))
        }
        return list
    }

    const sortedPending = getFilteredAndSorted(pending)
    const sortedApproved = getFilteredAndSorted(approved)

    const SectionTitle = ({ icon, label, count, color }) => (
        <div className="emp-section-title">
            <span className="emp-section-icon">{icon}</span>
            <h2 style={{ color }}>{label}</h2>
            <span className="emp-section-badge" style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}>
                {count}
            </span>
        </div>
    )



    return (
        <PageLayout role="expert" title="Marketplace Management">

            {/* Toast */}
            {toast && <div className="emp-toast">{toast}</div>}

            {/* Load error */}
            {loadError && (
                <div className="emp-error-box">
                    <strong>! Error Loading Data</strong>
                    <p>{loadError}</p>
                    <button className="emp-retry-btn" onClick={load}>↺ Retry</button>
                </div>
            )}

            {loading ? (
                <div className="emp-loading-box">
                    <div className="emp-loading-spinner" />
                    <p>Loading marketplace data…</p>
                </div>
            ) : !loadError && (
                <>
                    {/* ── CONTROLS (Top) ── */}
                    {(pending.length > 0 || approved.length > 0) && (
                        <div className="emp-controls-bar">
                            <div className="emp-search-wrap">
                                <span className="emp-search-icon"></span>
                                <input type="text" className="emp-search"
                                    placeholder="Search by farmer name, phone, or produce…"
                                    value={approvedSearch}
                                    onChange={e => setApprovedSearch(e.target.value)}
                                />
                            </div>

                            <div className="emp-cat-tabs">
                                <button className={`emp-cat-tab ${activeCat === 'all' ? 'emp-cat-tab--active' : ''}`}
                                    onClick={() => setActiveCat('all')}>All</button>
                                {CATEGORIES.map(c => (
                                    <button key={c}
                                        className={`emp-cat-tab ${activeCat === c ? 'emp-cat-tab--active' : ''}`}
                                        onClick={() => setActiveCat(c)}>
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <select className="emp-sort-select" value={approvedSort}
                                onChange={e => setApprovedSort(e.target.value)}>
                                <option value="newest">Newest First</option>
                                <option value="farmer_phone">Sort by Farmer Phone</option>
                                <option value="farmer_name">Sort by Farmer Name</option>
                                <option value="az">Produce A–Z</option>
                                <option value="price_asc">Price: Low → High</option>
                            </select>
                        </div>
                    )}

                    {/* ── PENDING APPROVAL ── */}
                    <section className="emp-section">
                        <SectionTitle icon="" label="Pending Approval" count={sortedPending.length} color="#f59e0b" />
                        {sortedPending.length === 0 ? (
                            <div className="emp-empty-box">
                                <p>No pending listings match your search.</p>
                            </div>
                        ) : (
                            <div className="emp-list">
                                {sortedPending.map(item => (
                                    <div key={item._id} className="emp-pending-card">
                                        <div className="emp-card-body">
                                            <div className="emp-card-info">
                                                <div className="emp-title-row">
                                                    <span className="emp-prod-name">{item.name}</span>
                                                    <span className="emp-badge emp-badge--pending">PENDING</span>
                                                    {item.category && <span className="emp-badge emp-badge--cat">{item.category}</span>}
                                                </div>
                                                <div className="emp-detail-row">
                                                    Qty: <span className="emp-detail-strong">{item.quantity} {item.unit || 'kg'}</span>
                                                </div>
                                                <div className="emp-detail-row">
                                                    Price: <span className="emp-detail-strong">₹{item.price}/{item.unit || 'kg'}</span>
                                                </div>
                                                {item.description && <div className="emp-desc">{item.description}</div>}
                                                <div className="emp-farmer-row">
                                                     <strong>{item.farmerName || item.farmerId?.name || '—'}</strong>
                                                    &nbsp;·&nbsp;  <strong>{item.farmerPhone || item.farmerId?.phone || '—'}</strong>
                                                </div>
                                                {item.harvestDate && (
                                                    <div className="emp-harvest-row">
                                                         Harvest: {new Date(item.harvestDate).toLocaleDateString('en-IN')}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="emp-actions-col">
                                                {rejectId === item._id ? (
                                                    <div className="emp-reject-form">
                                                        <textarea className="emp-textarea" rows={3}
                                                            placeholder="Type rejection reason for the farmer…"
                                                            value={rejectReason}
                                                            onChange={e => setRejectReason(e.target.value)}
                                                        />
                                                        <div className="emp-actions-row">
                                                            <button className="emp-btn emp-btn--confirm-reject"
                                                                onClick={() => confirmReject(item._id)}
                                                                disabled={!rejectReason.trim()}>
                                                                Confirm Reject
                                                            </button>
                                                            <button className="emp-btn emp-btn--cancel" onClick={() => setRejectId(null)}>Cancel</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="emp-actions-row">
                                                        <button className="emp-btn emp-btn--approve" onClick={() => approve(item._id)}>Approve</button>
                                                        <button className="emp-btn emp-btn--reject" onClick={() => openReject(item._id)}>Reject</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ── ALL ACTIVE LISTINGS ── */}
                    <section className="emp-section">
                        <SectionTitle icon="" label="All Active Listings" count={sortedApproved.length} color="#22c55e" />
                        {sortedApproved.length === 0 ? (
                            <div className="emp-empty-box">
                                <p>{approved.length === 0 ? 'No live listings yet.' : 'No listings match your search.'}</p>
                            </div>
                        ) : (
                            <div className="emp-list">
                                {sortedApproved.map(item => (
                                    <div key={item._id} className="emp-approved-card">
                                        <div className="emp-card-info">
                                            <div className="emp-title-row">
                                                <span className="emp-prod-name">{item.name}</span>
                                                <span className="emp-badge emp-badge--approved">LIVE</span>
                                                {item.category && <span className="emp-badge emp-badge--cat">{item.category}</span>}
                                            </div>
                                            <div className="emp-detail-row">
                                                Qty: <span className="emp-detail-strong">{item.quantity} {item.unit || 'kg'}</span>
                                            </div>
                                            <div className="emp-detail-row">
                                                Price: <span className="emp-detail-strong">₹{item.price}/{item.unit || 'kg'}</span>
                                            </div>
                                            {item.description && <div className="emp-desc emp-desc--sm">{item.description.slice(0, 80)}{item.description.length > 80 ? '…' : ''}</div>}
                                            <div className="emp-farmer-row">
                                                 <strong>{item.farmerName || item.farmerId?.name || '—'}</strong>
                                                &nbsp;·&nbsp;  <strong>{item.farmerPhone || item.farmerId?.phone || '—'}</strong>
                                            </div>
                                        </div>
                                        <button className="emp-btn emp-btn--remove" onClick={() => remove(item._id)}>Delete Remove</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )
            }
        </PageLayout >
    )
}

export default ExpertMarketplace
