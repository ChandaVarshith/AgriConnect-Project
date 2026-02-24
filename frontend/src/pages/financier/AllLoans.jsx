import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import loanService from '../../services/loanService'
import API from '../../services/api'

const AllLoansFinancier = () => {
    const [loans, setLoans] = useState([])
    const [sorted, setSorted] = useState([])
    const [sortBy, setSortBy] = useState('type')
    const [loading, setL] = useState(true)
    const [toast, setToast] = useState('')

    const load = () => {
        setL(true)
        const fn = loanService.getMyLoans ? loanService.getMyLoans : loanService.getLoans
        fn().then(r => { setLoans(r.data); doSort(r.data, sortBy) }).catch(() => { }).finally(() => setL(false))
    }

    useEffect(() => { load() }, [])

    const doSort = (data, key) => {
        setSortBy(key)
        const s = [...data].sort((a, b) => {
            if (key === 'interest') return a.interestRate - b.interestRate
            if (key === 'amount') return b.amount - a.amount
            return a.type?.localeCompare(b.type)
        })
        setSorted(s)
    }

    const removeLoan = async (id) => {
        try {
            await API.delete(`/loans/${id}`)
            setToast('🗑 Loan removed.')
            load()
            setTimeout(() => setToast(''), 3000)
        } catch {
            setToast('❌ Failed to remove loan.')
            setTimeout(() => setToast(''), 3000)
        }
    }

    return (
        <PageLayout role="financier" title="All Loans">
            {toast && (
                <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '11px 18px', marginBottom: 20, color: '#fff', fontSize: '0.88rem' }}>
                    {toast}
                </div>
            )}

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
                                {['Title', 'Loan Type', 'Max Amount', 'Interest Rate', 'Tenure', 'Applications', 'Action'].map(h => (
                                    <th key={h} style={{ padding: '12px 18px', color: '#fff', textAlign: 'left', fontSize: '0.85rem', letterSpacing: '0.04em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.length === 0 ? (
                                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 28, color: '#666' }}>No loans found.</td></tr>
                            ) : sorted.map((l, i) => (
                                <tr key={l._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                                    <td style={{ padding: '12px 18px', color: '#fff', fontWeight: 600 }}>{l.title || '—'}</td>
                                    <td style={{ padding: '12px 18px', color: '#fff', textTransform: 'capitalize' }}>{l.type}</td>
                                    <td style={{ padding: '12px 18px', color: '#4ade80' }}>₹{l.amount?.toLocaleString()}</td>
                                    <td style={{ padding: '12px 18px', color: '#fff' }}>{l.interestRate}%</td>
                                    <td style={{ padding: '12px 18px', color: '#fff' }}>{l.tenure} months</td>
                                    <td style={{ padding: '12px 18px', color: '#fff' }}>{l.applicationCount || 0}</td>
                                    <td style={{ padding: '12px 18px' }}>
                                        <button onClick={() => removeLoan(l._id)} style={{
                                            background: '#ef4444', color: '#fff', border: 'none',
                                            borderRadius: 5, padding: '5px 14px', fontWeight: 700,
                                            fontSize: '0.78rem', cursor: 'pointer',
                                        }}>Remove</button>
                                    </td>
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
