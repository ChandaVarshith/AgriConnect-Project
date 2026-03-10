import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import loanService from '../../services/loanService'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import './BrowseLoans.css'

const BrowseLoans = () => {
    const { t } = useLanguage()
    const [loans, setLoans] = useState([])
    const [appliedLoanIds, setAppliedLoanIds] = useState(new Set())
    const [search, setSearch] = useState('')
    const [loanTypeSort, setLoanTypeSort] = useState('')
    const [interestSort, setInterestSort] = useState('')
    const [amountSort, setAmountSort] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loanService.getLoans()
            .then(r => setLoans(Array.isArray(r.data) ? r.data : []))
            .catch(() => setError('Failed to load loans. Please try again.'))
            .finally(() => setLoading(false))

        loanService.getMyApplications()
            .then(r => {
                const ids = r.data.map(app => app.loanId?._id || app.loanId)
                setAppliedLoanIds(new Set(ids))
            })
            .catch(err => console.error("Could not fetch applied loans", err))
    }, [])

    const getFiltered = () => {
        let result = [...loans]

        // Search filter
        if (search.trim()) {
            const q = search.toLowerCase()
            result = result.filter(l =>
                l.type?.toLowerCase().includes(q) ||
                l.title?.toLowerCase().includes(q)
            )
        }

        // Loan type sort
        if (loanTypeSort) {
            result = [...result].sort((a, b) => (a.type ?? '').localeCompare(b.type ?? ''))
        }

        // Interest rate sort
        if (interestSort === 'asc') result = [...result].sort((a, b) => (a.interestRate ?? 0) - (b.interestRate ?? 0))
        if (interestSort === 'desc') result = [...result].sort((a, b) => (b.interestRate ?? 0) - (a.interestRate ?? 0))

        // Max amount sort
        if (amountSort === 'asc') result = [...result].sort((a, b) => (a.amount ?? 0) - (b.amount ?? 0))
        if (amountSort === 'desc') result = [...result].sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))

        return result
    }

    const filtered = getFiltered()

    return (
        <PageLayout role="farmer" title={t('viewallloans')}>
            <div className="browse-loans-opt-bar">
                <Link to="/farmer/applied-loans" className="browse-loans-applied-view-btn">
                    View Applied Loans
                </Link>
            </div>
            {/* Search + Filters */}
            <div className="browse-loans-filters">
                {/* Search */}
                <input
                    type="text"
                    placeholder={t('searchloans')}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="browse-loans-search"
                />

                {/* Loan Type dropdown */}
                <select value={loanTypeSort} onChange={e => setLoanTypeSort(e.target.value)} className="browse-loans-dropdown">
                    <option value="">{t('sortbyloantype')}</option>
                    <option value="az">A → Z</option>
                </select>

                {/* Interest Rate dropdown */}
                <select value={interestSort} onChange={e => setInterestSort(e.target.value)} className="browse-loans-dropdown">
                    <option value="">{t('sortbyinterestrate')}</option>
                    <option value="asc">{t('lowtohigh')}</option>
                    <option value="desc">{t('hightolow')}</option>
                </select>

                {/* Max Amount dropdown */}
                <select value={amountSort} onChange={e => setAmountSort(e.target.value)} className="browse-loans-dropdown">
                    <option value="">{t('sortbymaxamount')}</option>
                    <option value="asc">{t('lowtohigh')}</option>
                    <option value="desc">{t('hightolow')}</option>
                </select>
            </div>

            {/* States */}
            {loading && <p className="browse-loans-msg">{t('loading')}</p>}
            {error && <p className="browse-loans-err">{error}</p>}

            {!loading && !error && (
                filtered.length === 0 ? (
                    <div className="browse-loans-empty">
                        <div className="browse-loans-empty-icon">🏦</div>
                        <p className="browse-loans-empty-text">{t('noloansavailable')}</p>
                    </div>
                ) : (
                    <div className="browse-loans-grid">
                        {filtered.map(loan => (
                            <div key={loan._id} className="browse-loans-card">
                                <h4 className="browse-loans-card-title">
                                    {loan.title || loan.type || 'Loan'}
                                </h4>

                                {[
                                    { label: t('loanid'), val: loan._id?.slice(-8).toUpperCase(), color: '#888', mono: true },
                                    { label: t('interestrate'), val: `${loan.interestRate ?? 0}%`, color: '#fbbf24' },
                                    { label: t('maxamount'), val: `₹${(loan.amount ?? 0).toLocaleString()}`, color: '#4ade80' },
                                    { label: t('repaymentperiod'), val: `${loan.tenure ?? '—'} ${t('months')}`, color: '#fff' },
                                ].map(row => (
                                    <div key={row.label} className="browse-loans-card-row">
                                        <span className="browse-loans-card-label">{row.label}</span>
                                        <strong className={`browse-loans-card-value ${row.mono ? 'mono' : ''}`} style={{ color: row.color }}>{row.val}</strong>
                                    </div>
                                ))}

                                {appliedLoanIds.has(loan._id) ? (
                                    <Link
                                        to={`/farmer/applied-loans`}
                                        className="browse-loans-apply-btn applied-state"
                                    >
                                        APPLIED
                                    </Link>
                                ) : (
                                    <Link
                                        to={`/farmer/loan-apply/${loan._id}`}
                                        className="browse-loans-apply-btn"
                                    >
                                        {t('applyforloan')}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                )
            )}
        </PageLayout>
    )
}

export default BrowseLoans
