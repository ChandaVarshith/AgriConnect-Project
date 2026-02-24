import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import loanService from '../../services/loanService'

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

    const inp = {
        width: '100%', padding: '10px 14px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.22)',
        borderRadius: 6, color: '#fff', fontSize: '0.9rem',
        outline: 'none', boxSizing: 'border-box', marginBottom: 14,
    }
    const lbl = { display: 'block', color: '#ccc', fontSize: '0.8rem', fontWeight: 600, marginBottom: 5, letterSpacing: '0.03em' }

    return (
        <PageLayout role="financier" title="Add Loan Product">
            <div style={{ maxWidth: 540 }}>
                <div style={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 12, padding: '32px 30px',
                }}>
                    <form onSubmit={handleSubmit}>
                        <label style={lbl}>Loan Title</label>
                        <input style={inp} type="text" placeholder="e.g. Kisan Crop Loan 2025"
                            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />

                        <label style={lbl}>Loan Type</label>
                        <select style={{ ...inp, appearance: 'auto', cursor: 'pointer' }}
                            value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required>
                            <option value="">Select type…</option>
                            {LOAN_TYPES.map(t => (
                                <option key={t} value={t} style={{ background: '#1a1a1a' }}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)} Loan
                                </option>
                            ))}
                        </select>

                        <label style={lbl}>Max Amount (₹)</label>
                        <input style={inp} type="number" placeholder="e.g. 500000"
                            value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />

                        <label style={lbl}>Interest Rate (%)</label>
                        <input style={inp} type="number" step="0.1" placeholder="e.g. 8.5"
                            value={form.interestRate} onChange={e => setForm({ ...form, interestRate: e.target.value })} required />

                        <label style={lbl}>Tenure (months)</label>
                        <input style={inp} type="number" placeholder="e.g. 36"
                            value={form.tenure} onChange={e => setForm({ ...form, tenure: e.target.value })} required />

                        <label style={lbl}>Description</label>
                        <textarea rows={3} style={{ ...inp, resize: 'vertical' }}
                            placeholder="Brief description of the loan…"
                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

                        <label style={lbl}>Eligibility Criteria</label>
                        <input style={inp} type="text" placeholder="e.g. Minimum 2 acres of land"
                            value={form.eligibility} onChange={e => setForm({ ...form, eligibility: e.target.value })} />

                        {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>}
                        {success && <p style={{ color: '#4caf50', fontSize: '0.85rem', marginBottom: 12 }}>{success}</p>}

                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '12px 0',
                            background: loading ? '#b06a00' : '#f59e0b',
                            color: '#000', fontWeight: 700, fontSize: '1rem',
                            border: 'none', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer',
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}>
                            {loading ? 'Creating…' : 'Create Loan Product'}
                        </button>
                    </form>
                </div>
            </div>
        </PageLayout>
    )
}

export default AddLoan
