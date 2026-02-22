import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'

const cardStyle = {
    background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '18px 20px',
    transition: 'border 0.2s',
}

const ManageExperts = () => {
    const [experts, setExperts] = useState([])
    const [filter, setFilter] = useState('pending')
    const [loading, setLoading] = useState(true)

    const load = () => {
        setLoading(true)
        API.get('/admin/experts')
            .then(r => setExperts(r.data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }
    useEffect(() => { load() }, [])

    const approve = async (id) => {
        try { await API.put(`/admin/experts/${id}/approve`); load() } catch (e) { alert('Error approving expert.') }
    }
    const reject = async (id) => {
        try { await API.put(`/admin/experts/${id}/reject`); load() } catch (e) { alert('Error rejecting expert.') }
    }
    const remove = async (id) => {
        if (!window.confirm('Permanently remove this expert?')) return
        try { await API.delete(`/admin/experts/${id}`); load() } catch (e) { alert('Error removing expert.') }
    }

    const pendingCount = experts.filter(e => e.status === 'pending').length
    const filtered = experts.filter(e => filter === 'all' ? true : e.status === filter)

    const statusColor = (s) => {
        if (s === 'approved') return '#4caf50'
        if (s === 'rejected') return '#e02020'
        return '#f39c12'
    }

    return (
        <PageLayout role="admin" title="Manage Experts">

            {/* Pending Requests Banner */}
            {pendingCount > 0 && (
                <div style={{
                    background: 'rgba(243,156,18,0.15)',
                    border: '1px solid rgba(243,156,18,0.4)',
                    borderRadius: 8, padding: '12px 18px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    marginBottom: 20,
                }}>
                    <span style={{ fontSize: '1.4rem' }}>🔔</span>
                    <div>
                        <p style={{ color: '#f39c12', fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>
                            {pendingCount} Pending Expert Request{pendingCount > 1 ? 's' : ''}
                        </p>
                        <p style={{ color: '#ccc', margin: 0, fontSize: '0.8rem', marginTop: 2 }}>
                            Review and approve or reject expert registration requests below.
                        </p>
                    </div>
                    <button
                        onClick={() => setFilter('pending')}
                        style={{
                            marginLeft: 'auto', padding: '6px 14px', background: '#f39c12',
                            color: '#000', fontWeight: 700, fontSize: '0.8rem',
                            border: 'none', borderRadius: 6, cursor: 'pointer',
                        }}
                    >
                        View Pending
                    </button>
                </div>
            )}

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                {['pending', 'approved', 'rejected', 'all'].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{
                        padding: '6px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
                        background: filter === s ? '#e02020' : 'rgba(255,255,255,0.1)',
                        color: '#fff', fontSize: '0.82rem', fontWeight: 600,
                        textTransform: 'capitalize', position: 'relative',
                    }}>
                        {s}
                        {s === 'pending' && pendingCount > 0 && (
                            <span style={{
                                position: 'absolute', top: -6, right: -6,
                                background: '#f39c12', color: '#000',
                                borderRadius: '50%', width: 18, height: 18,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.65rem', fontWeight: 800,
                            }}>{pendingCount}</span>
                        )}
                    </button>
                ))}
                <span style={{ marginLeft: 'auto', color: '#888', fontSize: '0.8rem' }}>
                    {filtered.length} expert{filtered.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Cards */}
            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : (
                <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {filtered.length === 0 && <p style={{ color: '#888' }}>No experts found.</p>}
                    {filtered.map(e => (
                        <div key={e._id} style={{
                            ...cardStyle,
                            borderColor: e.status === 'pending'
                                ? 'rgba(243,156,18,0.35)'
                                : e.status === 'approved'
                                    ? 'rgba(76,175,80,0.3)'
                                    : 'rgba(255,255,255,0.12)',
                        }}>
                            {/* Status badge + name */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                <h4 style={{ color: '#fff', margin: 0, fontSize: '1rem' }}>{e.name}</h4>
                                <span style={{
                                    padding: '3px 10px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 700,
                                    background: statusColor(e.status) + '33',
                                    color: statusColor(e.status),
                                    border: `1px solid ${statusColor(e.status)}55`,
                                }}>
                                    {e.status === 'pending' ? '⏳ Pending' : e.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                                </span>
                            </div>

                            <p style={{ fontSize: '0.82rem', color: '#93c5fd', margin: '2px 0' }}>{e.email}</p>
                            <p style={{ fontSize: '0.82rem', color: '#ccc', margin: '6px 0 0' }}>
                                <span style={{ color: '#888' }}>Specialization: </span>{e.specialization}
                            </p>
                            {e.createdAt && (
                                <p style={{ fontSize: '0.75rem', color: '#666', margin: '4px 0 0' }}>
                                    Requested: {new Date(e.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            )}

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                                {e.status === 'pending' && (
                                    <>
                                        <button onClick={() => approve(e._id)} style={{
                                            flex: 1, padding: '7px 0', background: '#4caf50',
                                            color: '#fff', fontWeight: 700, fontSize: '0.78rem',
                                            border: 'none', borderRadius: 6, cursor: 'pointer',
                                        }}>
                                            ✅ Approve
                                        </button>
                                        <button onClick={() => reject(e._id)} style={{
                                            flex: 1, padding: '7px 0', background: 'rgba(224,32,32,0.15)',
                                            color: '#e02020', fontWeight: 700, fontSize: '0.78rem',
                                            border: '1px solid rgba(224,32,32,0.4)', borderRadius: 6, cursor: 'pointer',
                                        }}>
                                            ❌ Reject
                                        </button>
                                    </>
                                )}
                                {e.status === 'approved' && (
                                    <button onClick={() => reject(e._id)} style={{
                                        padding: '7px 14px', background: 'rgba(224,32,32,0.15)',
                                        color: '#e02020', fontWeight: 700, fontSize: '0.78rem',
                                        border: '1px solid rgba(224,32,32,0.4)', borderRadius: 6, cursor: 'pointer',
                                    }}>
                                        Revoke Approval
                                    </button>
                                )}
                                {e.status === 'rejected' && (
                                    <button onClick={() => approve(e._id)} style={{
                                        padding: '7px 14px', background: 'rgba(76,175,80,0.15)',
                                        color: '#4caf50', fontWeight: 700, fontSize: '0.78rem',
                                        border: '1px solid rgba(76,175,80,0.4)', borderRadius: 6, cursor: 'pointer',
                                    }}>
                                        Re-Approve
                                    </button>
                                )}
                                <button onClick={() => remove(e._id)} style={{
                                    padding: '7px 12px', background: 'transparent',
                                    color: '#666', fontWeight: 600, fontSize: '0.78rem',
                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer',
                                }}>
                                    🗑 Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageLayout>
    )
}

export default ManageExperts
