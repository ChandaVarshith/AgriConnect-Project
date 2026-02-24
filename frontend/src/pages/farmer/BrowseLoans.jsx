import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import loanService from '../../services/loanService'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

const BrowseLoans = () => {
    const { t } = useLanguage()
    const [loans, setLoans] = useState([])
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

    const dropdownStyle = {
        padding: '9px 14px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 6, color: '#fff', fontSize: '0.85rem',
        outline: 'none', cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        minWidth: 160,
    }

    return (
        <PageLayout role="farmer" title={t('viewallloans')}>
            {/* Search + Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Search */}
                <input
                    type="text"
                    placeholder={t('searchloans')}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        padding: '9px 16px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: 6, color: '#fff', fontSize: '0.88rem',
                        outline: 'none', minWidth: 200, flex: '1 1 200px',
                        fontFamily: "'Inter', sans-serif",
                    }}
                />

                {/* Loan Type dropdown */}
                <select value={loanTypeSort} onChange={e => setLoanTypeSort(e.target.value)} style={dropdownStyle}>
                    <option value="">{t('sortbyloantype')}</option>
                    <option value="az">A → Z</option>
                </select>

                {/* Interest Rate dropdown */}
                <select value={interestSort} onChange={e => setInterestSort(e.target.value)} style={dropdownStyle}>
                    <option value="">{t('sortbyinterestrate')}</option>
                    <option value="asc">{t('lowtohigh')}</option>
                    <option value="desc">{t('hightolow')}</option>
                </select>

                {/* Max Amount dropdown */}
                <select value={amountSort} onChange={e => setAmountSort(e.target.value)} style={dropdownStyle}>
                    <option value="">{t('sortbymaxamount')}</option>
                    <option value="asc">{t('lowtohigh')}</option>
                    <option value="desc">{t('hightolow')}</option>
                </select>
            </div>

            {/* States */}
            {loading && <p style={{ color: '#aaa', fontSize: '1rem', textAlign: 'center', padding: 40 }}>{t('loading')}</p>}
            {error && <p style={{ color: '#e55', fontSize: '1rem', textAlign: 'center', padding: 40 }}>{error}</p>}

            {!loading && !error && (
                filtered.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '60px 20px',
                        background: 'rgba(255,255,255,0.04)', borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>🏦</div>
                        <p style={{ color: '#aaa', fontSize: '1.05rem' }}>{t('noloansavailable')}</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                        gap: 20,
                    }}>
                        {filtered.map(loan => (
                            <div key={loan._id} style={{
                                background: 'rgba(255,255,255,0.06)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderTop: '3px solid #22c55e',
                                borderRadius: 12,
                                padding: '22px 24px',
                                display: 'flex', flexDirection: 'column',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'; }}
                            >
                                <h4 style={{ color: '#22c55e', marginBottom: 14, textTransform: 'capitalize', fontSize: '1.1rem', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.04em' }}>
                                    {loan.title || loan.type || 'Loan'}
                                </h4>

                                {[
                                    { label: t('loanid'), val: loan._id?.slice(-8).toUpperCase(), color: '#888', mono: true },
                                    { label: t('interestrate'), val: `${loan.interestRate ?? 0}%`, color: '#fbbf24' },
                                    { label: t('maxamount'), val: `₹${(loan.amount ?? 0).toLocaleString()}`, color: '#4ade80' },
                                    { label: t('repaymentperiod'), val: `${loan.tenure ?? '—'} ${t('months')}`, color: '#fff' },
                                ].map(row => (
                                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span style={{ fontSize: '0.78rem', color: '#888', letterSpacing: '0.04em' }}>{row.label}</span>
                                        <strong style={{ fontSize: '0.9rem', color: row.color, fontFamily: row.mono ? 'monospace' : 'inherit' }}>{row.val}</strong>
                                    </div>
                                ))}

                                <Link
                                    to={`/farmer/loan-apply/${loan._id}`}
                                    style={{
                                        display: 'block', textAlign: 'center',
                                        padding: '11px 0', marginTop: 'auto', paddingTop: 14,
                                        background: 'linear-gradient(135deg,#16a34a,#22c55e)',
                                        color: '#fff',
                                        fontFamily: "'Barlow Condensed', sans-serif",
                                        fontWeight: 700, fontSize: '0.9rem',
                                        borderRadius: 6, textDecoration: 'none',
                                        textTransform: 'uppercase', letterSpacing: '0.06em',
                                        transition: 'opacity 0.2s',
                                        boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    {t('applyforloan')}
                                </Link>
                            </div>
                        ))}
                    </div>
                )
            )}
        </PageLayout>
    )
}

export default BrowseLoans
