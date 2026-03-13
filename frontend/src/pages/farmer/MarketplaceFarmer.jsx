import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import marketplaceService from '../../services/marketplaceService'
import { useLanguage } from '../../context/LanguageContext'
import './MarketplaceFarmer.css'

const CATEGORIES = ['vegetables', 'fruits', 'grains', 'dairy', 'other']
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'az', label: 'Name A–Z' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
]

const MarketplaceFarmer = () => {
    const { t } = useLanguage()
    const [listings, setListings] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [showPending, setShowPending] = useState(false)   // toggle pending drawer
    const [showRejections, setShowRejections] = useState(false) // toggle rejection popup
    const [form, setForm] = useState({
        name: '', category: '', quantity: '', price: '', unit: 'kg', description: '', harvestDate: '',
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [confirmId, setConfirmId] = useState(null)
    const [search, setSearch] = useState('')
    const [activeCat, setActiveCat] = useState('all')
    const [sortBy, setSortBy] = useState('newest')
    const [toastMsg, setToastMsg] = useState('')

    const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000) }

    const loadListings = async () => {
        try {
            const res = await marketplaceService.getAllForFarmer()
            const data = Array.isArray(res.data) ? res.data : []
            setListings(data)
        } catch {
            try {
                const res = await marketplaceService.getMyListings()
                const data = Array.isArray(res.data) ? res.data : []
                setListings(data.map(l => ({ ...l, _isOwner: true })))
            } catch { setListings([]) }
        }
    }

    useEffect(() => { loadListings() }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        setSubmitting(true); setError('')
        try {
            await marketplaceService.createListing(form)
            setShowForm(false)
            setShowPending(true)   // auto-open pending drawer so farmer sees their new listing
            setForm({ name: '', category: '', quantity: '', price: '', unit: 'kg', description: '', harvestDate: '' })
            showToast('Listing submitted! Waiting for expert approval.')
            loadListings()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create listing.')
        } finally { setSubmitting(false) }
    }

    const confirmDelete = async (id) => {
        setListings(prev => prev.filter(l => l._id !== id))
        setConfirmId(null)
        try {
            await marketplaceService.deleteListing(id)
            showToast('Delete Listing removed.')
        } catch { loadListings() }
    }

    // ── Partition listings ──
    // own pending (strict)
    const myPending = listings.filter(l => l._isOwner === true && l.status === 'pending')
    // own rejected
    const myRejected = listings.filter(l => l._isOwner === true && l.status === 'rejected')
    // own approved
    const myApproved = listings.filter(l => l._isOwner === true && l.status === 'approved')
    // other farmers' approved listings
    const otherListings = listings.filter(l => l._isOwner !== true)

    // filters + sort
    const applyFilters = (list) => {
        let out = [...list]
        if (search.trim()) {
            const q = search.trim().toLowerCase()
            out = out.filter(l => l.name?.toLowerCase().includes(q))
        }
        if (activeCat !== 'all') out = out.filter(l => l.category?.toLowerCase() === activeCat)
        if (sortBy === 'az') out.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        else if (sortBy === 'price_asc') out.sort((a, b) => Number(a.price) - Number(b.price))
        else if (sortBy === 'price_desc') out.sort((a, b) => Number(b.price) - Number(a.price))
        return out
    }

    const filteredApproved = applyFilters(myApproved)
    const filteredOthers = applyFilters(otherListings)

    // ── Card render ──
    const renderCard = (l, isOwner, isPendingCard = false) => {
        const farmerName = l.farmerId?.name || l.farmerName || 'Farmer'
        const farmerPhone = l.farmerId?.phone || l.farmerPhone || ''

        return (
            <div key={l._id} className={`mf-card ${isPendingCard ? 'mf-card--pending-item' : isOwner ? 'mf-card--mine' : 'mf-card--other'}`}>
                <div className="mf-card-top">
                    {l.category && <span className="mf-badge-cat">{l.category}</span>}
                    {isPendingCard && (
                        <span className={`mf-badge-status mf-badge-status--${l.status || 'pending'}`}>
                            {l.status || 'pending'}
                        </span>
                    )}
                </div>

                <h4 className="mf-card-title">{l.name}</h4>

                {!isOwner && (
                    <p className="mf-card-farmer"> {farmerName}{farmerPhone ? ` · ${farmerPhone}` : ''}</p>
                )}

                <p className="mf-card-row">Qty: <strong>{l.quantity} {l.unit}</strong></p>
                <p className="mf-card-row mf-card-price">Price: <strong>₹{l.price}/{l.unit}</strong></p>

                {l.description && (
                    <p className="mf-card-desc">
                        {l.description.length > 80 ? l.description.slice(0, 80) + '…' : l.description}
                    </p>
                )}

                {l.status === 'rejected' && l.rejectionReason && (
                    <p className="mf-rejection-reason">
                        Reason: {l.rejectionReason}
                    </p>
                )}

                {isOwner && (
                    <div className="mf-card-actions">
                        {confirmId === l._id ? (
                            <>
                                <span className="mf-confirm-label">Sure?</span>
                                <button className="mf-btn mf-btn--confirm" onClick={() => confirmDelete(l._id)}>Yes, Remove</button>
                                <button className="mf-btn mf-btn--cancel" onClick={() => setConfirmId(null)}>Cancel</button>
                            </>
                        ) : (
                            <button className="mf-btn mf-btn--remove" onClick={() => setConfirmId(l._id)}>Remove</button>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <PageLayout role="farmer" title={t('sellyourproduce') || 'Sell Your Produce'}>

            {toastMsg && <div className="mf-toast">{toastMsg}</div>}

            {/* ── Top Bar ── */}
            <div className="mf-top-bar">
                <span className="mf-count-label">
                    {(myApproved.length + otherListings.length)} listing{(myApproved.length + otherListings.length) !== 1 ? 's' : ''} in marketplace
                    {myApproved.length > 0 && <span className="mf-count-mine"> · {myApproved.length} yours approved</span>}
                </span>
                <div className="mf-top-bar-actions">
                    {/* Pending Requests Button — always visible */}
                    <button
                        className={`mf-pending-toggle-btn ${showPending ? 'active' : ''} ${myPending.length === 0 ? 'mf-pending-toggle-btn--empty' : ''}`}
                        onClick={() => setShowPending(v => !v)}
                    >
                        📋 Pending Requests
                        <span className={`mf-pending-count-badge ${myPending.length === 0 ? 'mf-pending-count-badge--empty' : ''}`}>
                            {myPending.length}
                        </span>
                    </button>
                    <button
                        className={`mf-add-btn ${showForm ? 'mf-add-btn--cancel' : ''}`}
                        onClick={() => { setShowForm(v => !v); setError('') }}
                    >
                        {showForm ? ' Cancel' : '+ Add New Listing'}
                    </button>
                </div>
            </div>

            {/* ── Pending Requests Drawer ── */}
            {showPending && (
                <div className="mf-pending-drawer">
                    <div className="mf-pending-drawer-header">
                        <span>📋 Your Pending Requests — waiting for expert approval</span>
                        <button className="mf-pending-close" onClick={() => setShowPending(false)}></button>
                    </div>
                    {myPending.length === 0 ? (
                        <div className="mf-empty" style={{ padding: '20px 10px' }}>
                            <p className="mf-empty-text">No pending listings. All your listings are approved! </p>
                        </div>
                    ) : (
                        <div className="mf-grid">
                            {myPending.map(l => renderCard(l, true, true))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Add Listing Form ── */}
            {showForm && (
                <div className="mf-form-wrap">
                    <form className="mf-form" onSubmit={handleCreate}>
                        <h3 className="mf-form-title">Add New Listing</h3>

                        <label className="mf-label">Produce Name *</label>
                        <input className="mf-input" type="text" placeholder="e.g. Tomato, Rice, Wheat"
                            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />

                        <label className="mf-label">Category *</label>
                        <select className="mf-input" value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })} required>
                            <option value="">Select Category</option>
                            {CATEGORIES.map(c => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            ))}
                        </select>

                        <div className="mf-form-row">
                            <div>
                                <label className="mf-label">Quantity *</label>
                                <input className="mf-input" type="number" min="1" placeholder="Amount"
                                    value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
                            </div>
                            <div>
                                <label className="mf-label">Unit</label>
                                <select className="mf-input" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                                    <option value="kg">kg</option>
                                    <option value="quintal">Quintal</option>
                                    <option value="tonne">Tonne</option>
                                </select>
                            </div>
                        </div>

                        <label className="mf-label">Price (₹ per unit) *</label>
                        <input className="mf-input" type="number" min="0" step="0.01" placeholder="Price"
                            value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />

                        <label className="mf-label">Description</label>
                        <textarea rows={3} className="mf-input" placeholder="Brief description of your produce…"
                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

                        <label className="mf-label">Harvest Date (optional)</label>
                        <input className="mf-input" type="date"
                            value={form.harvestDate} onChange={e => setForm({ ...form, harvestDate: e.target.value })} />

                        {error && <p className="mf-form-error">{error}</p>}

                        <button type="submit" disabled={submitting} className="mf-submit-btn">
                            {submitting ? 'Creating…' : 'Create Listing'}
                        </button>
                    </form>
                </div>
            )}

            {/* ── Search / Filter / Sort ── */}
            <div className="mf-controls">
                <input type="text" className="mf-search" placeholder="  Search produce…"
                    value={search} onChange={e => setSearch(e.target.value)} />
                <div className="mf-cat-tabs">
                    {['all', ...CATEGORIES].map(c => (
                        <button key={c}
                            className={`mf-cat-tab ${activeCat === c ? 'mf-cat-tab--active' : ''}`}
                            onClick={() => setActiveCat(c)}>
                            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                        </button>
                    ))}
                </div>
                <select className="mf-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </div>

            {/* ── YOUR LISTINGS (approved only) ── */}
            <div className="mf-section">
                <div className="mf-section-header mf-section-header--mine">
                    <span className="mf-section-icon"></span>
                    <h4 className="mf-section-title">Your Listings</h4>
                    <span className="mf-section-count mf-section-count--mine">{myApproved.length}</span>
                </div>

                {filteredApproved.length > 0 ? (
                    <div className="mf-grid">
                        {filteredApproved.map(l => renderCard(l, true, false))}
                    </div>
                ) : (
                    <div className="mf-empty">
                        <span className="mf-empty-icon"></span>
                        <p className="mf-empty-text">
                            {myApproved.length === 0
                                ? myPending.length > 0
                                    ? `You have ${myPending.length} listing(s) waiting for expert approval.`
                                    : 'No approved listings yet. Click "+ Add New Listing" to get started!'
                                : 'No approved listings match your current filter.'}
                        </p>
                    </div>
                )}
            </div>

            {/* ── OTHER FARMERS (all approved listings from others) ── */}
            <div className="mf-section">
                <div className="mf-section-header mf-section-header--others">
                    <span className="mf-section-icon">🏪</span>
                    <h4 className="mf-section-title">Other Farmers</h4>
                    <span className="mf-section-count mf-section-count--others">{otherListings.length}</span>
                </div>

                {filteredOthers.length > 0 ? (
                    <div className="mf-grid">
                        {filteredOthers.map(l => renderCard(l, false, false))}
                    </div>
                ) : (
                    <div className="mf-empty">
                        <span className="mf-empty-icon">🏪</span>
                        <p className="mf-empty-text">
                            {otherListings.length === 0
                                ? 'No other approved listings in the marketplace yet.'
                                : 'No other listings match your current filter.'}
                        </p>
                    </div>
                )}
            </div>

            {/* ── Rejection Notifications (Bottom Right) ── */}
            <div className="mf-rejection-widget">
                <button className="mf-rejection-toggle" onClick={() => setShowRejections(!showRejections)}>
                     My Messages <span className="mf-rejection-badge">{myRejected.length}</span>
                </button>

                {showRejections && (
                    <div className="mf-rejection-popup">
                        <div className="mf-rejection-header">
                            <h4>My Messages</h4>
                            <button className="mf-rejection-close" onClick={() => setShowRejections(false)}></button>
                        </div>
                        <div className="mf-rejection-list">
                            {myRejected.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                                    No rejected listings.
                                </div>
                            ) : (
                                myRejected.map(l => (
                                    <div key={l._id} className="mf-rejection-msg">
                                        <div className="mf-rm-header">
                                            {l.category && <span className="mf-rm-cat">{l.category}</span>}
                                            <span className="mf-rm-status">REJECTED</span>
                                        </div>
                                        <div className="mf-rm-expert-info">
                                            <span>Reviewed by: <strong>{l.rejectedByEmail || 'expert@agriconnect.com'}</strong></span>
                                        </div>
                                        <h5 className="mf-rm-title">{l.name}</h5>
                                        <div className="mf-rm-details">
                                            <span>Qty: <strong>{l.quantity} {l.unit}</strong></span>
                                            <span>Price: <strong>₹{l.price}/{l.unit}</strong></span>
                                        </div>
                                        {l.description && (
                                            <p className="mf-rm-desc">
                                                {l.description.length > 60 ? l.description.slice(0, 60) + '…' : l.description}
                                            </p>
                                        )}
                                        <div className="mf-rm-reason-box">
                                            <span className="mf-rm-reason-label">Expert Reason:</span>
                                            <p className="mf-rm-reason-text">{l.rejectionReason}</p>
                                        </div>
                                        <div className="mf-rm-actions">
                                            {confirmId === l._id ? (
                                                <>
                                                    <span className="mf-confirm-label">Sure?</span>
                                                    <button className="mf-btn mf-btn--confirm" onClick={() => confirmDelete(l._id)}>Yes</button>
                                                    <button className="mf-btn mf-btn--cancel" onClick={() => setConfirmId(null)}>No</button>
                                                </>
                                            ) : (
                                                <button className="mf-btn mf-btn--cancel mf-rm-btn" onClick={() => setConfirmId(l._id)}>
                                                    Dismiss
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

        </PageLayout>
    )
}

export default MarketplaceFarmer
