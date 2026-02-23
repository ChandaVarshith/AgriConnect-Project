import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'

const ExpertMarketplace = () => {
    const [pending, setPending] = useState([])
    const [approved, setApproved] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState('')

    const load = async () => {
        setLoading(true)
        try {
            const [pRes, aRes] = await Promise.all([
                API.get('/marketplace/expert/pending'),
                API.get('/marketplace'),
            ])
            setPending(pRes.data)
            setApproved(aRes.data)
        } catch { } finally {
            setLoading(false)
        }
    }
    useEffect(() => { load() }, [])

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

    const approve = async (id) => {
        try { await API.put(`/marketplace/${id}/approve`); showToast('✅ Listing approved!'); load() } catch { showToast('❌ Failed.') }
    }
    const reject = async (id) => {
        try { await API.put(`/marketplace/${id}/reject`); showToast('🚫 Listing rejected.'); load() } catch { showToast('❌ Failed.') }
    }
    const remove = async (id) => {
        try { await API.delete(`/marketplace/${id}/expert-remove`); showToast('🗑 Removed from marketplace.'); load() } catch { showToast('❌ Failed.') }
    }

    const Card = ({ item, actions }) => (
        <div style={{
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12, padding: '20px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12,
        }}>
            <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: 4, fontFamily: "'Barlow Condensed', sans-serif" }}>{item.name}</div>
                <div style={{ color: '#aaa', fontSize: '0.82rem', marginBottom: 2 }}>₹{item.price}/{item.unit || 'kg'} · {item.quantity} {item.unit || 'kg'} available</div>
                {item.description && <div style={{ color: '#bbb', fontSize: '0.8rem', marginBottom: 4 }}>{item.description}</div>}
                <div style={{ color: '#888', fontSize: '0.78rem' }}>
                    Farmer: {item.farmerName || item.farmerId?.name || '—'} · 📞 {item.farmerPhone || item.farmerId?.phone || '—'}
                </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {actions}
            </div>
        </div>
    )

    const btn = (label, color, textColor, onClick) => (
        <button onClick={onClick} style={{ background: color, color: textColor, border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
            {label}
        </button>
    )

    return (
        <PageLayout role="expert" title="Marketplace Management">
            {toast && (
                <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '11px 18px', marginBottom: 20, color: '#fff', fontSize: '0.88rem' }}>
                    {toast}
                </div>
            )}

            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : (
                <>
                    <section style={{ marginBottom: 36 }}>
                        <h2 style={{ color: '#f59e0b', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.4rem', margin: '0 0 16px' }}>
                            ⏳ Pending Approval ({pending.length})
                        </h2>
                        {pending.length === 0
                            ? <p style={{ color: '#aaa', fontSize: '0.88rem' }}>No pending listings. All caught up!</p>
                            : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {pending.map(p => (
                                    <Card key={p._id} item={p} actions={[
                                        btn('✓ Approve', '#22c55e', '#000', () => approve(p._id)),
                                        btn('✕ Reject', '#ef4444', '#fff', () => reject(p._id)),
                                    ]} />
                                ))}
                            </div>}
                    </section>

                    <section>
                        <h2 style={{ color: '#22c55e', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.4rem', margin: '0 0 16px' }}>
                            ✅ Active Listings ({approved.length})
                        </h2>
                        {approved.length === 0
                            ? <p style={{ color: '#aaa', fontSize: '0.88rem' }}>No approved listings yet.</p>
                            : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {approved.map(a => (
                                    <Card key={a._id} item={a} actions={[
                                        btn('🗑 Remove', '#ef4444', '#fff', () => remove(a._id)),
                                    ]} />
                                ))}
                            </div>}
                    </section>
                </>
            )}
        </PageLayout>
    )
}

export default ExpertMarketplace
