import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import loanService from '../../services/loanService'
import { Link } from 'react-router-dom'

const BrowseLoans = () => {
    const [loans, setLoans] = useState([])
    const [filtered, setFl] = useState([])
    const [sortBy, setSortBy] = useState('')
    const [loading, setL] = useState(true)

    useEffect(() => {
        loanService.getAllLoans().then(r => { setLoans(r.data); setFl(r.data) }).finally(() => setL(false))
    }, [])

    const applySort = (key) => {
        setSortBy(key)
        const sorted = [...loans].sort((a, b) => {
            if (key === 'interest') return a.interestRate - b.interestRate
            if (key === 'amount') return b.maxAmount - a.maxAmount
            return a.loanType?.localeCompare(b.loanType)
        })
        setFl(sorted)
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
            <Navbar role="farmer" />
            <div className="content-page">
                <div className="section-title">View All Loans</div>

                {/* Sort controls – matches reference checkboxes */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                    {[
                        { key: 'type', label: 'Sort by Loan Type' },
                        { key: 'interest', label: 'Sort by Interest Rate' },
                        { key: 'amount', label: 'Sort by Max Amount' },
                    ].map(s => (
                        <label key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#ccc', fontSize: '0.9rem' }}>
                            <input type="checkbox" checked={sortBy === s.key}
                                onChange={() => applySort(s.key)}
                                style={{ accentColor: '#4caf50', width: 16, height: 16 }} />
                            {s.label}
                        </label>
                    ))}
                </div>

                {loading ? <p className="text-muted">Loading…</p> : (
                    <div className="grid-3">
                        {filtered.map(loan => (
                            <div key={loan._id} className="info-card" style={{ borderTop: '3px solid #4caf50' }}>
                                <h4 style={{ color: '#4caf50', marginBottom: 8, textTransform: 'capitalize' }}>{loan.loanType}</h4>
                                <p style={{ fontSize: '0.82rem', color: '#bbb', marginBottom: 6 }}>Max Amount: <strong style={{ color: '#fff' }}>₹{loan.maxAmount?.toLocaleString()}</strong></p>
                                <p style={{ fontSize: '0.82rem', color: '#bbb', marginBottom: 6 }}>Interest Rate: <strong style={{ color: '#fff' }}>{loan.interestRate}%</strong></p>
                                <p style={{ fontSize: '0.82rem', color: '#bbb', marginBottom: 14 }}>Tenure: <strong style={{ color: '#fff' }}>{loan.tenure} months</strong></p>
                                <Link to={`/farmer/loan-apply/${loan._id}`} className="btn btn-green" style={{ width: '100%', textAlign: 'center' }}>Apply for Loan</Link>
                            </div>
                        ))}
                        {filtered.length === 0 && <p className="text-muted">No loans available.</p>}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BrowseLoans
