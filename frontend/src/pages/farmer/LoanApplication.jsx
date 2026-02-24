import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

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

    /* ── Styles ── */
    const inp = {
        width: '100%', padding: '12px 16px',
        background: '#1a1f2e',
        border: '1.5px solid rgba(34,197,94,0.35)',
        borderRadius: 8, color: '#f0f0f0', fontSize: '0.92rem',
        outline: 'none', boxSizing: 'border-box', marginBottom: 18,
        fontFamily: "'Inter', sans-serif",
        transition: 'border-color 0.2s',
    }
    const lbl = {
        display: 'block', color: '#94a3b8',
        fontSize: '0.78rem', fontWeight: 700,
        marginBottom: 6, letterSpacing: '0.07em',
        textTransform: 'uppercase',
    }

    if (loanLoading) {
        return (
            <PageLayout role="farmer" title="Apply for Loan">
                <p style={{ color: '#aaa', textAlign: 'center', padding: 60 }}>Loading loan details…</p>
            </PageLayout>
        )
    }

    return (
        <PageLayout role="farmer" title="Apply for Loan">

            {/* ── Loan Summary Banner ── */}
            {loan && (
                <div style={{
                    maxWidth: 760, marginBottom: 32,
                    background: 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(34,197,94,0.08))',
                    border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: 14, padding: '22px 28px',
                }}>
                    <h3 style={{
                        color: '#22c55e', margin: '0 0 16px',
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '1.25rem', letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>
                        {loan.title}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 40px' }}>
                        {[
                            { label: 'Loan Type', value: loan.type?.charAt(0).toUpperCase() + loan.type?.slice(1) },
                            { label: 'Interest Rate', value: `${loan.interestRate}%` },
                            { label: 'Max Amount', value: `₹${(loan.amount ?? 0).toLocaleString()}` },
                            { label: 'Repayment Period', value: `${loan.tenure} months` },
                            { label: 'Financier', value: loan.financierId?.orgName || '—' },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <div style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                                <div style={{ color: '#4ade80', fontWeight: 600, fontSize: '1rem' }}>{value}</div>
                            </div>
                        ))}
                    </div>
                    {loan.eligibility && (
                        <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: 6 }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Eligibility: </span>
                            <span style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>{loan.eligibility}</span>
                        </div>
                    )}
                </div>
            )}

            {/* ── Application Form ── */}
            <div style={{ maxWidth: 560 }}>
                <div style={{
                    background: '#111827',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 16, padding: '36px 32px',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
                }}>
                    <h3 style={{
                        color: '#fff', margin: '0 0 28px',
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '1.2rem', letterSpacing: '0.05em',
                        borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 14,
                    }}>
                        📝 Your Application
                    </h3>

                    <form onSubmit={handleSubmit}>

                        <label style={lbl}>Purpose of Loan *</label>
                        <textarea
                            rows={3}
                            placeholder="e.g. Purchase seeds and fertilizers for rabi season"
                            value={form.purpose}
                            onChange={e => setForm({ ...form, purpose: e.target.value })}
                            required
                            style={{ ...inp, resize: 'vertical' }}
                        />

                        <label style={lbl}>Land Area (in acres) *</label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="e.g. 3.5"
                            value={form.landArea}
                            onChange={e => setForm({ ...form, landArea: e.target.value })}
                            required
                            style={inp}
                        />

                        <label style={lbl}>Annual Income (₹) *</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="e.g. 120000"
                            value={form.income}
                            onChange={e => setForm({ ...form, income: e.target.value })}
                            required
                            style={inp}
                        />

                        <label style={lbl}>Upload Supporting Documents</label>
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={e => setFiles(Array.from(e.target.files))}
                            style={{
                                ...inp,
                                padding: '10px 14px',
                                cursor: 'pointer',
                                color: '#94a3b8',
                            }}
                        />
                        {files.length > 0 && (
                            <p style={{ fontSize: '0.8rem', color: '#4ade80', marginBottom: 14, marginTop: -12 }}>
                                ✓ {files.length} file{files.length > 1 ? 's' : ''} selected
                            </p>
                        )}
                        <p style={{ color: '#475569', fontSize: '0.75rem', marginBottom: 20, marginTop: -8 }}>
                            Accepted: PDF, JPG, PNG (Aadhaar, land records, income proof, etc.)
                        </p>

                        {error && (
                            <div style={{
                                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: 8, padding: '12px 16px',
                                color: '#fca5a5', fontSize: '0.85rem', marginBottom: 16,
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px 0', marginTop: 4,
                                background: loading
                                    ? 'rgba(22,163,74,0.4)'
                                    : 'linear-gradient(135deg, #16a34a, #22c55e)',
                                color: '#fff', fontWeight: 700, fontSize: '1rem',
                                border: 'none', borderRadius: 8,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                boxShadow: loading ? 'none' : '0 4px 20px rgba(34,197,94,0.35)',
                                fontFamily: "'Barlow Condensed', sans-serif",
                                transition: 'all 0.2s',
                            }}
                        >
                            {loading ? '⏳ Submitting…' : '🚀 Submit Application'}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Success Modal ── */}
            {applied && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 900,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        background: 'rgba(5,25,10,0.97)',
                        border: '1px solid rgba(34,197,94,0.45)',
                        borderRadius: 18, padding: '52px 56px',
                        textAlign: 'center', maxWidth: 440,
                        boxShadow: '0 0 80px rgba(34,197,94,0.25)',
                        animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: 20 }}>🎉</div>
                        <h3 style={{ color: '#22c55e', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em', marginBottom: 14 }}>
                            Application Submitted!
                        </h3>
                        <p style={{ color: '#888', fontSize: '0.88rem' }}>
                            Your loan application has been sent to the financier. You'll be notified once it's reviewed.
                        </p>
                        <p style={{ color: '#555', fontSize: '0.8rem', marginTop: 10 }}>Redirecting…</p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to   { opacity: 1; transform: scale(1); }
                }
                input:focus, textarea:focus {
                    border-color: rgba(34,197,94,0.7) !important;
                    box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
                }
            `}</style>
        </PageLayout>
    )
}

export default LoanApplication
