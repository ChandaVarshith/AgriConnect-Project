import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import ProduceCard from '../../components/ProduceCard'
import marketplaceService from '../../services/marketplaceService'
import './Marketplace.css'

const CATEGORIES = ['vegetables', 'fruits', 'grains', 'dairy', 'other']

const Marketplace = () => {
    const [listings, setListings] = useState([])
    const [search, setSearch] = useState('')
    const [activeCat, setActiveCat] = useState('all')
    const [sortOpt, setSortOpt] = useState('newest')

    useEffect(() => {
        marketplaceService.getListings().then(res => setListings(res.data)).catch(console.error)
    }, [])

    let filtered = [...listings]

    // 1. Filter by Search
    if (search.trim()) {
        const q = search.trim().toLowerCase()
        filtered = filtered.filter(l => l.name?.toLowerCase().includes(q))
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

    return (
        <PageLayout role="public" publicNav title="🛒 Farm Produce Marketplace">
            <div className="marketplace-content">

                {/* ── Search / Filter / Sort ── */}
                <div className="marketplace-controls">
                    <input type="text" className="marketplace-search" placeholder="🔍  Search produce…"
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
                <div className="marketplace-grid">
                    {filtered.length === 0
                        ? <p style={{ color: '#aaa' }}>No produce listed yet.</p>
                        : filtered.map(l => <ProduceCard key={l._id} produce={l} showBuy />)
                    }
                </div>
            </div>
        </PageLayout>
    )
}

export default Marketplace
