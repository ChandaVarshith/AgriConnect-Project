import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import API from '../../services/api'

const ManageFinanciers = () => {
    const [list, setList] = useState([])
    const [loading, setL] = useState(true)

    const load = () => API.get('/admin/financiers').then(r => setList(r.data)).finally(() => setL(false))
    useEffect(() => { load() }, [])

    const remove = async (id) => {
        if (!window.confirm('Remove this financier?')) return
        await API.delete(`/admin/financiers/${id}`)
        load()
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
            <Navbar role="admin" />
            <div className="content-page">
                <div className="section-title">Manage Financiers</div>
                {loading ? <p className="text-muted">Loading…</p> : (
                    <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th><th>Email</th><th>Organization</th><th>Status</th><th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length === 0
                                    ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#666' }}>No financiers found.</td></tr>
                                    : list.map(f => (
                                        <tr key={f._id}>
                                            <td>{f.name}</td>
                                            <td>{f.email}</td>
                                            <td>{f.organization || '—'}</td>
                                            <td><span className={`badge ${f.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{f.status || 'active'}</span></td>
                                            <td>
                                                <button className="btn btn-danger" style={{ fontSize: '0.75rem', padding: '4px 12px' }} onClick={() => remove(f._id)}>Remove</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageFinanciers
