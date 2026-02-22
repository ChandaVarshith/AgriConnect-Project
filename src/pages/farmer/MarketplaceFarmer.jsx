import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import marketplaceService from '../../services/marketplaceService'
import { useLanguage } from '../../context/LanguageContext'

const CATEGORIES = ['vegetables', 'fruits', 'grains', 'dairy']

const MarketplaceFarmer = () => {
    const { t } = useLanguage()
    const [listings, setListings] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        name: '', category: '', quantity: '', price: '', unit: 'kg',
        description: '', harvestDate: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [confirmId, setConfirmId] = useState(null)  // id of listing pending delete confirm

    const loadListings = () => {
        marketplaceService.getMyListings().then(res => setListings(res.data)).catch(() => { })
    }
    useEffect(() => { loadListings() }, [])

    const handleCreate = async (e) => {
        e.preventDefault(); setLoading(true); setError('')
        try {
            await marketplaceService.createListing(form)
            setShowForm(false)
            setForm({ name: '', category: '', quantity: '', price: '', unit: 'kg', description: '', harvestDate: '' })
            loadListings()
        } catch (err) { setError(err.response?.data?.message || 'Failed to create listing.') }
        finally { setLoading(false) }
    }

    const handleDelete = (id) => {
        setConfirmId(id)    // enter confirm mode for this card
    }

    const confirmDelete = async (id) => {
        // Optimistic update — remove card from UI immediately
        setListings(prev => prev.filter(l => l._id !== id))
        setConfirmId(null)
        try {
            await marketplaceService.deleteListing(id)
        } catch (err) {
            console.error('Delete failed:', err)
            // If server call fails, re-fetch to restore correct state
            loadListings()
        }
    }

    const inp = {
        width: '100%', padding: '10px 14px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 6, color: '#fff', fontSize: '0.9rem',
        outline: 'none', boxSizing: 'border-box', marginBottom: 14,
        fontFamily: "'Inter', sans-serif",
    }
    const lbl = { display: 'block', color: '#bbb', fontSize: '0.78rem', fontWeight: 600, marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }

    return (
        <PageLayout role="farmer" title={t('sellyourproduce')}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <h3 style={{ color: '#bbb', fontWeight: 400, fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", textTransform: 'none', letterSpacing: 0 }}>
                    {listings.length} listing{listings.length !== 1 ? 's' : ''} active
                </h3>
                <button onClick={() => setShowForm(v => !v)} style={{
                    padding: '10px 24px',
                    background: showForm ? 'rgba(220,38,38,0.8)' : 'linear-gradient(135deg,#16a34a,#22c55e)',
                    color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                    border: 'none', borderRadius: 6, cursor: 'pointer',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    boxShadow: showForm ? 'none' : '0 4px 16px rgba(34,197,94,0.3)',
                }}>
                    {showForm ? '✕  Cancel' : `+ ${t('addnewproduct')}`}
                </button>
            </div>

            {/* Add Listing Form */}
            {showForm && (
                <div style={{ maxWidth: 560, marginBottom: 36 }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderTop: '3px solid #22c55e',
                        borderRadius: 14, padding: '28px 26px',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                        animation: 'slideDown 0.25s ease',
                    }}>
                        <h3 style={{ color: '#22c55e', marginBottom: 22, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.3rem', letterSpacing: '0.04em' }}>
                            {t('addnewproduct')}
                        </h3>
                        <form onSubmit={handleCreate}>
                            {/* Name */}
                            <label style={lbl}>{t('productname')} *</label>
                            <input style={inp} type="text" placeholder="e.g. Tomato, Rice, Wheat"
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />

                            {/* Category */}
                            <label style={lbl}>{t('category')} *</label>
                            <select style={{ ...inp, cursor: 'pointer', appearance: 'auto' }} value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })} required>
                                <option value="">{t('selectcategory')}</option>
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c}>{t(c)}</option>
                                ))}
                            </select>

                            {/* Qty + Unit side by side */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={lbl}>{t('availablequantity')} *</label>
                                    <input style={{ ...inp, marginBottom: 0 }} type="number" min="1" placeholder="Amount"
                                        value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={lbl}>{t('unit')}</label>
                                    <select style={{ ...inp, marginBottom: 0, appearance: 'auto', cursor: 'pointer' }}
                                        value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                                        <option value="kg">kg</option>
                                        <option value="quintal">Quintal</option>
                                        <option value="tonne">Tonne</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ height: 14 }} />

                            {/* Price */}
                            <label style={lbl}>{t('priceperkg')} *</label>
                            <input style={inp} type="number" min="0" step="0.01" placeholder="Price"
                                value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />

                            {/* Description */}
                            <label style={lbl}>{t('description')}</label>
                            <textarea rows={3} style={{ ...inp, resize: 'vertical' }} placeholder="Brief description of your produce…"
                                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

                            {/* Harvest Date */}
                            <label style={lbl}>{t('harvestdate')}</label>
                            <input style={inp} type="date"
                                value={form.harvestDate} onChange={e => setForm({ ...form, harvestDate: e.target.value })} />

                            {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>}

                            <button type="submit" disabled={loading} style={{
                                width: '100%', padding: '12px 0',
                                background: loading ? '#166534' : 'linear-gradient(135deg,#16a34a,#22c55e)',
                                color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                                border: 'none', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer',
                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                fontFamily: "'Barlow Condensed', sans-serif",
                                boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
                            }}>
                                {loading ? t('creating') : t('createListing')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Listings Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 18,
            }}>
                {listings.length === 0 ? (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center', padding: '48px 24px',
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>🌾</div>
                        <p style={{ color: '#888', fontSize: '0.95rem' }}>{t('nolistingsyet')}</p>
                    </div>
                ) : listings.map(l => (
                    <div key={l._id} style={{
                        background: 'rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderTop: '3px solid #22c55e',
                        borderRadius: 12, padding: '20px 20px',
                        transition: 'transform 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {/* Category badge */}
                        {l.category && (
                            <span style={{
                                display: 'inline-block', padding: '2px 10px', borderRadius: 50,
                                fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                                letterSpacing: '0.06em', marginBottom: 10,
                                background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)',
                            }}>{t(l.category) || l.category}</span>
                        )}
                        <h4 style={{ color: '#fff', marginBottom: 10, fontSize: '1rem' }}>{l.name}</h4>
                        <p style={{ fontSize: '0.82rem', color: '#bbb', marginBottom: 4 }}>
                            {t('quantity')}: <strong style={{ color: '#fff' }}>{l.quantity} {l.unit}</strong>
                        </p>
                        <p style={{ fontSize: '0.82rem', color: '#bbb', marginBottom: l.description ? 8 : 16 }}>
                            {t('price')}: <strong style={{ color: '#22c55e' }}>₹{l.price}/{l.unit}</strong>
                        </p>
                        {l.description && (
                            <p style={{ fontSize: '0.78rem', color: '#777', marginBottom: 16, lineHeight: 1.5 }}>
                                {l.description.substring(0, 80)}{l.description.length > 80 ? '…' : ''}
                            </p>
                        )}
                        {/* Delete — inline confirm instead of window.confirm */}
                        {confirmId === l._id ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontFamily: "'Inter', sans-serif" }}>Sure?</span>
                                <button onClick={() => confirmDelete(l._id)} style={{
                                    padding: '6px 14px',
                                    background: 'rgba(220,38,38,0.85)',
                                    color: '#fff', border: 'none',
                                    fontWeight: 700, fontSize: '0.75rem',
                                    borderRadius: 5, cursor: 'pointer',
                                    textTransform: 'uppercase', letterSpacing: '0.04em',
                                    fontFamily: "'Barlow Condensed', sans-serif",
                                }}>Yes, Remove</button>
                                <button onClick={() => setConfirmId(null)} style={{
                                    padding: '6px 12px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: '#ccc', border: '1px solid rgba(255,255,255,0.2)',
                                    fontWeight: 600, fontSize: '0.75rem',
                                    borderRadius: 5, cursor: 'pointer',
                                    fontFamily: "'Barlow Condensed', sans-serif",
                                }}>Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => handleDelete(l._id)} style={{
                                padding: '7px 16px',
                                background: 'rgba(220,38,38,0.15)',
                                color: '#f87171', border: '1px solid rgba(220,38,38,0.3)',
                                fontWeight: 700, fontSize: '0.78rem',
                                borderRadius: 5, cursor: 'pointer',
                                textTransform: 'uppercase', letterSpacing: '0.04em',
                                fontFamily: "'Barlow Condensed', sans-serif",
                                transition: 'background 0.15s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.3)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(220,38,38,0.15)'}
                            >{t('remove')}</button>
                        )}
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </PageLayout>
    )
}

export default MarketplaceFarmer
