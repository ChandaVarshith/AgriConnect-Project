import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'
import { useLanguage } from '../../context/LanguageContext'
import './SubmitQuery.css'

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

    return (
        <PageLayout role="farmer" title={t('sendcropsuggestionrequest')}>
            <div className="submit-query-container">
                <div className="submit-query-form-card">
                    <form onSubmit={handleSubmit}>
                        <label className="submit-query-label">{t('croptype')}</label>
                        <input className="submit-query-input" type="text" placeholder="e.g. Paddy, Wheat, Cotton"
                            value={form.cropType} onChange={e => setForm({ ...form, cropType: e.target.value })} required />

                        <label className="submit-query-label">{t('requestdetails')}</label>
                        <textarea rows={5} className="submit-query-input"
                            placeholder="Describe your issue or requirement…"
                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />

                        {/* District + State side by side */}
                        <div className="submit-query-district-state">
                            <div>
                                <label className="submit-query-label">{t('district')}</label>
                                <input className="submit-query-input" type="text" placeholder="e.g. Guntur"
                                    value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} required />
                            </div>
                            <div>
                                <label className="submit-query-label">{t('state')}</label>
                                <input className="submit-query-input" type="text" placeholder="e.g. Andhra Pradesh"
                                    value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} required />
                            </div>
                        </div>

                        {error && <p className="submit-query-error">{error}</p>}

                        <button type="submit" disabled={loading} className="submit-query-btn">
                            {loading ? t('submitting') : t('submitrequest')}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Success Modal ───────────────────────────────── */}
            {submitted && (
                <div className="submit-query-modal-overlay">
                    <div className="submit-query-modal-content">
                        <div className="submit-query-modal-icon">✅</div>
                        <h3 className="submit-query-modal-title">Success!</h3>
                        <p className="submit-query-modal-text">{t('requestsubmittedsuccessfully')}</p>
                    </div>
                </div>
            )}
        </PageLayout>
    )
}

export default SubmitQuery
