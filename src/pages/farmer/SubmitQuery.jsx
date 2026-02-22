import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'
import { useLanguage } from '../../context/LanguageContext'

const SubmitQuery = () => {
    const { t } = useLanguage()
    const [form, setForm] = useState({ cropType: '', description: '', district: '', state: '' })
    const [error, setError] = useState('')
    const [loading, setL] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setL(true)
        try {
            const location = `${form.district}, ${form.state}`
            await queryService.submitQuery({ ...form, location })
            setSubmitted(true)
            setTimeout(() => navigate('/farmer/responses'), 2200)
        } catch (err) { setError(err.response?.data?.message || 'Submission failed.') }
        finally { setL(false) }
    }

    const inp = {
        width: '100%', padding: '10px 14px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 6, color: '#fff', fontSize: '0.9rem',
        outline: 'none', boxSizing: 'border-box', marginBottom: 16,
        transition: 'border-color 0.2s',
        fontFamily: "'Inter', sans-serif",
    }
    const lbl = { display: 'block', color: '#bbb', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }

    return (
        <PageLayout role="farmer" title={t('sendcropsuggestionrequest')}>
            <div style={{ maxWidth: 560 }}>
                <div style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 14, padding: '36px 32px',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                }}>
                    <form onSubmit={handleSubmit}>
                        <label style={lbl}>{t('croptype')}</label>
                        <input style={inp} type="text" placeholder="e.g. Paddy, Wheat, Cotton"
                            value={form.cropType} onChange={e => setForm({ ...form, cropType: e.target.value })} required />

                        <label style={lbl}>{t('requestdetails')}</label>
                        <textarea rows={5} style={{ ...inp, resize: 'vertical' }}
                            placeholder="Describe your issue or requirement…"
                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />

                        {/* District + State side by side */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                                <label style={lbl}>{t('district')}</label>
                                <input style={{ ...inp, marginBottom: 0 }} type="text" placeholder="e.g. Guntur"
                                    value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} required />
                            </div>
                            <div>
                                <label style={lbl}>{t('state')}</label>
                                <input style={{ ...inp, marginBottom: 0 }} type="text" placeholder="e.g. Andhra Pradesh"
                                    value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} required />
                            </div>
                        </div>

                        {error && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', margin: '14px 0 0' }}>{error}</p>}

                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '13px 0', marginTop: 22,
                            background: loading ? '#166534' : 'linear-gradient(135deg,#16a34a,#22c55e)',
                            color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                            border: 'none', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
                            transition: 'opacity 0.2s',
                            fontFamily: "'Barlow Condensed', sans-serif",
                        }}>
                            {loading ? t('submitting') : t('submitrequest')}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Success Modal ───────────────────────────────── */}
            {submitted && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 900,
                    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        background: 'rgba(10,30,10,0.95)',
                        border: '1px solid rgba(34,197,94,0.4)',
                        borderRadius: 16, padding: '48px 52px',
                        textAlign: 'center', maxWidth: 400,
                        boxShadow: '0 0 60px rgba(34,197,94,0.2)',
                        animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                    }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: 18 }}>✅</div>
                        <h3 style={{ color: '#22c55e', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem', letterSpacing: '0.05em', marginBottom: 12 }}>Success!</h3>
                        <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.6 }}>{t('requestsubmittedsuccessfully')}</p>
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

export default SubmitQuery
