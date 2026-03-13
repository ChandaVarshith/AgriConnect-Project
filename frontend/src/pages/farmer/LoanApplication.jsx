import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'
import './LoanApplication.css'

const LoanApplication = () => {
    const { t } = useLanguage()
    const { loanId } = useParams()
    const navigate = useNavigate()
    const [loan, setLoan] = useState(null)
    const [loanLoading, setLoanLoading] = useState(true)
    const [form, setForm] = useState({ purpose: '', landArea: '', income: '' })
    const [files, setFiles] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [applied, setApplied] = useState(false)

    useEffect(() => {
        if (loanId) {
            API.get(`/loans/${loanId}`)
                .then(r => setLoan(r.data))
                .catch(() => setError('Failed to load loan details.'))
                .finally(() => setLoanLoading(false))
        }
    }, [loanId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const data = new FormData()
            data.append('loanId', loanId)
            data.append('purpose', form.purpose)
            data.append('landArea', form.landArea)
            data.append('income', form.income)
            files.forEach(f => data.append('documents', f))
            await API.post('/loans/apply', data, { headers: { 'Content-Type': 'multipart/form-data' } })
            setApplied(true)
            setTimeout(() => navigate('/farmer/loans'), 2400)
        } catch (err) {
            setError(err.response?.data?.message || 'Application failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (loanLoading) {
        return (
            <PageLayout role="farmer" title="Apply for Loan">
                <p className="loan-app-loading">Loading loan details…</p>
            </PageLayout>
        )
    }

    return (
        <PageLayout role="farmer" title="Apply for Loan">

            {/* ── Loan Summary Banner ── */}
            {loan && (
                <div className="loan-app-summary-card">
                    <h3 className="loan-app-summary-title">
                        {loan.title}
                    </h3>
                    <div className="loan-app-summary-grid">
                        {[
                            { label: 'Loan Type', value: loan.type?.charAt(0).toUpperCase() + loan.type?.slice(1) },
                            { label: 'Interest Rate', value: `${loan.interestRate}%` },
                            { label: 'Max Amount', value: `₹${(loan.amount ?? 0).toLocaleString()}` },
                            { label: 'Repayment Period', value: `${loan.tenure} months` },
                            { label: 'Financier', value: loan.financierId?.orgName || '—' },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <div className="loan-app-summary-label">{label}</div>
                                <div className="loan-app-summary-val">{value}</div>
                            </div>
                        ))}
                    </div>
                    {loan.eligibility && (
                        <div className="loan-app-eligibility-box">
                            <span className="loan-app-eligibility-label">Eligibility: </span>
                            <span className="loan-app-eligibility-text">{loan.eligibility}</span>
                        </div>
                    )}
                </div>
            )}

            {/* ── Application Form ── */}
            <div className="loan-app-form-wrapper">
                <div className="loan-app-form-card">
                    <h3 className="loan-app-form-title">
                        📝 Your Application
                    </h3>

                    <form onSubmit={handleSubmit}>

                        <label className="loan-app-label">Purpose of Loan *</label>
                        <textarea
                            rows={3}
                            placeholder="e.g. Purchase seeds and fertilizers for rabi season"
                            value={form.purpose}
                            onChange={e => setForm({ ...form, purpose: e.target.value })}
                            required
                            className="loan-app-input"
                        />

                        <label className="loan-app-label">Land Area (in acres) *</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="e.g. 3.5"
                            value={form.landArea}
                            onChange={e => setForm({ ...form, landArea: e.target.value })}
                            required
                            className="loan-app-input"
                        />

                        <label className="loan-app-label">Annual Income (₹) *</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="e.g. 120000"
                            value={form.income}
                            onChange={e => setForm({ ...form, income: e.target.value })}
                            required
                            className="loan-app-input"
                        />

                        <label className="loan-app-label">Upload Supporting Documents</label>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={e => setFiles(Array.from(e.target.files))}
                            className="loan-app-input loan-app-file-input"
                        />
                        {files.length > 0 && (
                            <p className="loan-app-files-msg">
                                {files.length} file{files.length > 1 ? 's' : ''} selected
                            </p>
                        )}
                        <p className="loan-app-accepted-msg">
                            Accepted: PDF, JPG, PNG (Aadhaar, land records, income proof, etc.)
                        </p>

                        {error && (
                            <div className="loan-app-error">
                                ! {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="loan-app-submit-btn"
                        >
                            {loading ? ' Submitting…' : 'Submit Application'}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Success Modal ── */}
            {applied && (
                <div className="loan-app-modal-overlay">
                    <div className="loan-app-modal-content">
                        <div className="loan-app-modal-icon"></div>
                        <h3 className="loan-app-modal-title">
                            Application Submitted!
                        </h3>
                        <p className="loan-app-modal-text">
                            Your loan application has been sent to the financier. You'll be notified once it's reviewed.
                        </p>
                        <p className="loan-app-modal-subtext">Redirecting…</p>
                    </div>
                </div>
            )}
        </PageLayout>
    )
}

export default LoanApplication
