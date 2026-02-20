import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import API from '../../services/api'

const BG = 'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=1400&auto=format&fit=crop&q=80'

const LoanApplication = () => {
    const { loanId } = useParams()
    const navigate = useNavigate()
    const [loan, setLoan] = useState(null)
    const [form, setForm] = useState({ applicantName: '', email: '', contactNumber: '' })
    const [files, setFiles] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

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
            navigate('/farmer/loans')
        } catch (err) {
            setError(err.response?.data?.message || 'Application failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>
            <img src={BG} alt="farm"
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.32)', zIndex: 0 }} />
            <Navbar role="farmer" />
            <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', padding: '90px 20px 40px' }}>
                <h2 style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                    fontSize: '2rem', color: '#fff', textTransform: 'uppercase',
                    letterSpacing: '0.06em', textAlign: 'center', marginBottom: 24,
                    textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                }}>Apply for Loan</h2>

                {loan && (
                    <div style={{
                        background: 'rgba(220,220,215,0.15)', backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8,
                        padding: '16px 24px', maxWidth: 900, margin: '0 auto 28px',
                        color: '#fff', fontSize: '0.95rem', lineHeight: 1.7,
                        textAlign: 'center',
                    }}>
                        You are applying for a loan of type{' '}
                        <strong style={{ color: '#4caf50' }}>{loan.loanType?.charAt(0).toUpperCase() + loan.loanType?.slice(1)} Loan</strong>,
                        with an interest rate of{' '}
                        <strong style={{ color: '#4caf50' }}>{loan.interestRate}%</strong>.
                        The maximum amount is{' '}
                        <strong style={{ color: '#4caf50' }}>₹{loan.maxAmount?.toLocaleString()}</strong>,
                        and the repayment period is{' '}
                        <strong style={{ color: '#4caf50' }}>{loan.tenure}</strong> months.
                    </div>
                )}

                <div style={{
                    display: 'flex', justifyContent: 'center',
                }}>
                    <div style={{
                        background: 'rgba(220,220,215,0.85)', backdropFilter: 'blur(4px)',
                        borderRadius: 8, padding: '32px 36px', width: '100%', maxWidth: 440,
                        color: '#1a1a1a',
                    }}>
                        <form onSubmit={handleSubmit}>
                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.87rem', marginBottom: 5 }}>Applicant Name</label>
                            <input type="text" placeholder="Your full name" value={form.applicantName}
                                onChange={e => setForm({ ...form, applicantName: e.target.value })} required
                                style={{ width: '100%', padding: '10px 14px', background: '#fff', border: '1px solid #ccc', borderRadius: 4, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: 16, outline: 'none' }} />

                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.87rem', marginBottom: 5 }}>Email</label>
                            <input type="email" placeholder="your@email.com" value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })} required
                                style={{ width: '100%', padding: '10px 14px', background: '#fff', border: '1px solid #ccc', borderRadius: 4, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: 16, outline: 'none' }} />

                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.87rem', marginBottom: 5 }}>Contact Number</label>
                            <input type="tel" placeholder="10-digit mobile number" value={form.contactNumber}
                                onChange={e => setForm({ ...form, contactNumber: e.target.value })} required
                                style={{ width: '100%', padding: '10px 14px', background: '#fff', border: '1px solid #ccc', borderRadius: 4, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: 16, outline: 'none' }} />

                            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.87rem', marginBottom: 5 }}>Upload Documents</label>
                            <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
                                onChange={e => setFiles(Array.from(e.target.files))}
                                style={{ width: '100%', padding: '8px', background: '#fff', border: '1px solid #ccc', borderRadius: 4, fontSize: '0.88rem', color: '#1a1a1a', marginBottom: 16 }} />

                            {error && <p style={{ color: '#e02020', fontSize: '0.85rem', marginBottom: 10 }}>{error}</p>}

                            <button type="submit" disabled={loading} style={{
                                width: '100%', padding: '13px', background: '#4caf50', color: '#fff',
                                border: 'none', borderRadius: 4, fontFamily: "'Inter', sans-serif",
                                fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s',
                            }}
                                onMouseEnter={e => { if (!loading) e.target.style.background = '#388e3c' }}
                                onMouseLeave={e => { if (!loading) e.target.style.background = '#4caf50' }}
                            >
                                {loading ? 'Submitting…' : 'Submit Application'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoanApplication
