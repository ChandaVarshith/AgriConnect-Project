import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import articleService from '../../services/articleService'
import './ExpertAllContent.css'

const ExpertAllContent = () => {
    const [articles, setArticles] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [expanded, setExpanded] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const PER_PAGE = 6
    const navigate = useNavigate()

    // Backend serves /uploads/ on port 5000, not Vite dev port
    const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')
    const imgSrc = (url) => url ? (url.startsWith('http') ? url : `${BACKEND_URL}${url}`) : null

    const load = () => {
        articleService.getArticles()
            .then(r => setArticles(Array.isArray(r.data) ? r.data : []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleDelete = async (id) => {
        try {
            await articleService.deleteArticle(id)
            setArticles(prev => prev.filter(a => a._id !== id))
            setConfirmDelete(null)
            if (expanded?._id === id) setExpanded(null)
        } catch {
            alert('Failed to delete article. Please try again.')
        }
    }

    const filtered = articles.filter(a =>
        a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.content?.toLowerCase().includes(search.toLowerCase()) ||
        a.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
    )
    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    // Full article view
    if (expanded) {
        const a = expanded
        return (
            <PageLayout role="expert" title={a.title}>
                {imgSrc(a.imageUrl) && (
                    <img src={imgSrc(a.imageUrl)} alt={a.title} className="expert-content-img-full" />
                )}
                <div className="expert-content-article-body">
                    <p className="expert-content-meta-primary">
                        Author: {a.expertId?.name || a.expertId?.email || 'Expert'}
                    </p>
                    <p className="expert-content-meta-secondary">
                        Category: {a.category || a.tags?.[0] || 'Farming Tips'} · Created: {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                    <p className="expert-content-text">
                        {a.content}
                    </p>
                </div>
                <div className="expert-content-actions">
                    <button onClick={() => setExpanded(null)} className="expert-content-back-btn">← Back to All Content</button>
                    <button onClick={() => setConfirmDelete(a._id)} className="expert-content-delete-btn">Delete Delete Article</button>
                </div>

                {/* Confirm delete modal */}
                {confirmDelete === a._id && (
                    <div className="expert-content-modal-overlay">
                        <div className="expert-content-modal">
                            <div className="expert-content-modal-icon">Delete</div>
                            <h3 className="expert-content-modal-title">Delete Article?</h3>
                            <p className="expert-content-modal-text">
                                "{a.title}" will be permanently removed. This cannot be undone.
                            </p>
                            <div className="expert-content-modal-actions">
                                <button onClick={() => setConfirmDelete(null)} className="expert-content-modal-cancel">Cancel</button>
                                <button onClick={() => handleDelete(a._id)} className="expert-content-modal-confirm">Yes, Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </PageLayout>
        )
    }

    return (
        <PageLayout role="expert" title="All Farming Content">
            <div className="expert-content-header">
                <input placeholder="  Search articles…" value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    className="expert-content-search" />
                <button onClick={() => navigate('/expert/article/create')} className="expert-content-create-btn">+ Create Content</button>
            </div>

            {loading ? <p className="expert-content-status">Loading…</p> : shown.length === 0 ? (
                <p className="expert-content-status">No articles found.</p>
            ) : (
                <>
                    <div className="expert-content-grid">
                        {shown.map(a => (
                            <div key={a._id} className="expert-content-card">
                                {imgSrc(a.imageUrl) && (
                                    <img src={imgSrc(a.imageUrl)} alt={a.title} className="expert-content-card-img" />
                                )}
                                <div className="expert-content-card-body">
                                    <div className="expert-content-card-category">
                                        {a.category || a.tags?.[0] || 'Article'}
                                    </div>
                                    <h3 className="expert-content-card-title">{a.title}</h3>
                                    <p className="expert-content-card-desc">
                                        {a.content?.slice(0, 100)}...
                                    </p>
                                    <p className="expert-content-card-meta">
                                        By {a.expertId?.name || 'Expert'} · {new Date(a.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="expert-content-card-actions">
                                        <button onClick={() => setExpanded(a)} className="expert-content-show-btn">Show Full</button>
                                        {confirmDelete === a._id ? (
                                            <div className="expert-content-card-confirm-group">
                                                <button onClick={() => handleDelete(a._id)} className="expert-content-card-confirm">Confirm</button>
                                                <button onClick={() => setConfirmDelete(null)} className="expert-content-card-cancel">Cancel</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setConfirmDelete(a._id)} className="expert-content-card-del-btn">Delete</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="expert-content-pagination">
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="expert-content-page-btn">Prev</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)} className={`expert-content-page-btn ${p === page ? 'active' : ''}`}>{p}</button>
                            ))}
                            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="expert-content-page-btn">Next</button>
                        </div>
                    )}
                </>
            )}
        </PageLayout>
    )
}

export default ExpertAllContent
