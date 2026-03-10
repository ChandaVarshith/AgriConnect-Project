import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import './ManageExperts.css'

const EMPTY = { name: '', email: '', password: '', phone: '', experience: '', specialization: '', qualification: '', languagesSpoken: '', certifications: '' }

const STATUS_COLORS = { pending: { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.35)', color: '#fbbf24' }, approved: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.35)', color: '#4ade80' }, rejected: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.35)', color: '#f87171' } }

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'az', label: 'Name A–Z' },
    { value: 'exp_desc', label: 'Experience: High → Low' }
]

const ManageExperts = () => {
    const [experts, setExperts] = useState([])
    const [filter, setFilter] = useState('all') // 'all', 'pending', 'approved', 'rejected'
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [toastMsg, setToastMsg] = useState('')

    const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000) }

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
            showToast('✅ Expert added and approved!')
            setForm(EMPTY)
            setShowForm(false)
            fetchExperts()
        } catch (err) {
            showToast('❌ ' + (err.response?.data?.message || 'Failed to add expert.'))
        } finally {
            setSaving(false)
        }
    }

    const pendingCount = experts.filter(e => e.status === 'pending').length

    const applyFiltersAndSort = (list) => {
        let out = [...list]

        // Status filter
        if (filter !== 'all') out = out.filter(e => e.status === filter)

        // Search
        if (search.trim()) {
            const q = search.trim().toLowerCase()
            out = out.filter(e =>
                e.name?.toLowerCase().includes(q) ||
                e.email?.toLowerCase().includes(q) ||
                e.specialization?.toLowerCase().includes(q)
            )
        }

        // Sort
        if (sortBy === 'az') out.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        else if (sortBy === 'exp_desc') out.sort((a, b) => (Number(b.experience) || 0) - (Number(a.experience) || 0))
        return out
    }

    const filtered = applyFiltersAndSort(experts)

    return (
        <PageLayout role="admin" title="Manage Experts">
            {pendingCount > 0 && (
                <div className="mf-alert-pending">
                    🔔 {pendingCount} expert{pendingCount > 1 ? 's' : ''} awaiting approval.
                </div>
            )}

            {toastMsg && <div className="mf-toast">{toastMsg}</div>}

            <div className="mf-controls">
                <div className="mf-controls-left">
                    <input
                        type="text"
                        className="mf-search"
                        placeholder="🔍 Search name, email, specialization…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <div className="mf-cat-tabs">
                        {['all', 'pending', 'approved', 'rejected'].map(s => (
                            <button key={s}
                                onClick={() => setFilter(s)}
                                className={`mf-cat-tab ${filter === s ? 'mf-cat-tab--active' : ''}`}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>

                    <select className="mf-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`mf-add-btn ${showForm ? 'mf-add-btn--cancel' : ''}`}
                >
                    {showForm ? '✕ Cancel' : '+ Add Expert'}
                </button>
            </div>

            {showForm && (
                <div className="mf-form-wrap">
                    <form onSubmit={handleAdd} className="mf-form">
                        <h3 className="mf-form-title">Add New Expert (Auto-Approved)</h3>
                        <div className="mf-form-grid">
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
                                    <label className="mf-label">{f.label}</label>
                                    <input type={f.type} value={form[f.key]} onChange={set(f.key)} required={f.required} className="mf-input" placeholder={f.label.replace(' *', '')} />
                                </div>
                            ))}
                        </div>
                        <button type="submit" disabled={saving} className="mf-submit-btn">
                            {saving ? 'Saving…' : 'Add Expert'}
                        </button>
                    </form>
                </div>
            )}

            {loading ? <p style={{ color: '#888', textAlign: 'center' }}>Loading experts...</p> : (
                filtered.length > 0 ? (
                    <div className="mf-grid">
                        {filtered.map(e => {
                            const sc = STATUS_COLORS[e.status] || STATUS_COLORS.pending
                            return (
                                <div key={e._id} className="mf-card" style={{ borderTopColor: sc.color }}>
                                    <div className="mf-card-top">
                                        <span className="mf-badge-status" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{e.status}</span>
                                    </div>
                                    <h4 className="mf-card-title">{e.name}</h4>
                                    <p className="mf-card-subtitle">{e.email}</p>

                                    <p className="mf-card-row">Specialization: <strong>{e.specialization}</strong></p>
                                    {e.experience > 0 && <p className="mf-card-row">Experience: <strong>{e.experience} years</strong></p>}
                                    {e.qualification && <p className="mf-card-row">Qualification: <strong>{e.qualification}</strong></p>}

                                    <div className="mf-actions-row">
                                        {e.status !== 'approved' && (
                                            <button onClick={() => handleStatusUpdate(e._id, 'approved')} className="mf-btn mf-btn-approve">Approve</button>
                                        )}
                                        {e.status === 'pending' && (
                                            <button onClick={() => handleStatusUpdate(e._id, 'rejected')} className="mf-btn mf-btn-reject">Reject</button>
                                        )}
                                        <button onClick={() => handleDelete(e._id)} className="mf-btn mf-btn-remove">Remove</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="mf-empty">
                        <span className="mf-empty-icon">🤝</span>
                        <p className="mf-empty-text">No experts found matching your criteria.</p>
                    </div>
                )
            )}
        </PageLayout>
    )
}

export default ManageExperts
