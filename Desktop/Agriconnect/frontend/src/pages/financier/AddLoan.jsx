import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import loanService from '../../services/loanService'

const BG = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&auto=format&fit=crop&q=80'

const AddLoan = () => {
    const [form, setForm] = useState({
        loanType: '', maxAmount: '', interestRate: '', tenure: '', description: '', eligibility: '',
    })
    const [error, setError] = useState('')
    const [success, setS] = useState('')
    const [loading, setL] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setL(true)
        try {
            await loanService.createLoan(form)
            setS('Loan product created successfully!')
            setTimeout(() => navigate('/financier/all-loans'), 1500)
        } catch (err) { setError(err.response?.data?.message || 'Failed to create loan.') }
        finally { setL(false) }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>
            <img src={BG} alt="finance"
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3)', zIndex: 0 }} />
            <Navbar role="financier" />
            <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '90px 20px 40px' }}>
                <div className="glass-card">
                    <h2>Add Loan Product</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Loan Type</label>
                        <select value={form.loanType} onChange={e => setForm({ ...form, loanType: e.target.value })} required>
                            <option value="">Select type…</option>
                            <option value="crop">Crop Loan</option>
                            <option value="equipment">Equipment Loan</option>
                            <option value="land">Land Purchase Loan</option>
                            <option value="irrigation">Irrigation Loan</option>
                            <option value="storage">Storage / Warehouse Loan</option>
                        </select>
                        <label>Max Amount (₹)</label>
                        <input type="number" placeholder="e.g. 500000" value={form.maxAmount}
                            onChange={e => setForm({ ...form, maxAmount: e.target.value })} required />
                        <label>Interest Rate (%)</label>
                        <input type="number" step="0.1" placeholder="e.g. 8.5" value={form.interestRate}
                            onChange={e => setForm({ ...form, interestRate: e.target.value })} required />
                        <label>Tenure (months)</label>
                        <input type="number" placeholder="e.g. 36" value={form.tenure}
                            onChange={e => setForm({ ...form, tenure: e.target.value })} required />
                        <label>Description</label>
                        <textarea rows={3} placeholder="Brief description of the loan…" value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 4, border: '1px solid #ccc', fontSize: '0.9rem', outline: 'none', resize: 'vertical', color: '#1a1a1a', marginBottom: 16 }} />
                        <label>Eligibility Criteria</label>
                        <input type="text" placeholder="e.g. Minimum 2 acres of land" value={form.eligibility}
                            onChange={e => setForm({ ...form, eligibility: e.target.value })} />
                        {error && <p className="msg-error">{error}</p>}
                        {success && <p className="msg-success">{success}</p>}
                        <button className="btn-submit" type="submit" disabled={loading}>
                            {loading ? 'Creating…' : 'Create Loan Product'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddLoan
