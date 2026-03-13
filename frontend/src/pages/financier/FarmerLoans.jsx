import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import './FarmerLoans.css'

const FarmerLoans = () => {
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        API.get('/loans/farmer-loans').then(r => setGroups(r.data)).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const statusColor = (s) => s === 'approved' ? '#22c55e' : s === 'rejected' ? '#ef4444' : '#f59e0b'

    return (
        <PageLayout role="financier" title="Farmer Loan Portfolio">
            <p className="farmer-loans-intro">
                All loan applications grouped by farmer. Track portfolio performance and application status.
            </p>

            {loading ? <p className="farmer-loans-loading">Loading…</p> : groups.length === 0 ? (
                <p className="farmer-loans-empty">No loan applications yet.</p>
            ) : (
                <div className="farmer-loans-list">
                    {groups.map((g, i) => (
                        <div key={i} className="farmer-loans-group">
                            {/* Farmer Header */}
                            <div className="farmer-loans-header">
                                <div>
                                    <div className="farmer-loans-name">
                                         {g.farmer?.name || 'Unknown Farmer'}
                                    </div>
                                    <div className="farmer-loans-details">
                                         {g.farmer?.phone || '—'} · {g.farmer?.email || '—'} · {g.farmer?.location || '—'}
                                    </div>
                                </div>
                                <div className="farmer-loans-statuses">
                                    {['pending', 'approved', 'rejected'].map(s => {
                                        const count = g.applications.filter(a => a.status === s).length
                                        return count > 0 ? (
                                            <span key={s} className="farmer-loans-status-badge" style={{ background: `${statusColor(s)}20`, color: statusColor(s) }}>
                                                {count} {s}
                                            </span>
                                        ) : null
                                    })}
                                </div>
                            </div>

                            {/* Applications */}
                            <div className="farmer-loans-apps-container">
                                {g.applications.map(app => (
                                    <div key={app._id} className="farmer-loans-app-card" style={{
                                        borderLeft: `3px solid ${statusColor(app.status)}`
                                    }}>
                                        <div>
                                            <div className="farmer-loans-app-title">{app.loanId?.title || 'Loan'}</div>
                                            <div className="farmer-loans-app-meta">
                                                {app.loanId?.type} · ₹{app.loanId?.amount?.toLocaleString() || '—'} · {app.loanId?.interestRate}% interest
                                            </div>
                                            {app.purpose && <div className="farmer-loans-app-purpose">Purpose: {app.purpose}</div>}
                                        </div>
                                        <div className="farmer-loans-app-actions">
                                            <span className="farmer-loans-app-date">{new Date(app.createdAt).toLocaleDateString()}</span>
                                            <span className="farmer-loans-app-status" style={{ background: `${statusColor(app.status)}20`, color: statusColor(app.status) }}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageLayout>
    )
}

export default FarmerLoans
