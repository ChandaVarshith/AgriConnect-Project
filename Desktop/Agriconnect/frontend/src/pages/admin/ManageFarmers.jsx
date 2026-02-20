import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import API from '../../services/api'

const ManageFarmers = () => {
    const [farmers, setFarmers] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        API.get('/admin/farmers').then(r => setFarmers(r.data)).finally(() => setLoading(false))
    }, [])

    const filtered = farmers.filter(f =>
        f.name?.toLowerCase().includes(search.toLowerCase()) ||
        f.phone?.includes(search) ||
        f.location?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
            <Navbar role="admin" />
            <div className="content-page">
                <div className="section-title">View All Farmers</div>
                <input className="dark-input" placeholder="🔍  Search by name, phone or location…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ maxWidth: 420, marginBottom: 24 }} />
                {loading
                    ? <p className="text-muted">Loading…</p>
                    : (
                        <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th><th>Email</th><th>Phone</th>
                                        <th>Location</th><th>Farm Size</th><th>Crops Grown</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0
                                        ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#666' }}>No farmers found.</td></tr>
                                        : filtered.map(f => (
                                            <tr key={f._id}>
                                                <td>{f.name}</td>
                                                <td>{f.email || '—'}</td>
                                                <td>{f.phone}</td>
                                                <td>{f.location}</td>
                                                <td>{f.farmSize || '—'}</td>
                                                <td>{f.cropsGrown?.join(', ') || '—'}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ManageFarmers
