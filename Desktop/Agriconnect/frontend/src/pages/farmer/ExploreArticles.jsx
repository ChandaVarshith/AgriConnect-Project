import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import API from '../../services/api'
import { Link } from 'react-router-dom'

const ExploreArticles = () => {
    const [articles, setA] = useState([])
    const [search, setS] = useState('')
    const [page, setPage] = useState(1)
    const PER_PAGE = 6

    useEffect(() => {
        API.get('/articles').then(r => setA(r.data)).catch(() => { })
    }, [])

    const filtered = articles.filter(a =>
        a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.cropType?.toLowerCase().includes(search.toLowerCase())
    )
    const total = Math.ceil(filtered.length / PER_PAGE)
    const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
            <Navbar role="farmer" />
            <div className="content-page">
                <div className="section-title">Explore Farming Content</div>
                <input className="dark-input" placeholder="🔍  Search articles by title or crop…"
                    value={search} onChange={e => { setS(e.target.value); setPage(1) }}
                    style={{ maxWidth: 400, marginBottom: 24 }} />
                <div className="grid-3">
                    {pageItems.map(a => (
                        <div key={a._id} className="info-card">
                            {a.imageUrl && (
                                <img src={a.imageUrl} alt={a.title}
                                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 4, marginBottom: 12, filter: 'brightness(0.85)' }} />
                            )}
                            <h4 style={{ marginBottom: 6, lineHeight: 1.3 }}>{a.title}</h4>
                            <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: 8 }}>by {a.expertName || 'Expert'}</p>
                            <p style={{ fontSize: '0.82rem', color: '#bbb', marginBottom: 14, lineHeight: 1.5 }}>{a.content?.substring(0, 100)}…</p>
                            <Link to={`/farmer/articles/${a._id}`} className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '6px 14px' }}>Show Full</Link>
                        </div>
                    ))}
                    {pageItems.length === 0 && <p className="text-muted">No articles found.</p>}
                </div>
                {total > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                        <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                        <span style={{ alignSelf: 'center', color: '#888', fontSize: '0.85rem' }}>Page {page} of {total}</span>
                        <button className="btn btn-outline" disabled={page === total} onClick={() => setPage(p => p + 1)}>Next →</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExploreArticles
