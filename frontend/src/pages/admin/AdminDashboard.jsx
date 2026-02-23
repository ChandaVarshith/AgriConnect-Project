import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'

const StatCard = ({ label, value, color }) => (
    <div style={{
        background: 'rgba(255,255,255,0.07)', border: `1px solid ${color}40`,
        borderRadius: 12, padding: '20px 24px', textAlign: 'center', flex: '1 1 140px',
    }}>
        <div style={{ color, fontSize: '2rem', fontWeight: 800, fontFamily: "'Barlow Condensed',sans-serif" }}>{value}</div>
        <div style={{ color: '#aaa', fontSize: '0.82rem', marginTop: 4 }}>{label}</div>
    </div>
)

const BarChart = ({ pending, resolved }) => {
    const max = Math.max(pending, resolved, 1)
    const pct = (v) => Math.round((v / max) * 100)
    return (
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '24px 28px' }}>
            <h3 style={{ color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.2rem', margin: '0 0 24px' }}>
                Farmer Queries — Pending vs Resolved
            </h3>
            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', height: 160 }}>
                {[
                    { label: 'Pending', value: pending, color: '#f59e0b' },
                    { label: 'Resolved', value: resolved, color: '#22c55e' },
                ].map(b => (
                    <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{b.value}</div>
                        <div style={{
                            width: 60, background: `linear-gradient(to top, ${b.color}, ${b.color}88)`,
                            height: `${pct(b.value)}%`, minHeight: b.value > 0 ? 10 : 2,
                            borderRadius: '6px 6px 0 0', transition: 'height 0.4s ease',
                        }} />
                        <div style={{ color: '#aaa', fontSize: '0.8rem' }}>{b.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const AdminDashboard = () => {
    const [stats, setStats] = useState({ farmers: 0, experts: 0, financiers: 0, queries: 0, loans: 0 })
    const [queryStats, setQueryStats] = useState({ pending: 0, resolved: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            API.get('/admin/stats'),
            API.get('/admin/query-stats'),
        ]).then(([s, q]) => {
            setStats(s.data)
            setQueryStats(q.data)
        }).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const statCards = [
        { label: 'Total Farmers', value: stats.farmers, color: '#22c55e' },
        { label: 'Active Experts', value: stats.experts, color: '#3b82f6' },
        { label: 'Financiers', value: stats.financiers, color: '#f59e0b' },
        { label: 'Total Queries', value: stats.queries, color: '#a855f7' },
        { label: 'Active Loans', value: stats.loans, color: '#ec4899' },
    ]

    return (
        <PageLayout role="admin" title="Admin Dashboard">
            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : (
                <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
                        {statCards.map(c => <StatCard key={c.label} {...c} />)}
                    </div>
                    <BarChart pending={queryStats.pending} resolved={queryStats.resolved} />
                </>
            )}
        </PageLayout>
    )
}

export default AdminDashboard
