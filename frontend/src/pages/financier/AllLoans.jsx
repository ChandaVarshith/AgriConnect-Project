import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import loanService from '../../services/loanService'
import API from '../../services/api'
import './AllLoans.css'

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
            setToast('Delete Loan removed.')
            load()
            setTimeout(() => setToast(''), 3000)
        } catch {
            setToast('Failed to remove loan.')
            setTimeout(() => setToast(''), 3000)
        }
    }

    return (
        <PageLayout role="financier" title="All Loans">
            {toast && (
                <div className="all-loans-toast">
                    {toast}
                </div>
            )}

            <div className="all-loans-sort-bar">
                <span className="all-loans-sort-label">Sort by:</span>
                {[{ k: 'type', l: 'Loan Type' }, { k: 'amount', l: 'Max Amount' }, { k: 'interest', l: 'Interest Rate' }].map(({ k, l }) => (
                    <button key={k} onClick={() => doSort(loans, k)} className="all-loans-sort-btn" style={{
                        background: sortBy === k ? '#e02020' : 'rgba(255,255,255,0.1)'
                    }}>{l}</button>
                ))}
            </div>

            {loading ? <p className="all-loans-loading">Loading…</p> : (
                <div className="all-loans-table-wrapper">
                    <table className="all-loans-table">
                        <thead>
                            <tr className="all-loans-tr-head">
                                {['Title', 'Loan Type', 'Max Amount', 'Interest Rate', 'Tenure', 'Applications', 'Action'].map(h => (
                                    <th key={h} className="all-loans-th">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.length === 0 ? (
                                <tr><td colSpan={7} className="all-loans-empty-td">No loans found.</td></tr>
                            ) : sorted.map((l, i) => (
                                <tr key={l._id} className={`all-loans-tr-body ${i % 2 === 0 ? 'even' : 'odd'}`}>
                                    <td className="all-loans-td-title">{l.title || '—'}</td>
                                    <td className="all-loans-td-type">{l.type}</td>
                                    <td className="all-loans-td-amount">₹{l.amount?.toLocaleString()}</td>
                                    <td className="all-loans-td-general">{l.interestRate}%</td>
                                    <td className="all-loans-td-general">{l.tenure} months</td>
                                    <td className="all-loans-td-general">{l.applicationCount || 0}</td>
                                    <td className="all-loans-td-action">
                                        <button onClick={() => removeLoan(l._id)} className="all-loans-btn-remove">Remove</button>
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
