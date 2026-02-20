import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../context/AuthContext'
import articleService from '../../services/articleService'

const BG = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1400&auto=format&fit=crop&q=80'

const CreateArticle = () => {
    const [form, setForm] = useState({ title: '', content: '', cropType: '', tags: '' })
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [imageName, setImageName] = useState('')
    const [error, setError] = useState('')
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
            data.append('cropType', form.cropType)
            data.append('tags', form.tags)
            if (image) data.append('image', image)
            await articleService.createArticle(data)
            navigate('/expert/responses')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create article.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>
            <img src={BG} alt="greenhouse"
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.32)', zIndex: 0 }} />
            <Navbar role="expert" />

            <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', padding: '90px 20px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                    fontSize: '2rem', color: '#fff', textTransform: 'uppercase',
                    letterSpacing: '0.06em', marginBottom: 28,
                    textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                }}>Create Farming Content</h2>

                <div style={{
                    background: 'rgba(240,240,235,0.92)', backdropFilter: 'blur(4px)',
                    borderRadius: 8, padding: '32px 36px', width: '100%', maxWidth: 700,
                    color: '#1a1a1a',
                }}>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Article Title" value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })} required
                            style={{ width: '100%', padding: '12px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.95rem', color: '#1a1a1a', marginBottom: 16, outline: 'none' }} />

                        <textarea rows={6} placeholder="Article content…" value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })} required
                            style={{ width: '100%', padding: '12px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: 16, outline: 'none', resize: 'vertical', fontFamily: 'monospace' }} />

                        <input type="email" placeholder="Your email" value={user?.email || ''}
                            readOnly
                            style={{ width: '100%', padding: '12px 14px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.9rem', color: '#555', marginBottom: 16, outline: 'none' }} />

                        <input type="text" placeholder="Image URL (optional)" value={form.cropType}
                            onChange={e => setForm({ ...form, cropType: e.target.value })}
                            style={{ width: '100%', padding: '12px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: 16, outline: 'none' }} />

                        <input type="text" placeholder="Tags (e.g. Technology, Crop, Soil)" value={form.tags}
                            onChange={e => setForm({ ...form, tags: e.target.value })}
                            style={{ width: '100%', padding: '12px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: 16, outline: 'none' }} />

                        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 4, padding: '12px 14px', marginBottom: 16 }}>
                            <input type="file" accept="image/*" onChange={handleImageChange}
                                style={{ fontSize: '0.88rem', color: '#333', cursor: 'pointer' }} />
                        </div>

                        {imagePreview && (
                            <div style={{ marginBottom: 16 }}>
                                <img src={imagePreview} alt="preview"
                                    style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 4, marginBottom: 4, border: '1px solid #ddd' }} />
                                <p style={{ fontSize: '0.8rem', color: '#666' }}>{imageName}</p>
                            </div>
                        )}

                        {error && <p style={{ color: '#e02020', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>}

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
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateArticle
