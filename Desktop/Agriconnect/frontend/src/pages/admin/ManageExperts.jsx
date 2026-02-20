import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import API from '../../services/api'

const ManageExperts = () => {
    const [experts, setExperts] = useState([])
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)

    const load = () => {
        API.get('/admin/experts').then(r => setExperts(r.data)).finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const approve = async (id) => {
        await API.put(`/admin/experts/${id}/approve`)
        load()
    }
    const remove = async (id) => {
        if (!window.confirm('Remove this expert?')) return
        await API.delete(`/admin/experts/${id}`)
        load()
    }

    const filtered = experts.filter(e => filter === 'all' ? true : e.status === filter)

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
            <Navbar role="admin" />
            <div className="content-page">
                <div className="section-title">Manage Experts</div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                    {['all', 'pending', 'approved'].map(s => (
                        <button key={s} onClick={() => setFilter(s)} className="btn"
                            style={{ background: filter === s ? '#e02020' : 'rgba(255,255,255,0.08)', color: '#fff', textTransform: 'capitalize' }}>
                            {s}
                        </button>
                    ))}
                </div>
                {loading ? <p className="text-muted">Loading…</p> : (
                    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {filtered.map(e => (
                            <div key={e._id} className="info-card">
                                <h4>{e.name}</h4>
                                <p className="text-muted" style={{ fontSize: '0.82rem', marginTop: 4 }}>{e.email}</p>
                                <p style={{ fontSize: '0.82rem', marginTop: 6, color: '#ccc' }}>{e.specialization}</p>
                                <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                                    <span className={`badge ${e.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                                        {e.status}
                                    </span>
                                    {e.status !== 'approved' && (
                                        <button className="btn btn-green" style={{ fontSize: '0.75rem', padding: '4px 12px' }} onClick={() => approve(e._id)}>Approve</button>
                                    )}
                                    <button className="btn btn-danger" style={{ fontSize: '0.75rem', padding: '4px 12px' }} onClick={() => remove(e._id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && <p className="text-muted">No experts found.</p>}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageExperts
