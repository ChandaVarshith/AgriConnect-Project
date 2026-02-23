import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { useAuth } from '../../context/AuthContext'
import articleService from '../../services/articleService'

const CreateArticle = () => {
    const [form, setForm] = useState({ title: '', content: '', category: '', tags: '' })
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [imageName, setImageName] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { user } = useAuth()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setImageName(file.name)
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result)
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const data = new FormData()
            data.append('title', form.title)
            data.append('content', form.content)
            data.append('category', form.category)
            data.append('tags', form.tags)
            if (image) data.append('image', image)
            await articleService.createArticle(data)
            setSuccess(true)
            setTimeout(() => navigate('/expert/content'), 1800)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create article.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <PageLayout role="expert" title="Create Farming Content">
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', minHeight: 300,
                }}>
                    <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
                    <h2 style={{ color: '#4caf50', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem' }}>
                        Content Saved Successfully!
                    </h2>
                    <p style={{ color: '#aaa', marginTop: 8 }}>Redirecting to All Content…</p>
                </div>
            </PageLayout>
        )
    }

    return (
        <PageLayout role="expert" title="Create Farming Content">
            <div style={{
                background: 'rgba(240,240,235,0.92)', backdropFilter: 'blur(4px)',
                borderRadius: 8, padding: '32px 36px', width: '100%', maxWidth: 700,
                color: '#1a1a1a',
            }}>
                <form onSubmit={handleSubmit}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Heading</label>
                    <input type="text" placeholder="Article Title" value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })} required
                        style={{ width: '100%', padding: '12px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.95rem', color: '#1a1a1a', marginBottom: 16, outline: 'none' }} />

                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Description</label>
                    <textarea rows={6} placeholder="Write your article content here…" value={form.content}
                        onChange={e => setForm({ ...form, content: e.target.value })} required
                        style={{ width: '100%', padding: '12px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: 16, outline: 'none', resize: 'vertical' }} />

                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Email</label>
                    <input type="email" placeholder="Your email" value={user?.email || ''}
                        readOnly
                        style={{ width: '100%', padding: '12px 14px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.9rem', color: '#555', marginBottom: 16, outline: 'none' }} />

                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Category</label>
                    <input type="text" placeholder="e.g. Farming Tips, Technology, Soil" value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                        style={{ width: '100%', padding: '12px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: 16, outline: 'none' }} />

                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Tags</label>
                    <input type="text" placeholder="Tags (e.g. AI, Irrigation, Organic)" value={form.tags}
                        onChange={e => setForm({ ...form, tags: e.target.value })}
                        style={{ width: '100%', padding: '12px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: 16, outline: 'none' }} />

                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Choose File</label>
                    <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 4, padding: '12px 14px', marginBottom: 16 }}>
                        <input type="file" accept="image/*" onChange={handleImageChange}
                            style={{ fontSize: '0.88rem', color: '#333', cursor: 'pointer' }} />
                    </div>

                    {imagePreview && (
                        <div style={{ marginBottom: 16 }}>
                            <img src={imagePreview} alt="preview"
                                style={{ width: 140, height: 100, objectFit: 'cover', borderRadius: 4, marginBottom: 4, border: '1px solid #ddd' }} />
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>{imageName}</p>
                        </div>
                    )}

                    {error && <p style={{ color: '#e02020', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>}

                    <div style={{ display: 'flex', gap: 12 }}>
                        <button type="submit" disabled={loading} style={{
                            padding: '13px 32px', background: '#4caf50', color: '#fff',
                            border: 'none', borderRadius: 4, fontFamily: "'Barlow Condensed', sans-serif",
                            fontWeight: 700, fontSize: '1rem', letterSpacing: '0.08em',
                            textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s',
                        }}
                            onMouseEnter={e => { if (!loading) e.target.style.background = '#388e3c' }}
                            onMouseLeave={e => { if (!loading) e.target.style.background = '#4caf50' }}
                        >
                            {loading ? 'Publishing…' : 'Save Content'}
                        </button>
                        <button type="button" onClick={() => navigate('/expert/content')} style={{
                            padding: '13px 24px', background: 'transparent', color: '#555',
                            border: '1px solid #ccc', borderRadius: 4, fontWeight: 600, fontSize: '0.9rem',
                            cursor: 'pointer',
                        }}>Go Back</button>
                    </div>
                </form>
            </div>
        </PageLayout>
    )
}

export default CreateArticle
