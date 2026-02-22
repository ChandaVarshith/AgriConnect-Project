import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'

const th = { padding: '12px 16px', color: '#fff', textAlign: 'left', fontSize: '0.82rem', letterSpacing: '0.04em', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }
const td = { padding: '12px 16px', color: '#ddd', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }

const ManageFinanciers = () => {
    const [list, setList] = useState([])
    const [loading, setL] = useState(true)

    const load = () => API.get('/admin/financiers').then(r => setList(r.data)).catch(() => { }).finally(() => setL(false))
    useEffect(() => { load() }, [])

    const remove = async (id) => {
        if (!window.confirm('Remove this financier?')) return
        await API.delete(`/admin/financiers/${id}`)
        load()
    }

    return (
        <PageLayout role="admin" title="Manage Financiers">
            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <thead><tr>
                            {['Name', 'Email', 'Organisation', 'Status', 'Action'].map(h => <th key={h} style={th}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {list.length === 0
                                ? <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#666', padding: 28 }}>No financiers found.</td></tr>
                                : list.map(f => (
                                    <tr key={f._id}>
                                        <td style={td}>{f.name}</td>
                                        <td style={td}>{f.email}</td>
                                        <td style={td}>{f.organization || '—'}</td>
                                        <td style={td}>
                                            <span style={{ padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700, background: f.status === 'active' ? '#4caf50' : '#f39c12', color: '#000' }}>
                                                {f.status || 'active'}
                                            </span>
                                        </td>
                                        <td style={td}>
                                            <button onClick={() => remove(f._id)} style={{ padding: '4px 12px', background: '#e02020', color: '#fff', fontWeight: 700, fontSize: '0.75rem', border: 'none', borderRadius: 5, cursor: 'pointer' }}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </PageLayout>
    )
}

export default ManageFinanciers
