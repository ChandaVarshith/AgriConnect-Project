import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'

const inputStyle = { padding: '9px 13px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.87rem', outline: 'none', width: '100%', boxSizing: 'border-box' }
const labelStyle = { display: 'block', color: '#ccc', fontSize: '0.78rem', fontWeight: 600, marginBottom: 4 }
const EMPTY = { name: '', email: '', password: '', phone: '', experience: '', specialization: '', qualification: '', languagesSpoken: '', certifications: '' }

const STATUS_COLORS = { pending: { bg: '#f59e0b22', color: '#f59e0b' }, approved: { bg: '#22c55e22', color: '#22c55e' }, rejected: { bg: '#ef444422', color: '#ef4444' } }

const ManageExperts = () => {
    const [experts, setExperts] = useState([])
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState('')

    const fetchExperts = () => {
        setLoading(true)
        API.get('/admin/experts').then(r => setExperts(r.data)).catch(() => { }).finally(() => setLoading(false))
    }
    useEffect(() => { fetchExperts() }, [])

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

    const handleStatusUpdate = async (id, status) => {
        try {
            await API.patch(`/admin/experts/${id}`, { status })
            fetchExperts()
        } catch { }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this expert?')) return
        try {
            await API.delete(`/admin/experts/${id}`)
            fetchExperts()
        } catch { }
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await API.post('/admin/experts', form)
            setToast('✅ Expert added and approved!')
            setForm(EMPTY)
            setShowForm(false)
            fetchExperts()
            setTimeout(() => setToast(''), 3000)
        } catch (err) {
            setToast('❌ ' + (err.response?.data?.message || 'Failed to add expert.'))
            setTimeout(() => setToast(''), 3500)
        } finally {
            setSaving(false)
        }
    }

    const filtered = filter === 'all' ? experts : experts.filter(e => e.status === filter)
    const pending = experts.filter(e => e.status === 'pending')

    return (
        <PageLayout role="admin" title="Manage Experts">
            {pending.length > 0 && (
                <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid #f59e0b', borderRadius: 8, padding: '12px 18px', marginBottom: 20, color: '#f59e0b', fontSize: '0.88rem' }}>
                    🔔 {pending.length} expert{pending.length > 1 ? 's' : ''} awaiting approval.
                </div>
            )}
            {toast && (
                <div style={{ background: toast.startsWith('✅') ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', border: `1px solid ${toast.startsWith('✅') ? '#22c55e' : '#ef4444'}`, borderRadius: 8, padding: '12px 18px', marginBottom: 20, color: '#fff', fontSize: '0.88rem' }}>
                    {toast}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    {['all', 'pending', 'approved', 'rejected'].map(s => (
                        <button key={s} onClick={() => setFilter(s)} style={{
                            background: filter === s ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                            color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px',
                            fontSize: '0.82rem', fontWeight: filter === s ? 700 : 400, cursor: 'pointer', textTransform: 'capitalize',
                        }}>{s}</button>
                    ))}
                </div>
                <button onClick={() => setShowForm(!showForm)} style={{
                    background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6,
                    padding: '10px 22px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                }}>{showForm ? '✕ Cancel' : '+ Add Expert'}</button>
            </div>

            {showForm && (
                <form onSubmit={handleAdd} style={{
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 12, padding: '24px 28px', marginBottom: 28,
                }}>
                    <h3 style={{ color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.3rem', margin: '0 0 20px' }}>Add New Expert (Auto-Approved)</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px 20px', marginBottom: 20 }}>
                        {[
                            { key: 'name', label: 'Full Name *', type: 'text', required: true },
                            { key: 'email', label: 'Email *', type: 'email', required: true },
                            { key: 'password', label: 'Password *', type: 'password', required: true },
                            { key: 'phone', label: 'Phone', type: 'tel' },
                            { key: 'specialization', label: 'Field of Specialization *', type: 'text', required: true },
                            { key: 'experience', label: 'Years of Experience', type: 'number' },
                            { key: 'qualification', label: 'Qualification', type: 'text' },
                            { key: 'languagesSpoken', label: 'Languages Spoken', type: 'text' },
                            { key: 'certifications', label: 'Certifications', type: 'text' },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={labelStyle}>{f.label}</label>
                                <input type={f.type} value={form[f.key]} onChange={set(f.key)} required={f.required} style={inputStyle} placeholder={f.label.replace(' *', '')} />
                            </div>
                        ))}
                    </div>
                    <button type="submit" disabled={saving} style={{
                        background: saving ? '#1e40af' : '#3b82f6', color: '#fff', border: 'none',
                        borderRadius: 6, padding: '10px 28px', fontWeight: 700, fontSize: '0.9rem',
                        cursor: saving ? 'not-allowed' : 'pointer',
                    }}>{saving ? 'Saving…' : 'Add Expert'}</button>
                </form>
            )}

            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : filtered.length === 0 ? (
                <p style={{ color: '#aaa' }}>No experts found.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {filtered.map(e => {
                        const sc = STATUS_COLORS[e.status] || STATUS_COLORS.pending
                        return (
                            <div key={e._id} style={{
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 10, padding: '18px 22px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
                            }}>
                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                        <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.98rem' }}>{e.name}</span>
                                        <span style={{ background: sc.bg, color: sc.color, padding: '2px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700 }}>{e.status}</span>
                                    </div>
                                    <div style={{ color: '#aaa', fontSize: '0.8rem' }}>{e.email}</div>
                                    <div style={{ color: '#bbb', fontSize: '0.8rem' }}>{e.specialization}{e.experience ? ` · ${e.experience}yrs` : ''}</div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {e.status !== 'approved' && (
                                        <button onClick={() => handleStatusUpdate(e._id, 'approved')} style={{ background: '#22c55e', color: '#000', border: 'none', borderRadius: 5, padding: '6px 16px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Approve</button>
                                    )}
                                    {e.status !== 'rejected' && (
                                        <button onClick={() => handleStatusUpdate(e._id, 'rejected')} style={{ background: '#f59e0b', color: '#000', border: 'none', borderRadius: 5, padding: '6px 16px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Reject</button>
                                    )}
                                    <button onClick={() => handleDelete(e._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 16px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Remove</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </PageLayout>
    )
}

export default ManageExperts
