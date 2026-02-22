import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'

const tableStyle = {
    width: '100%', borderCollapse: 'collapse',
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
}
const th = { padding: '12px 16px', color: '#fff', textAlign: 'left', fontSize: '0.82rem', letterSpacing: '0.04em', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }
const td = { padding: '12px 16px', color: '#ddd', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }

const ManageFarmers = () => {
    const [farmers, setFarmers] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        API.get('/admin/farmers').then(r => setFarmers(r.data)).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const filtered = farmers.filter(f =>
        f.name?.toLowerCase().includes(search.toLowerCase()) ||
        f.phone?.includes(search) ||
        f.location?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <PageLayout role="admin" title="Manage Farmers">
            <input placeholder="🔍  Search by name, phone or location…" value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', width: '100%', maxWidth: 420, marginBottom: 24, outline: 'none' }} />

            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        <thead><tr>
                            {['Name', 'Email', 'Phone', 'Location', 'Farm Size', 'Crops Grown'].map(h => <th key={h} style={th}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {filtered.length === 0
                                ? <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: '#666', padding: 28 }}>No farmers found.</td></tr>
                                : filtered.map(f => (
                                    <tr key={f._id}>
                                        <td style={td}>{f.name}</td>
                                        <td style={td}>{f.email || '—'}</td>
                                        <td style={td}>{f.phone}</td>
                                        <td style={td}>{f.location}</td>
                                        <td style={td}>{f.farmSize || '—'}</td>
                                        <td style={td}>{f.cropsGrown?.join(', ') || '—'}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </PageLayout>
    )
}

export default ManageFarmers
