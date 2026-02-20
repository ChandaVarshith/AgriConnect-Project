import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import ProduceCard from '../../components/ProduceCard'
import marketplaceService from '../../services/marketplaceService'

const Marketplace = () => {
    const [listings, setListings] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        marketplaceService.getListings().then(res => setListings(res.data)).catch(console.error)
    }, [])

    const filtered = listings.filter(l =>
        l.name?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <Navbar title="Marketplace" publicNav />
            <div className="container" style={{ padding: '40px 24px' }}>
                <h2 className="mb-3">🛒 Farm Produce Marketplace</h2>
                <input type="text" placeholder="🔍 Search produce…" value={search}
                    onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320, marginBottom: 20 }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
                    {filtered.length === 0
                        ? <p>No produce listed yet.</p>
                        : filtered.map(l => <ProduceCard key={l._id} produce={l} showBuy />)
                    }
                </div>
            </div>
        </div>
    )
}

export default Marketplace
