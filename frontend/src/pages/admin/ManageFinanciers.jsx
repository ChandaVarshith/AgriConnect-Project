import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import './ManageFinanciers.css'

const EMPTY = { name: '', orgName: '', email: '', password: '', contact: '', location: '' }

const STATUS_COLORS = {
    pending: { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.35)', color: '#fbbf24' },
    approved: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.35)', color: '#4ade80' },
    rejected: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.35)', color: '#f87171' }
}

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'az_org', label: 'Organization A–Z' },
    { value: 'products_desc', label: 'Most Products First' }
]

const ManageFinanciers = () => {
    const [list, setList] = useState([])
    const [filter, setFilter] = useState('all') // 'all', 'pending', 'approved', 'rejected'
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    const [loading, setL] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [toastMsg, setToastMsg] = useState('')

    const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000) }

    const load = () => {
        setL(true)
        API.get('/admin/financiers').then(r => setList(r.data)).catch(() => { }).finally(() => setL(false))
    }
    useEffect(() => { load() }, [])

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

    const handleStatusUpdate = async (id, status) => {
        try {
            await API.put(`/admin/financiers/${id}/${status}`)
            load()
        } catch { }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this financier? This cannot be undone.')) return
        try {
            await API.delete(`/admin/financiers/${id}`)
            load()
        } catch { }
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await API.post('/admin/financiers', form)
            showToast('✅ Financier added and approved!')
            setForm(EMPTY)
            setShowForm(false)
            load()
        } catch (err) {
            showToast('❌ ' + (err.response?.data?.message || 'Failed to add financier.'))
        } finally {
            setSaving(false)
        }
    }

    const pendingCount = list.filter(f => f.status === 'pending').length

    const applyFiltersAndSort = (dataList) => {
        let out = [...dataList]

        // Status Filter
        if (filter !== 'all') out = out.filter(f => f.status === filter)

        // Search
        if (search.trim()) {
            const q = search.trim().toLowerCase()
            out = out.filter(f =>
                f.orgName?.toLowerCase().includes(q) ||
                f.name?.toLowerCase().includes(q) ||
                f.location?.toLowerCase().includes(q) ||
                f.email?.toLowerCase().includes(q)
            )
        }

        // Sort
        if (sortBy === 'az_org') out.sort((a, b) => (a.orgName || '').localeCompare(b.orgName || ''))
        else if (sortBy === 'products_desc') out.sort((a, b) => (b.loanTypes?.length || 0) - (a.loanTypes?.length || 0))
        return out
    }

    const filtered = applyFiltersAndSort(list)

    return (
        <PageLayout role="admin" title="Manage All Financiers">
            {pendingCount > 0 && (
                <div className="mf-alert-pending">
                    🔔 {pendingCount} organization{pendingCount > 1 ? 's' : ''} awaiting approval.
                </div>
            )}

            {toastMsg && <div className="mf-toast">{toastMsg}</div>}

            <div className="mf-controls">
                <div className="mf-controls-left">
                    <input
                        type="text"
                        className="mf-search"
                        placeholder="🔍 Search organization, location, email…"
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
                    {showForm ? '✕ Cancel' : '+ Add Financier'}
                </button>
            </div>

            {showForm && (
                <div className="mf-form-wrap">
                    <form onSubmit={handleAdd} className="mf-form">
                        <h3 className="mf-form-title">Add New Financier (Auto-Approved)</h3>
                        <div className="mf-form-grid">
                            {[
                                { key: 'orgName', label: 'Organization Name *', type: 'text', required: true },
                                { key: 'name', label: 'Contact Person Name', type: 'text' },
                                { key: 'email', label: 'Email *', type: 'email', required: true },
                                { key: 'password', label: 'Password *', type: 'password', required: true },
                                { key: 'contact', label: 'Phone / Contact', type: 'tel' },
                                { key: 'location', label: 'Location', type: 'text' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="mf-label">{f.label}</label>
                                    <input type={f.type} value={form[f.key]} onChange={set(f.key)} required={f.required} className="mf-input" placeholder={f.label.replace(' *', '')} />
                                </div>
                            ))}
                        </div>
                        <button type="submit" disabled={saving} className="mf-submit-btn">
                            {saving ? 'Saving…' : 'Add Financier'}
                        </button>
                    </form>
                </div>
            )}

            {loading ? <p style={{ color: '#888', textAlign: 'center' }}>Loading financiers...</p> : (
                filtered.length > 0 ? (
                    <div className="mf-grid">
                        {filtered.map(f => {
                            const sc = STATUS_COLORS[f.status] || STATUS_COLORS.pending
                            return (
                                <div key={f._id} className="mf-card" style={{ borderTopColor: sc.color }}>
                                    <div className="mf-card-top">
                                        <span className="mf-badge-cat" style={{ marginRight: '8px' }}>
                                            {f.loanTypes?.length || 0} Products
                                        </span>
                                        <span className="mf-badge-status" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{f.status}</span>
                                    </div>
                                    <h4 className="mf-card-title" style={{ color: '#60a5fa' }}>{f.orgName}</h4>
                                    <p className="mf-card-subtitle">Contact: {f.name || '—'}</p>

                                    <p className="mf-card-row">Location: <strong>{f.location || '—'}</strong></p>
                                    <p className="mf-card-row">Email: <strong>{f.email}</strong></p>
                                    <p className="mf-card-row">Phone: <strong>{f.contact || '—'}</strong></p>

                                    <div className="mf-actions-row">
                                        {f.status !== 'approved' ? (
                                            <>
                                                <button onClick={() => handleStatusUpdate(f._id, 'approve')} className="mf-btn mf-btn-approve">Approve</button>
                                                {f.status === 'pending' && <button onClick={() => handleStatusUpdate(f._id, 'reject')} className="mf-btn mf-btn-reject">Reject</button>}
                                                <button onClick={() => handleDelete(f._id)} className="mf-btn mf-btn-remove">Remove</button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleDelete(f._id)} className="mf-btn mf-btn-remove">Remove</button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="mf-empty">
                        <span className="mf-empty-icon">🏦</span>
                        <p className="mf-empty-text">No financiers found matching your criteria.</p>
                    </div>
                )
            )}
        </PageLayout>
    )
}

export default ManageFinanciers
