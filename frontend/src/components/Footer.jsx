import React, { useState } from 'react'
import axios from 'axios'
import './Footer.css'

const GithubIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
)

const LinkedinIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
)

const Footer = () => {
    const [isHelpOpen, setIsHelpOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '', email: '', mobile: '', issueType: 'General Inquiry', description: ''
    })
    const [status, setStatus] = useState({ loading: false, success: false, error: '' })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, success: false, error: '' })
        try {
            await axios.post('http://localhost:5000/api/contact', formData)
            setStatus({ loading: false, success: true, error: '' })
            setFormData({ name: '', email: '', mobile: '', issueType: 'General Inquiry', description: '' })
            // Auto close after 3 seconds
            setTimeout(() => {
                setIsHelpOpen(false)
                setStatus({ loading: false, success: false, error: '' })
            }, 3000)
        } catch (err) {
            setStatus({ loading: false, success: false, error: err.response?.data?.message || 'Failed to send message' })
        }
    }

    return (
        <footer className="global-footer">
            
            {/* Sliding Help Center Form */}
            <div className={`help-center-panel ${isHelpOpen ? 'open' : ''}`}>
                <div className="help-center-header">
                    <h4>AgriConnect Help Center</h4>
                    <button className="close-help-btn" onClick={() => setIsHelpOpen(false)}>×</button>
                </div>
                
                {status.success ? (
                    <div className="help-success-state">
                        <div className="success-icon">✓</div>
                        <p>Message sent successfully!</p>
                        <span>We will get back to you soon.</span>
                    </div>
                ) : (
                    <form className="help-center-form" onSubmit={handleSubmit}>
                        {status.error && <div className="help-error">{status.error}</div>}
                        
                        <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="help-input" />
                        <input type="tel" name="mobile" placeholder="Mobile Number (Reply via WhatsApp/Call)" value={formData.mobile} onChange={handleChange} required className="help-input" />
                        <input type="email" name="email" placeholder="Email Address (Optional)" value={formData.email} onChange={handleChange} className="help-input" />
                        
                        <select name="issueType" value={formData.issueType} onChange={handleChange} className="help-input help-select">
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Technical Issue">Technical Issue</option>
                            <option value="Expert Request">Expert Request</option>
                            <option value="Feature Suggestion">Feature Suggestion</option>
                            <option value="Other">Other</option>
                        </select>

                        <textarea name="description" placeholder="Describe your issue or request in detail..." value={formData.description} onChange={handleChange} required className="help-textarea" rows="4"></textarea>

                        <button type="submit" className="help-submit-btn" disabled={status.loading}>
                            {status.loading ? 'Sending...' : 'Send Request'}
                        </button>
                    </form>
                )}
            </div>

            <div className="footer-content">
                <div className="footer-left">
                    <button className="help-center-toggle-btn" onClick={() => setIsHelpOpen(!isHelpOpen)}>
                        <span className="help-icon">?</span> Help Center
                    </button>
                </div>
                <div className="footer-socials">
                    <a href="https://github.com/ChandaVarshith/AgriConnect-Project" target="_blank" rel="noopener noreferrer" className="social-link">
                        <GithubIcon />
                    </a>
                    <a href="https://www.linkedin.com/in/chanda-naga-venkata-sai-siva-varshith-175a57299/" target="_blank" rel="noopener noreferrer" className="social-link">
                        <LinkedinIcon />
                    </a>
                </div>
                <div className="footer-right">
                    <p>@2026 AgriConnect All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
