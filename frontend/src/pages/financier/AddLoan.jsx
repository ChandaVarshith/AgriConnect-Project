import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import loanService from '../../services/loanService'
import './AddLoan.css'

const LOAN_TYPES = ['crop', 'equipment', 'kisan', 'agri']

const AddLoan = () => {
    const [form, setForm] = useState({
        title: '', type: '', amount: '', interestRate: '', tenure: '', eligibility: '', description: '',
    })
    const [error, setError] = useState('')
    const [success, setS] = useState('')
    const [loading, setL] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setL(true)
        try {
            await loanService.addLoan({
                title: form.title,
                type: form.type,
                amount: Number(form.amount),
                interestRate: Number(form.interestRate),
                tenure: Number(form.tenure),
                eligibility: form.eligibility,
                description: form.description,
            })
            setS('Loan product created successfully!')
            setTimeout(() => navigate('/financier/all-loans'), 1500)
        } catch (err) { setError(err.response?.data?.message || 'Failed to create loan.') }
        finally { setL(false) }
    }

    return (
        <PageLayout role="financier" title="Add Loan Product">
            <div className="add-loan-container">
                <div className="add-loan-card">
                    <form onSubmit={handleSubmit}>
                        <label className="add-loan-label">Loan Title</label>
                        <input className="add-loan-input" type="text" placeholder="e.g. Kisan Crop Loan 2025"
                            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />

                        <label className="add-loan-label">Loan Type</label>
                        <select className="add-loan-input add-loan-select"
                            value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required>
                            <option value="">Select type…</option>
                            {LOAN_TYPES.map(t => (
                                <option key={t} value={t} className="add-loan-option">
                                    {t.charAt(0).toUpperCase() + t.slice(1)} Loan
                                </option>
                            ))}
                        </select>

                        <label className="add-loan-label">Max Amount (₹)</label>
                        <input className="add-loan-input" type="number" placeholder="e.g. 500000"
                            value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />

                        <label className="add-loan-label">Interest Rate (%)</label>
                        <input className="add-loan-input" type="number" step="0.1" placeholder="e.g. 8.5"
                            value={form.interestRate} onChange={e => setForm({ ...form, interestRate: e.target.value })} required />

                        <label className="add-loan-label">Tenure (months)</label>
                        <input className="add-loan-input" type="number" placeholder="e.g. 36"
                            value={form.tenure} onChange={e => setForm({ ...form, tenure: e.target.value })} required />

                        <label className="add-loan-label">Description</label>
                        <textarea rows={3} className="add-loan-input add-loan-textarea"
                            placeholder="Brief description of the loan…"
                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

                        <label className="add-loan-label">Eligibility Criteria</label>
                        <input className="add-loan-input" type="text" placeholder="e.g. Minimum 2 acres of land"
                            value={form.eligibility} onChange={e => setForm({ ...form, eligibility: e.target.value })} />

                        {error && <p className="add-loan-error">{error}</p>}
                        {success && <p className="add-loan-success">{success}</p>}

                        <button type="submit" disabled={loading} className="add-loan-submit-btn">
                            {loading ? 'Creating…' : 'Create Loan Product'}
                        </button>
                    </form>
                </div>
            </div>
        </PageLayout>
    )
}

export default AddLoan
