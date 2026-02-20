import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import loanService from '../../services/loanService'

const AllLoansFinancier = () => {
    const [loans, setLoans] = useState([])
    const [sorted, setSorted] = useState([])
    const [sortBy, setSortBy] = useState('type')
    const [loading, setL] = useState(true)

    useEffect(() => {
        loanService.getMyLoans().then(r => { setLoans(r.data); doSort(r.data, 'type') }).finally(() => setL(false))
    }, [])

    const doSort = (data, key) => {
        setSortBy(key)
        const s = [...data].sort((a, b) => {
            if (key === 'interest') return a.interestRate - b.interestRate
            if (key === 'amount') return b.maxAmount - a.maxAmount
            return a.loanType?.localeCompare(b.loanType)
        })
        setSorted(s)
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
            <Navbar role="financier" />
            <div className="content-page">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <div className="section-title" style={{ marginBottom: 0 }}>View All Loans</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ color: '#999', fontSize: '0.85rem', alignSelf: 'center' }}>Sort by:</span>
                        {[
                            { key: 'type', label: 'Loan Type' },
                            { key: 'amount', label: 'Max Amount' },
                            { key: 'interest', label: 'Interest Rate' },
                        ].map(s => (
                            <button key={s.key} onClick={() => doSort(loans, s.key)} className="btn"
                                style={{ background: sortBy === s.key ? '#e02020' : 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.78rem', padding: '6px 14px' }}>
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
                {loading ? <p className="text-muted">Loading…</p> : (
                    <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
                        <table>
                            <thead>
                                <tr><th>Loan Type</th><th>Max Amount</th><th>Interest Rate</th><th>Tenure</th><th>Applications</th></tr>
                            </thead>
                            <tbody>
                                {sorted.length === 0
                                    ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#666' }}>No loans found.</td></tr>
                                    : sorted.map(l => (
                                        <tr key={l._id}>
                                            <td style={{ textTransform: 'capitalize' }}>{l.loanType}</td>
                                            <td>₹{l.maxAmount?.toLocaleString()}</td>
                                            <td>{l.interestRate}%</td>
                                            <td>{l.tenure} months</td>
                                            <td>{l.applicationCount || 0}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllLoansFinancier
