import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import queryService from '../../services/queryService'

// Dark moody farm bg – matches reference "send crop suggestion" page
const BG = 'https://images.unsplash.com/photo-1594761051656-153cd94d05d0?w=1400&auto=format&fit=crop&q=80'

const SubmitQuery = () => {
    const [form, setForm] = useState({ cropType: '', description: '', location: '' })
    const [error, setError] = useState('')
    const [success, setS] = useState('')
    const [loading, setL] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setL(true)
        try {
            await queryService.submitQuery(form)
            setS('Request submitted successfully!')
            setTimeout(() => navigate('/farmer/responses'), 1600)
        } catch (err) { setError(err.response?.data?.message || 'Submission failed.') }
        finally { setL(false) }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>
            <img src={BG} alt="farm"
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.32)', zIndex: 0 }} />
            <Navbar role="farmer" />
            <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '90px 20px 40px' }}>
                <div className="glass-card">
                    <h2>Send Crop Suggestion Request</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Crop Type:</label>
                        <input type="text" placeholder="e.g. Paddy, Wheat, Cotton" value={form.cropType}
                            onChange={e => setForm({ ...form, cropType: e.target.value })} required />
                        <label>Request Details:</label>
                        <textarea rows={5} placeholder="Describe your issue or requirement…" value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })} required
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 4, border: '1px solid #ccc', fontSize: '0.9rem', outline: 'none', resize: 'vertical', color: '#1a1a1a', marginBottom: 16 }} />
                        <label>Location (District, State):</label>
                        <input type="text" placeholder="e.g. Guntur, Andhra Pradesh" value={form.location}
                            onChange={e => setForm({ ...form, location: e.target.value })} required />
                        {error && <p className="msg-error">{error}</p>}
                        {success && <p className="msg-success">{success}</p>}
                        <button className="btn-submit" type="submit" disabled={loading}>
                            {loading ? 'Submitting…' : 'Submit Request'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SubmitQuery
