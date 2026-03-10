import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import './ManageFarmers.css'

const EMPTY = { name: '', email: '', phone: '', password: '', district: '', state: '', farmSize: '', primaryCrops: '', preferredLanguage: 'en' }

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'az', label: 'Name A–Z' },
    { value: 'farmsize_desc', label: 'Farm Size: Large → Small' },
    { value: 'farmsize_asc', label: 'Farm Size: Small → Large' },
]

const LANG_LABELS = { en: 'English', hi: 'Hindi', te: 'Telugu', es: 'Spanish' }

const ManageFarmers = () => {
    const [farmers, setFarmers] = useState([])
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState('')

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3200) }

    const fetchFarmers = () => {
        setLoading(true)
        API.get('/admin/farmers').then(r => setFarmers(r.data)).catch(() => { }).finally(() => setLoading(false))
    }

    useEffect(() => { fetchFarmers() }, [])

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

    const handleAdd = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await API.post('/admin/farmers', form)
            showToast('✅ Farmer added successfully!')
            setForm(EMPTY)
            setShowForm(false)
            fetchFarmers()
        } catch (err) {
            showToast('❌ ' + (err.response?.data?.message || 'Failed to add farmer.'))
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (farmer) => {
        if (!window.confirm(`Remove farmer "${farmer.name}"? This cannot be undone.`)) return
        try {
            await API.delete(`/admin/farmers/${farmer._id}`)
            showToast(`🗑️ ${farmer.name} removed successfully.`)
            fetchFarmers()
        } catch (err) {
            const status = err.response?.status
            const msg = err.response?.data?.message || err.message || 'Request failed'
            showToast(`❌ [${status || 'NET'}] ${msg}`)
            console.error('Delete farmer error:', { status, data: err.response?.data, err })
        }
    }

    const applyFiltersAndSort = (list) => {
        let out = [...list]
        if (search.trim()) {
            const q = search.trim().toLowerCase()
            out = out.filter(f =>
                f.name?.toLowerCase().includes(q) ||
                f.phone?.includes(q) ||
                f.location?.toLowerCase().includes(q) ||
                f.district?.toLowerCase().includes(q) ||
                f.state?.toLowerCase().includes(q) ||
                f.primaryCrops?.toLowerCase().includes(q)
            )
        }
        if (sortBy === 'az') out.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        else if (sortBy === 'farmsize_desc') out.sort((a, b) => (parseFloat(b.farmSize) || 0) - (parseFloat(a.farmSize) || 0))
        else if (sortBy === 'farmsize_asc') out.sort((a, b) => (parseFloat(a.farmSize) || 0) - (parseFloat(b.farmSize) || 0))
        return out
    }

    const filtered = applyFiltersAndSort(farmers)

    return (
        <PageLayout role="admin" title="Manage Farmers">
            {toast && (
                <div className={`mf-toast ${toast.startsWith('❌') ? 'mf-toast--error' : ''}`}>{toast}</div>
            )}

            <div className="mf-controls">
                <div className="mf-controls-left">
                    <input
                        type="text"
                        className="mf-search"
                        placeholder="🔍 Search name, phone, district, crop…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select className="mf-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`mf-add-btn ${showForm ? 'mf-add-btn--cancel' : ''}`}
                >
                    {showForm ? '✕ Cancel' : '+ Add Farmer'}
                </button>
            </div>

            {showForm && (
                <div className="mf-form-wrap">
                    <form onSubmit={handleAdd} className="mf-form">
                        <h3 className="mf-form-title">Add New Farmer</h3>
                        <div className="mf-form-grid">
                            {[
                                { key: 'name', label: 'Full Name *', type: 'text', required: true },
                                { key: 'phone', label: 'Phone Number *', type: 'tel', required: true },
                                { key: 'password', label: 'Password *', type: 'password', required: true },
                                { key: 'email', label: 'Email', type: 'email', required: false },
                                { key: 'district', label: 'District', type: 'text' },
                                { key: 'state', label: 'State', type: 'text' },
                                { key: 'farmSize', label: 'Farm Size (acres)', type: 'text' },
                                { key: 'primaryCrops', label: 'Primary Crops (comma separated)', type: 'text' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="mf-label">{f.label}</label>
                                    <input type={f.type} value={form[f.key]} onChange={set(f.key)} required={f.required} className="mf-input" placeholder={f.label.replace(' *', '')} />
                                </div>
                            ))}
                            <div>
                                <label className="mf-label">Preferred Language</label>
                                <select value={form.preferredLanguage} onChange={set('preferredLanguage')} className="mf-input">
                                    <option value="en">English</option>
                                    <option value="hi">Hindi</option>
                                    <option value="te">Telugu</option>
                                    <option value="es">Spanish</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" disabled={saving} className="mf-submit-btn">
                            {saving ? 'Saving…' : 'Add Farmer'}
                        </button>
                    </form>
                </div>
            )}

            <div className="mf-results-meta">
                {!loading && <span>{filtered.length} farmer{filtered.length !== 1 ? 's' : ''} found</span>}
            </div>

            {loading ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '30px' }}>Loading farmers...</p>
            ) : filtered.length > 0 ? (
                <div className="mf-grid">
                    {filtered.map(f => (
                        <div key={f._id} className="mf-card">
                            {/* ── Top badges row ── */}
                            <div className="mf-card-top">
                                <span className="mf-badge-lang">
                                    🌐 {LANG_LABELS[f.preferredLanguage || f.language] || 'English'}
                                </span>
                                {f.farmSize && (
                                    <span className="mf-badge-farm">
                                        🌿 {f.farmSize} ac
                                    </span>
                                )}
                            </div>

                            {/* ── Name & phone ── */}
                            <h4 className="mf-card-title">{f.name}</h4>
                            <p className="mf-card-phone">📞 {f.phone}</p>

                            {/* ── Divider ── */}
                            <div className="mf-card-divider" />

                            {/* ── Detail rows ── */}
                            <div className="mf-card-details">
                                {f.email && (
                                    <div className="mf-detail-row">
                                        <span className="mf-detail-label">✉️ Email</span>
                                        <span className="mf-detail-value">{f.email}</span>
                                    </div>
                                )}
                                <div className="mf-detail-row">
                                    <span className="mf-detail-label">📍 District</span>
                                    <span className="mf-detail-value">{f.district || '—'}</span>
                                </div>
                                <div className="mf-detail-row">
                                    <span className="mf-detail-label">🗺️ State</span>
                                    <span className="mf-detail-value">{f.state || '—'}</span>
                                </div>
                                <div className="mf-detail-row">
                                    <span className="mf-detail-label">📐 Farm Size</span>
                                    <span className="mf-detail-value">{f.farmSize ? `${f.farmSize} acres` : '—'}</span>
                                </div>
                                <div className="mf-detail-row">
                                    <span className="mf-detail-label">🌾 Crops</span>
                                    <span className="mf-detail-value">{f.primaryCrops || '—'}</span>
                                </div>
                                <div className="mf-detail-row">
                                    <span className="mf-detail-label">🗓️ Joined</span>
                                    <span className="mf-detail-value">
                                        {f.createdAt
                                            ? new Date(f.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : '—'}
                                    </span>
                                </div>
                            </div>

                            {/* ── Actions ── */}
                            <div className="mf-actions-row">
                                <button onClick={() => handleDelete(f)} className="mf-btn mf-btn-remove">
                                    🗑️ Remove Farmer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mf-empty">
                    <span className="mf-empty-icon">🌾</span>
                    <p className="mf-empty-text">No farmers found matching your criteria.</p>
                </div>
            )}
        </PageLayout>
    )
}

export default ManageFarmers
