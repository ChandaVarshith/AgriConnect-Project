import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import './LoanRequests.css'

const STATUS_COLORS = {
    pending: { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.35)', color: '#fbbf24' },
    approved: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.35)', color: '#4ade80' },
    rejected: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.35)', color: '#f87171' }
}

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'amount_desc', label: 'Highest Amount' },
]

// To absolute URLs for documents
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SERVER_URL = API_BASE_URL.replace('/api', '')

const LoanRequests = () => {
    const [apps, setApps] = useState([])
    const [filter, setFilter] = useState('all') // 'all', 'pending', 'approved', 'rejected'
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    const [loading, setL] = useState(true)
    const [toastMsg, setToastMsg] = useState('')

    const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000) }

    const load = () => {
        setL(true)
        API.get('/loans/applications').then(r => setApps(r.data)).catch(() => { }).finally(() => setL(false))
    }
    useEffect(() => { load() }, [])

    const updateStatus = async (id, status) => {
        try {
            await API.patch(`/loans/applications/${id}`, { status })
            showToast(`✅ Application ${status === 'approved' ? 'approved' : 'rejected'}.`)
            load()
        } catch {
            showToast('❌ Failed to update status.')
        }
    }

    const pendingCount = apps.filter(a => a.status === 'pending').length

    const applyFiltersAndSort = (list) => {
        let out = [...list]

        // Status filter
        if (filter !== 'all') out = out.filter(a => a.status === filter)

        // Search
        if (search.trim()) {
            const q = search.trim().toLowerCase()
            out = out.filter(a =>
                a.farmerId?.name?.toLowerCase().includes(q) ||
                a.farmerId?.phone?.toLowerCase().includes(q) ||
                a.loanId?.title?.toLowerCase().includes(q) ||
                a.purpose?.toLowerCase().includes(q)
            )
        }

        // Sort
        if (sortBy === 'newest') out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        else if (sortBy === 'oldest') out.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        else if (sortBy === 'amount_desc') out.sort((a, b) => (b.loanId?.amount || 0) - (a.loanId?.amount || 0))

        return out
    }

    const filtered = applyFiltersAndSort(apps)

    return (
        <PageLayout role="financier" title="Loan Requests">
            {pendingCount > 0 && (
                <div className="lr-alert-pending">
                    🔔 {pendingCount} loan application{pendingCount > 1 ? 's' : ''} awaiting review.
                </div>
            )}

            {toastMsg && <div className="lr-toast">{toastMsg}</div>}

            <div className="lr-controls">
                <div className="lr-controls-left">
                    <input
                        type="text"
                        className="lr-search"
                        placeholder="🔍 Search farmer, phone, or loan…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <div className="lr-cat-tabs">
                        {['all', 'pending', 'approved', 'rejected'].map(s => (
                            <button key={s}
                                onClick={() => setFilter(s)}
                                className={`lr-cat-tab ${filter === s ? 'lr-cat-tab--active' : ''}`}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>

                    <select className="lr-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
            </div>

            {loading ? <p className="lr-subtitle-text" style={{ textAlign: 'center' }}>Loading applications...</p> : (
                filtered.length > 0 ? (
                    <div className="lr-grid">
                        {filtered.map(app => {
                            const sc = STATUS_COLORS[app.status] || STATUS_COLORS.pending
                            return (
                                <div key={app._id} className="lr-card" style={{ borderTopColor: sc.color }}>
                                    <div className="lr-card-top">
                                        <span className="lr-badge-status" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{app.status}</span>
                                    </div>
                                    <h4 className="lr-card-title">{app.farmerId?.name || 'Farmer'}</h4>
                                    <p className="lr-card-subtitle">Phone: {app.farmerId?.phone || '—'}</p>

                                    <p className="lr-card-row">Loan Title: <strong>{app.loanId?.title || app.loanId?.type || '—'}</strong></p>
                                    {app.loanId?.amount && <p className="lr-card-row">Amount: <strong>₹{app.loanId.amount.toLocaleString()}</strong></p>}
                                    {app.loanId?.interestRate && <p className="lr-card-row">Interest: <strong>{app.loanId.interestRate}% p.a.</strong></p>}
                                    {app.purpose && <p className="lr-card-row">Purpose: <strong>{app.purpose}</strong></p>}
                                    {app.income && <p className="lr-card-row">Annual Income: <strong>₹{Number(app.income).toLocaleString()}</strong></p>}
                                    <p className="lr-card-row">Applied: <strong>{new Date(app.createdAt).toLocaleDateString()}</strong></p>

                                    {app.documents && app.documents.length > 0 && (
                                        <div className="lr-docs-list">
                                            <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#94a3b8' }}>Attached Documents:</p>
                                            {app.documents.map((doc, idx) => {
                                                const norm = doc.path.replace(/\\/g, '/');
                                                const uIdx = norm.indexOf('uploads/');
                                                const finalPath = uIdx !== -1 ? norm.substring(uIdx) : norm;
                                                return (
                                                    <a
                                                        key={idx}
                                                        href={`${SERVER_URL}/${finalPath}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="lr-doc-link"
                                                    >
                                                        📎 {doc.filename || `Document ${idx + 1}`}
                                                    </a>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {app.status === 'pending' && (
                                        <div className="lr-actions-row">
                                            <button onClick={() => updateStatus(app._id, 'approved')} className="lr-btn lr-btn-approve">Approve</button>
                                            <button onClick={() => updateStatus(app._id, 'rejected')} className="lr-btn lr-btn-reject">Reject</button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="lr-empty">
                        <span className="lr-empty-icon">📄</span>
                        <p className="lr-empty-text">No loan applications found matching your criteria.</p>
                    </div>
                )
            )}
        </PageLayout>
    )
}

export default LoanRequests
