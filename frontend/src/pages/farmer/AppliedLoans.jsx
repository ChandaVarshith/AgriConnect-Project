import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import loanService from '../../services/loanService'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './AppliedLoans.css'

const AppliedLoans = () => {
    const { t } = useLanguage()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loanService.getMyApplications()
            .then(res => {
                setApplications(Array.isArray(res.data) ? res.data : [])
            })
            .catch(err => {
                console.error(err)
                setError('Failed to load your loan applications.')
            })
            .finally(() => setLoading(false))
    }, [])

    const getStatusStyles = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'approved':
                return { bg: 'rgba(34,197,94,0.15)', text: '#4ade80', icon: '' }
            case 'rejected':
                return { bg: 'rgba(239,68,68,0.15)', text: '#fca5a5', icon: '' }
            default:
                return { bg: 'rgba(234,179,8,0.15)', text: '#fde047', icon: '' }
        }
    }

    return (
        <PageLayout role="farmer" title="My Applied Loans">
            <div className="applied-loans-header-opt">
                <Link to="/farmer/loans" className="applied-loans-back-link">
                    ← Back to Browse Loans
                </Link>
            </div>

            {loading && <p className="applied-loans-loading">{t('loading') || 'Loading…'}</p>}
            {error && <p className="applied-loans-error">{error}</p>}

            {!loading && !error && applications.length === 0 && (
                <div className="applied-loans-empty-card">
                    <div className="applied-loans-empty-icon">🏦</div>
                    <p className="applied-loans-empty-text">You haven't applied for any loans yet.</p>
                    <Link to="/farmer/loans" className="applied-loans-empty-btn">
                        Browse Available Loans
                    </Link>
                </div>
            )}

            {!loading && !error && applications.length > 0 && (
                <div className="applied-loans-grid">
                    {applications.map(app => {
                        const { bg, text, icon } = getStatusStyles(app.status)
                        const loan = app.loanId || {}
                        const date = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Unknown Date'

                        return (
                            <div key={app._id} className="applied-loans-card" style={{ borderTop: `3px solid ${text}` }}>
                                <div className="applied-loans-card-header">
                                    <h4 className="applied-loans-card-title">
                                        {loan.title || loan.type || 'Unknown Loan'}
                                    </h4>
                                    <span className="applied-loans-card-status" style={{ background: bg, color: text }}>
                                        {icon} {app.status || 'Pending'}
                                    </span>
                                </div>
                                <div className="applied-loans-card-date">Applied on: {date}</div>

                                {[
                                    { label: 'Amount Limit', val: `₹${(loan.amount ?? 0).toLocaleString()}`, color: '#fff' },
                                    { label: 'Interest Rate', val: `${loan.interestRate ?? 0}%`, color: '#fbbf24' },
                                    { label: 'Requested For', val: app.purpose || '—', color: '#94a3b8' },
                                    { label: 'Reported Income', val: `₹${(app.income ?? 0).toLocaleString()}`, color: '#4ade80' }
                                ].map(row => (
                                    <div key={row.label} className="applied-loans-card-row">
                                        <span className="applied-loans-card-label">{row.label}</span>
                                        <strong className="applied-loans-card-value" style={{ color: row.color }}>{row.val}</strong>
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
            )}
        </PageLayout>
    )
}

export default AppliedLoans
