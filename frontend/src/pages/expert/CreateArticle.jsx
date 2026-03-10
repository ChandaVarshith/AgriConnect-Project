import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { useAuth } from '../../context/AuthContext'
import articleService from '../../services/articleService'
import './CreateArticle.css'

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
                <div className="create-article-success-container">
                    <div className="create-article-success-icon">✅</div>
                    <h2 className="create-article-success-title">
                        Content Saved Successfully!
                    </h2>
                    <p className="create-article-success-desc">Redirecting to All Content…</p>
                </div>
            </PageLayout>
        )
    }

    return (
        <PageLayout role="expert" title="Create Farming Content">
            <div className="create-article-card">
                <form onSubmit={handleSubmit}>
                    <label className="create-article-label">Heading</label>
                    <input type="text" placeholder="Article Title" value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })} required
                        className="create-article-input" />

                    <label className="create-article-label">Description</label>
                    <textarea rows={6} placeholder="Write your article content here…" value={form.content}
                        onChange={e => setForm({ ...form, content: e.target.value })} required
                        className="create-article-input" />

                    <label className="create-article-label">Email</label>
                    <input type="email" placeholder="Your email" value={user?.email || ''}
                        readOnly
                        className="create-article-input" />

                    <label className="create-article-label">Category</label>
                    <input type="text" placeholder="e.g. Farming Tips, Technology, Soil" value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                        className="create-article-input" />

                    <label className="create-article-label">Tags</label>
                    <input type="text" placeholder="Tags (e.g. AI, Irrigation, Organic)" value={form.tags}
                        onChange={e => setForm({ ...form, tags: e.target.value })}
                        className="create-article-input" />

                    <label className="create-article-label">Choose File</label>
                    <div className="create-article-file-wrap">
                        <input type="file" accept="image/*" onChange={handleImageChange}
                            className="create-article-file-input" />
                    </div>

                    {imagePreview && (
                        <div className="create-article-preview-wrap">
                            <img src={imagePreview} alt="preview" className="create-article-preview-img" />
                            <p className="create-article-preview-name">{imageName}</p>
                        </div>
                    )}

                    {error && <p className="create-article-error">{error}</p>}

                    <div className="create-article-actions">
                        <button type="submit" disabled={loading} className="create-article-btn-save">
                            {loading ? 'Publishing…' : 'Save Content'}
                        </button>
                        <button type="button" onClick={() => navigate('/expert/content')} className="create-article-btn-cancel">
                            Go Back
                        </button>
                    </div>
                </form>
            </div>
        </PageLayout>
    )
}

export default CreateArticle
