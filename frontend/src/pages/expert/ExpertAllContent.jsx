import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import articleService from '../../services/articleService'

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
                    <img src={imgSrc(a.imageUrl)} alt={a.title} style={{
                        width: '100%', maxHeight: 360, objectFit: 'cover',
                        borderRadius: 10, marginBottom: 20,
                    }} />
                )}
                <div style={{ background: 'rgba(10,18,10,0.88)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '24px 28px', marginBottom: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
                    <p style={{ color: '#4caf50', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                        Author: {a.expertId?.name || a.expertId?.email || 'Expert'}
                    </p>
                    <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: 8 }}>
                        Category: {a.category || a.tags?.[0] || 'Farming Tips'} · Created: {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                    <p style={{ color: '#ddd', fontSize: '0.92rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                        {a.content}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => setExpanded(null)} style={{
                        padding: '10px 28px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    }}>← Back to All Content</button>
                    <button onClick={() => setConfirmDelete(a._id)} style={{
                        padding: '10px 24px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
                        color: '#f87171', borderRadius: 6, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    }}>🗑 Delete Article</button>
                </div>

                {/* Confirm delete modal */}
                {confirmDelete === a._id && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <div style={{
                            background: '#1a1a1a', border: '1px solid rgba(239,68,68,0.4)',
                            borderRadius: 12, padding: '32px 36px', maxWidth: 420, width: '90%', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🗑️</div>
                            <h3 style={{ color: '#fff', marginBottom: 8 }}>Delete Article?</h3>
                            <p style={{ color: '#aaa', fontSize: '0.88rem', marginBottom: 24 }}>
                                "{a.title}" will be permanently removed. This cannot be undone.
                            </p>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                <button onClick={() => setConfirmDelete(null)} style={{
                                    padding: '10px 24px', background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                                    borderRadius: 6, fontWeight: 600, cursor: 'pointer',
                                }}>Cancel</button>
                                <button onClick={() => handleDelete(a._id)} style={{
                                    padding: '10px 24px', background: '#ef4444',
                                    border: 'none', color: '#fff',
                                    borderRadius: 6, fontWeight: 700, cursor: 'pointer',
                                }}>Yes, Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </PageLayout>
        )
    }

    return (
        <PageLayout role="expert" title="All Farming Content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <input placeholder="🔍  Search articles…" value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', width: '100%', maxWidth: 360, outline: 'none' }} />
                <button onClick={() => navigate('/expert/article/create')} style={{
                    background: '#22c55e', color: '#000', border: 'none', borderRadius: 6,
                    padding: '10px 22px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                }}>+ Create Content</button>
            </div>

            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : shown.length === 0 ? (
                <p style={{ color: '#aaa' }}>No articles found.</p>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 28 }}>
                        {shown.map(a => (
                            <div key={a._id} style={{
                                background: 'rgba(255,255,255,0.10)',
                                backdropFilter: 'blur(18px)',
                                WebkitBackdropFilter: 'blur(18px)',
                                border: '1px solid rgba(255,255,255,0.22)',
                                borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                            }}>
                                {imgSrc(a.imageUrl) && (
                                    <img src={imgSrc(a.imageUrl)} alt={a.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                                )}
                                <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ color: '#3b82f6', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                        {a.category || a.tags?.[0] || 'Article'}
                                    </div>
                                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.05rem', fontFamily: "'Barlow Condensed',sans-serif" }}>{a.title}</h3>
                                    <p style={{ color: '#aaa', fontSize: '0.83rem', margin: 0, lineHeight: 1.5 }}>
                                        {a.content?.slice(0, 100)}...
                                    </p>
                                    <p style={{ color: '#555', fontSize: '0.76rem', margin: 0 }}>
                                        By {a.expertId?.name || 'Expert'} · {new Date(a.createdAt).toLocaleDateString()}
                                    </p>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                                        <button onClick={() => setExpanded(a)} style={{
                                            flex: 1, padding: '7px 0', background: '#3b82f6', color: '#fff',
                                            border: 'none', borderRadius: 5, fontWeight: 700, fontSize: '0.8rem',
                                            cursor: 'pointer',
                                        }}>Show Full</button>
                                        {confirmDelete === a._id ? (
                                            <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                                                <button onClick={() => handleDelete(a._id)} style={{
                                                    flex: 1, padding: '7px 0', background: '#ef4444', color: '#fff',
                                                    border: 'none', borderRadius: 5, fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                                                }}>Confirm</button>
                                                <button onClick={() => setConfirmDelete(null)} style={{
                                                    flex: 1, padding: '7px 0', background: 'rgba(255,255,255,0.1)', color: '#aaa',
                                                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 5, fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
                                                }}>Cancel</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setConfirmDelete(a._id)} style={{
                                                padding: '7px 12px', background: 'rgba(239,68,68,0.12)', color: '#f87171',
                                                border: '1px solid rgba(239,68,68,0.3)', borderRadius: 5, fontWeight: 700,
                                                fontSize: '0.8rem', cursor: 'pointer',
                                            }}>🗑</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{
                                background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 6,
                                padding: '8px 16px', cursor: page <= 1 ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: page <= 1 ? 0.4 : 1,
                            }}>Prev</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)} style={{
                                    background: p === page ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                    color: '#fff', border: 'none', borderRadius: 6,
                                    padding: '8px 16px', cursor: 'pointer', fontWeight: p === page ? 700 : 400,
                                }}>{p}</button>
                            ))}
                            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{
                                background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 6,
                                padding: '8px 16px', cursor: page >= totalPages ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: page >= totalPages ? 0.4 : 1,
                            }}>Next</button>
                        </div>
                    )}
                </>
            )}
        </PageLayout>
    )
}

export default ExpertAllContent
