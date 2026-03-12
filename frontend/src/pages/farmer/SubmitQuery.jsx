import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'
import API from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'
import './SubmitQuery.css'

const SubmitQuery = () => {
    const { t } = useLanguage()
    const [form, setForm] = useState({ cropType: '', description: '', district: '', state: '' })
    const [requestDiseaseCheck, setRequestDiseaseCheck] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [imageUrl, setImageUrl] = useState('')
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    const [loading, setL] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const navigate = useNavigate()

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
        setImageUrl('')

        // Upload to Cloudinary immediately
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('image', file)
            // Use configured API instance so Auth token is attached automatically
            const res = await API.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            setImageUrl(res.data.url)
        } catch (err) {
            console.error('Image upload failed:', err)
            setError('Image upload failed. Please try again.')
            setImageFile(null)
            setImagePreview(null)
        } finally {
            setUploading(false)
        }
    }

    const removeImage = () => {
        setImageFile(null)
        setImagePreview(null)
        setImageUrl('')
        setError('')
    }

    const handleToggleDiseaseCheck = (e) => {
        const checked = e.target.checked;
        setRequestDiseaseCheck(checked);
        if (!checked) {
            removeImage(); // clear image if turning off disease check
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        
        if (requestDiseaseCheck && !imageUrl) {
            setError('Please upload a crop image for disease detection.');
            return;
        }

        setL(true)
        try {
            const location = `${form.district}, ${form.state}`
            await queryService.submitQuery({ ...form, location, imageUrl: imageUrl || null })
            setSubmitted(true)
            setTimeout(() => navigate('/farmer/responses'), 2200)
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed.')
        } finally {
            setL(false)
        }
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
                        <textarea rows={4} className="submit-query-input"
                            placeholder="Describe your issue or requirement…"
                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />

                        {/* District + State */}
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

                        {/* ── Conditional Disease Check Toggle ──────────────────────────── */}
                        <div className="submit-query-disease-toggle">
                            <label className="submit-query-checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={requestDiseaseCheck} 
                                    onChange={handleToggleDiseaseCheck} 
                                    className="submit-query-checkbox"
                                />
                                Request Crop Disease Detection?
                            </label>
                            <p className="submit-query-image-hint">
                                Check this box if you want our experts and AI to analyze a photo of your crop for diseases.
                            </p>
                        </div>

                        {/* ── Optional Image Upload (Visible if checked) ──────────────────────────── */}
                        {requestDiseaseCheck && (
                            <div className="submit-query-image-section">
                                <label className="submit-query-label">
                                    📷 Crop Disease Image <span className="submit-query-required">*</span>
                                </label>
                                <p className="submit-query-image-hint" style={{ marginTop: '-4px' }}>
                                    Please attach a clear photo of the affected crop leaves. 
                                </p>

                                {!imagePreview ? (
                                    <label htmlFor="query-image-upload" className="submit-query-image-dropzone">
                                        <input
                                            id="query-image-upload"
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleImageChange}
                                        />
                                        <span className="submit-query-image-icon">🌿</span>
                                        <span>Click to attach a crop image</span>
                                    </label>
                                ) : (
                                    <div className="submit-query-image-preview-wrap">
                                        <img src={imagePreview} alt="crop" className="submit-query-image-preview" />
                                        {uploading && (
                                            <div className="submit-query-image-uploading">⏳ Uploading…</div>
                                        )}
                                        {!uploading && imageUrl && (
                                            <div className="submit-query-image-ready">✅ Image ready</div>
                                        )}
                                        <button type="button" className="submit-query-image-remove" onClick={removeImage}>
                                            ✕ Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {error && <p className="submit-query-error">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading || uploading || (requestDiseaseCheck && !imageUrl && !uploading)}
                            className="submit-query-btn"
                        >
                            {loading ? t('submitting') : uploading ? 'Uploading image…' : t('submitrequest')}
                        </button>
                    </form>
                </div>
            </div>

            {/* ── Success Modal ─────────────────────────────────────────── */}
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
