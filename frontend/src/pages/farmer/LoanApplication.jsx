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
    const [form, setForm] = useState({ applicantName: '', email: '', contactNumber: '' })
    const [files, setFiles] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [applied, setApplied] = useState(false)

    useEffect(() => {
        if (loanId) {
            API.get(`/loans/${loanId}`).then(r => setLoan(r.data)).catch(() => { })
        }
    }, [loanId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const data = new FormData()
            data.append('loanId', loanId)
            data.append('applicantName', form.applicantName)
            data.append('email', form.email)
            data.append('contactNumber', form.contactNumber)
            files.forEach(f => data.append('documents', f))
            await API.post('/loans/apply', data, { headers: { 'Content-Type': 'multipart/form-data' } })
            setApplied(true)
            setTimeout(() => navigate('/farmer/loans'), 2400)
        } catch (err) {
            setError(err.response?.data?.message || 'Application failed.')
        } finally {
            setLoading(false)
        }
    }

    const inp = {
        width: '100%', padding: '10px 14px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 6, color: '#fff', fontSize: '0.9rem',
        outline: 'none', boxSizing: 'border-box', marginBottom: 16,
        fontFamily: "'Inter', sans-serif",
    }
    const lbl = { display: 'block', color: '#bbb', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }

    return (
        <PageLayout role="farmer" title={t('applyforloan')}>
            {/* Loan summary banner */}
            {loan && (
                <div style={{
                    maxWidth: 720, marginBottom: 28,
                    background: 'rgba(34,197,94,0.08)',
                    border: '1px solid rgba(34,197,94,0.25)',
                    borderRadius: 10, padding: '16px 24px',
                    color: '#ccc', fontSize: '0.9rem', lineHeight: 1.8,
                }}>
                    <span>{t('applyingforloantype')} </span>
                    <strong style={{ color: '#4ade80' }}>{loan.loanType?.charAt(0).toUpperCase() + loan.loanType?.slice(1)} Loan</strong>
                    {' • '}
                    <span>{t('withinterestrate')} </span>
                    <strong style={{ color: '#4ade80' }}>{loan.interestRate}%</strong>
                    {' • '}
                    <span>{t('maximumamountis')} </span>
                    <strong style={{ color: '#4ade80' }}>₹{loan.maxAmount?.toLocaleString()}</strong>
                    {' • '}
                    <span>{t('repaymentperiodis')} </span>
                    <strong style={{ color: '#4ade80' }}>{loan.tenure} {t('months')}</strong>
                </div>
            )}

            {/* Application form */}
            <div style={{ maxWidth: 520 }}>
                <div style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 14, padding: '32px 30px',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                }}>
                    <form onSubmit={handleSubmit}>
                        <label style={lbl}>{t('applicantname')} *</label>
                        <input type="text" placeholder="Your full name" value={form.applicantName}
                            onChange={e => setForm({ ...form, applicantName: e.target.value })} required style={inp} />

                        <label style={lbl}>{t('email')} *</label>
                        <input type="email" placeholder="your@email.com" value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })} required style={inp} />

                        <label style={lbl}>{t('contactnumber')} *</label>
                        <input type="tel" placeholder="10-digit mobile number" value={form.contactNumber}
                            onChange={e => setForm({ ...form, contactNumber: e.target.value })} required style={inp} />

                        <label style={lbl}>{t('uploaddocuments')}</label>
                        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
                            onChange={e => setFiles(Array.from(e.target.files))}
                            style={{ ...inp, padding: '8px 14px', cursor: 'pointer' }} />

                        {files.length > 0 && (
                            <p style={{ fontSize: '0.78rem', color: '#4ade80', marginBottom: 12, marginTop: -8 }}>
                                {files.length} file{files.length > 1 ? 's' : ''} selected
                            </p>
                        )}

                        {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>}

                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '13px 0', marginTop: 6,
                            background: loading ? '#166534' : 'linear-gradient(135deg,#16a34a,#22c55e)',
                            color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                            border: 'none', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
                            fontFamily: "'Barlow Condensed', sans-serif",
                        }}>
                            {loading ? t('loading') : t('submitapplication')}
                        </button>
                    </form>
                </div>
            </div>

            {/* Success modal */}
            {applied && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 900,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        background: 'rgba(5,25,10,0.97)',
                        border: '1px solid rgba(34,197,94,0.4)',
                        borderRadius: 16, padding: '52px 56px',
                        textAlign: 'center', maxWidth: 420,
                        boxShadow: '0 0 80px rgba(34,197,94,0.2)',
                        animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: 20 }}>🎉</div>
                        <h3 style={{ color: '#22c55e', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em', marginBottom: 14 }}>{t('successfullyapplied')}</h3>
                        <p style={{ color: '#888', fontSize: '0.88rem' }}>Redirecting you back to loans…</p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </PageLayout>
    )
}

export default LoanApplication
