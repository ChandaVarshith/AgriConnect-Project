import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import './PublicBuyResources.css'

const CATEGORIES = ['vegetables', 'fruits', 'grains', 'dairy', 'other']

const PublicBuyResources = () => {
    const [listings, setListings] = useState([])
    const [search, setSearch] = useState('')
    const [activeCat, setActiveCat] = useState('all')
    const [sortOpt, setSortOpt] = useState('newest')
    const [loading, setLoading] = useState(true)
    const [inquiry, setInquiry] = useState({}) // id -> {open, revealed, farmerName, farmerPhone, submitting}

    useEffect(() => {
        API.get('/marketplace').then(r => setListings(r.data)).catch(() => { }).finally(() => setLoading(false))
    }, [])

    let filtered = [...listings]

    // 1. Filter by Search
    if (search.trim()) {
        const q = search.trim().toLowerCase()
        filtered = filtered.filter(l =>
            l.name?.toLowerCase().includes(q) ||
            l.category?.toLowerCase().includes(q)
        )
    }

    // 2. Filter by Category
    if (activeCat !== 'all') {
        filtered = filtered.filter(l => (l.category || 'other') === activeCat)
    }

    // 3. Sort
    if (sortOpt === 'newest') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortOpt === 'price_asc') {
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortOpt === 'price_desc') {
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (sortOpt === 'az') {
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }

    const handleInquiry = async (id) => {
        setInquiry(prev => ({ ...prev, [id]: { ...prev[id], submitting: true } }))
        try {
            const r = await API.post(`/marketplace/${id}/purchase`)
            setInquiry(prev => ({
                ...prev,
                [id]: { open: true, revealed: true, submitting: false, farmerName: r.data.farmerName, farmerPhone: r.data.farmerPhone }
            }))
        } catch {
            setInquiry(prev => ({ ...prev, [id]: { ...prev[id], submitting: false } }))
        }
    }

    return (
        <PageLayout role="public" title="Buy Resources">
            <div className="public-buy-resources-header">
                <h2 className="public-buy-resources-title">
                    Fresh Farm Produce 🛒
                </h2>
                <p className="public-buy-resources-subtitle">
                    Browse expert-approved produce directly from farmers. Submit an inquiry to get farmer contact details.
                </p>
            </div>

            <div className="marketplace-controls">
                <input type="text" className="marketplace-search" placeholder="  Search produce…"
                    value={search} onChange={e => setSearch(e.target.value)} />

                <div className="marketplace-cat-tabs">
                    <button className={`marketplace-cat-tab ${activeCat === 'all' ? 'marketplace-cat-tab--active' : ''}`}
                        onClick={() => setActiveCat('all')}>All</button>
                    {CATEGORIES.map(c => (
                        <button key={c}
                            className={`marketplace-cat-tab ${activeCat === c ? 'marketplace-cat-tab--active' : ''}`}
                            onClick={() => setActiveCat(c)}>
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                        </button>
                    ))}
                </div>

                <select className="marketplace-sort-select" value={sortOpt} onChange={e => setSortOpt(e.target.value)}>
                    <option value="newest">Newest First</option>
                    <option value="az">A–Z</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                </select>
            </div>

            {loading ? <p className="public-buy-resources-loading">Loading listings…</p> :
                filtered.length === 0 ? <p className="public-buy-resources-loading">No approved produce available yet.</p> : (
                    <div className="public-buy-resources-grid">
                        {filtered.map(l => {
                            const inq = inquiry[l._id] || {}
                            return (
                                <div key={l._id} className="public-buy-resources-card">
                                    {l.images?.[0] && (
                                        <img src={l.images[0]} alt={l.name}
                                            className="public-buy-resources-card-img" />
                                    )}
                                    <div className="public-buy-resources-card-header">
                                        <div>
                                            <h3 className="public-buy-resources-card-title">{l.name}</h3>
                                            <div className="public-buy-resources-card-category">{l.category || 'Produce'}</div>
                                        </div>
                                        <div className="public-buy-resources-card-price-container">
                                            <div className="public-buy-resources-card-price">₹{l.price}/{l.unit || 'kg'}</div>
                                            <div className="public-buy-resources-card-qty">{l.quantity} {l.unit || 'kg'} available</div>
                                        </div>
                                    </div>
                                    {l.description && <p className="public-buy-resources-card-desc">{l.description}</p>}

                                    {inq.revealed ? (
                                        <div className="public-buy-resources-farmer-info">
                                            <p className="public-buy-resources-farmer-info-title">Farmer Contact Revealed</p>
                                            <p className="public-buy-resources-farmer-info-text">👤 {inq.farmerName}</p>
                                            <p className="public-buy-resources-farmer-info-text"> {inq.farmerPhone}</p>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleInquiry(l._id)} disabled={inq.submitting} className={`public-buy-resources-contact-btn ${inq.submitting ? 'public-buy-resources-contact-btn-loading' : 'public-buy-resources-contact-btn-active'}`}>
                                            {inq.submitting ? 'Processing…' : ' Contact Farmer'}
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
        </PageLayout>
    )
}

export default PublicBuyResources
