import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import loanService from '../../services/loanService'

const AllLoansFinancier = () => {
    const [loans, setLoans] = useState([])
    const [sorted, setSorted] = useState([])
    const [sortBy, setSortBy] = useState('type')
    const [loading, setL] = useState(true)

    useEffect(() => {
        loanService.getMyLoans
            ? loanService.getMyLoans().then(r => { setLoans(r.data); doSort(r.data, 'type') }).finally(() => setL(false))
            : loanService.getLoans().then(r => { setLoans(r.data); doSort(r.data, 'type') }).finally(() => setL(false))
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
        <PageLayout role="financier" title="All Loans">
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                <span style={{ color: '#999', fontSize: '0.85rem', alignSelf: 'center' }}>Sort by:</span>
                {[{ k: 'type', l: 'Loan Type' }, { k: 'amount', l: 'Max Amount' }, { k: 'interest', l: 'Interest Rate' }].map(({ k, l }) => (
                    <button key={k} onClick={() => doSort(loans, k)} style={{
                        padding: '6px 14px', borderRadius: 5, border: 'none', cursor: 'pointer',
                        background: sortBy === k ? '#e02020' : 'rgba(255,255,255,0.1)',
                        color: '#fff', fontSize: '0.82rem', fontWeight: 600,
                    }}>{l}</button>
                ))}
            </div>

            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : (
                <div style={{
                    overflowX: 'auto',
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.12)',
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}>
                                {['Loan Type', 'Max Amount', 'Interest Rate', 'Tenure', 'Applications'].map(h => (
                                    <th key={h} style={{ padding: '12px 18px', color: '#fff', textAlign: 'left', fontSize: '0.85rem', letterSpacing: '0.04em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 28, color: '#666' }}>No loans found.</td></tr>
                            ) : sorted.map(l => (
                                <tr key={l._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    <td style={{ padding: '12px 18px', color: '#fff', textTransform: 'capitalize' }}>{l.loanType}</td>
                                    <td style={{ padding: '12px 18px', color: '#fff' }}>₹{l.maxAmount?.toLocaleString()}</td>
                                    <td style={{ padding: '12px 18px', color: '#fff' }}>{l.interestRate}%</td>
                                    <td style={{ padding: '12px 18px', color: '#fff' }}>{l.tenure} months</td>
                                    <td style={{ padding: '12px 18px', color: '#fff' }}>{l.applicationCount || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </PageLayout>
    )
}

export default AllLoansFinancier
