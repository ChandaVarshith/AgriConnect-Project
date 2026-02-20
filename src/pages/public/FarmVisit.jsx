import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import API from '../../services/api'

const FarmVisit = () => {
    const [form, setForm] = useState({ visitorName: '', email: '', date: '', message: '' })
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await API.post('/farmvisit', form)
            setSuccess('Your farm visit request has been submitted successfully! We will contact you soon.')
            setForm({ visitorName: '', email: '', date: '', message: '' })
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <Navbar title="Farm Visit" publicNav />
            <div className="container" style={{ padding: '40px 24px', maxWidth: 580 }}>
                <h2 className="mb-2">🚜 Book a Farm Visit</h2>
                <p className="mb-3">Experience farming first-hand. Register for an immersive farm visit experience.</p>
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Your Name</label>
                            <input type="text" placeholder="Full name" value={form.visitorName}
                                onChange={e => setForm({ ...form, visitorName: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="your@email.com" value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Preferred Visit Date</label>
                            <input type="date" value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Message (optional)</label>
                            <textarea rows={3} placeholder="Any special requests or questions?" value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })} />
                        </div>
                        {success && <p style={{ color: 'var(--success)' }} className="mb-2">{success}</p>}
                        {error && <p style={{ color: 'var(--danger)' }} className="mb-2">{error}</p>}
                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? 'Submitting…' : '🚜 Register for Farm Visit'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FarmVisit
