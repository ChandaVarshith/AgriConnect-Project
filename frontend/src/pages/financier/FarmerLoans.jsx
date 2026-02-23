import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'

const FarmerLoans = () => {
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        API.get('/loans/farmer-loans').then(r => setGroups(r.data)).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const statusColor = (s) => s === 'approved' ? '#22c55e' : s === 'rejected' ? '#ef4444' : '#f59e0b'

    return (
        <PageLayout role="financier" title="Farmer Loan Portfolio">
            <p style={{ color: '#aaa', fontSize: '0.88rem', marginBottom: 24 }}>
                All loan applications grouped by farmer. Track portfolio performance and application status.
            </p>

            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : groups.length === 0 ? (
                <p style={{ color: '#aaa' }}>No loan applications yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {groups.map((g, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 14, overflow: 'hidden',
                        }}>
                            {/* Farmer Header */}
                            <div style={{
                                background: 'rgba(255,255,255,0.05)', padding: '16px 22px',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10,
                            }}>
                                <div>
                                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: "'Barlow Condensed',sans-serif" }}>
                                        👨‍🌾 {g.farmer?.name || 'Unknown Farmer'}
                                    </div>
                                    <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: 2 }}>
                                        📞 {g.farmer?.phone || '—'} · {g.farmer?.email || '—'} · {g.farmer?.location || '—'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {['pending', 'approved', 'rejected'].map(s => {
                                        const count = g.applications.filter(a => a.status === s).length
                                        return count > 0 ? (
                                            <span key={s} style={{ background: `${statusColor(s)}20`, color: statusColor(s), padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>
                                                {count} {s}
                                            </span>
                                        ) : null
                                    })}
                                </div>
                            </div>

                            {/* Applications */}
                            <div style={{ padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {g.applications.map(app => (
                                    <div key={app._id} style={{
                                        background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '12px 16px',
                                        borderLeft: `3px solid ${statusColor(app.status)}`,
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
                                    }}>
                                        <div>
                                            <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>{app.loanId?.title || 'Loan'}</div>
                                            <div style={{ color: '#aaa', fontSize: '0.78rem' }}>
                                                {app.loanId?.type} · ₹{app.loanId?.amount?.toLocaleString() || '—'} · {app.loanId?.interestRate}% interest
                                            </div>
                                            {app.purpose && <div style={{ color: '#999', fontSize: '0.76rem', marginTop: 2 }}>Purpose: {app.purpose}</div>}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ color: '#666', fontSize: '0.76rem' }}>{new Date(app.createdAt).toLocaleDateString()}</span>
                                            <span style={{ background: `${statusColor(app.status)}20`, color: statusColor(app.status), padding: '3px 10px', borderRadius: 50, fontSize: '0.76rem', fontWeight: 700, textTransform: 'capitalize' }}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageLayout>
    )
}

export default FarmerLoans
