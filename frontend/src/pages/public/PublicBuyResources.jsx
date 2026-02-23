import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'

const PublicBuyResources = () => {
    const [listings, setListings] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [inquiry, setInquiry] = useState({}) // id -> {open, revealed, farmerName, farmerPhone, submitting}

    useEffect(() => {
        API.get('/marketplace').then(r => setListings(r.data)).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const filtered = listings.filter(l =>
        l.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.category?.toLowerCase().includes(search.toLowerCase())
    )

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

    const cardStyle = {
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12, padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 10,
    }

    return (
        <PageLayout role="public" title="Buy Resources">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.6rem', margin: '0 0 6px' }}>
                    Fresh Farm Produce 🛒
                </h2>
                <p style={{ color: '#aaa', fontSize: '0.88rem', margin: 0 }}>
                    Browse expert-approved produce directly from farmers. Submit an inquiry to get farmer contact details.
                </p>
            </div>

            <input placeholder="🔍  Search by crop or category…" value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', width: '100%', maxWidth: 400, marginBottom: 24, outline: 'none' }} />

            {loading ? <p style={{ color: '#aaa' }}>Loading listings…</p> :
                filtered.length === 0 ? <p style={{ color: '#aaa' }}>No approved produce available yet.</p> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 20 }}>
                        {filtered.map(l => {
                            const inq = inquiry[l._id] || {}
                            return (
                                <div key={l._id} style={cardStyle}>
                                    {l.images?.[0] && (
                                        <img src={l.images[0]} alt={l.name}
                                            style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h3 style={{ color: '#fff', margin: 0, fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.1rem' }}>{l.name}</h3>
                                            <div style={{ color: '#aaa', fontSize: '0.8rem' }}>{l.category || 'Produce'}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.05rem' }}>₹{l.price}/{l.unit || 'kg'}</div>
                                            <div style={{ color: '#aaa', fontSize: '0.78rem' }}>{l.quantity} {l.unit || 'kg'} available</div>
                                        </div>
                                    </div>
                                    {l.description && <p style={{ color: '#bbb', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{l.description}</p>}

                                    {inq.revealed ? (
                                        <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '12px 14px' }}>
                                            <p style={{ color: '#22c55e', fontSize: '0.82rem', fontWeight: 700, margin: '0 0 4px' }}>✓ Farmer Contact Revealed</p>
                                            <p style={{ color: '#ccc', fontSize: '0.84rem', margin: 0 }}>👤 {inq.farmerName}</p>
                                            <p style={{ color: '#ccc', fontSize: '0.84rem', margin: 0 }}>📞 {inq.farmerPhone}</p>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleInquiry(l._id)} disabled={inq.submitting} style={{
                                            background: inq.submitting ? '#166534' : '#22c55e', color: '#000',
                                            border: 'none', borderRadius: 6, padding: '9px 0', fontSize: '0.88rem',
                                            fontWeight: 700, cursor: inq.submitting ? 'not-allowed' : 'pointer', width: '100%', transition: 'background 0.2s',
                                        }}>
                                            {inq.submitting ? 'Processing…' : '📞 Contact Farmer'}
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
