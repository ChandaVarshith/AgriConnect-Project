import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import './PublicContent.css'

const PublicContent = () => {
    const [articles, setArticles] = useState([])
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const PER_PAGE = 6

    useEffect(() => {
        API.get('/articles').then(r => setArticles(Array.isArray(r.data) ? r.data : [])).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const filtered = articles.filter(a =>
        a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.summary?.toLowerCase().includes(search.toLowerCase())
    )
    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

    if (selected) return (
        <PageLayout role="public" title="Article">
            <button onClick={() => setSelected(null)} className="public-content-article-back">← Back to Articles</button>
            <div className="public-content-article-container">
                <h2 className="public-content-article-title">{selected.title}</h2>
                <p className="public-content-article-meta">By {selected.authorName || 'Expert'} · {new Date(selected.createdAt).toLocaleDateString()}</p>
                <div className="public-content-article-body" dangerouslySetInnerHTML={{ __html: selected.body || selected.summary || selected.content || '' }} />
            </div>
        </PageLayout>
    )

    return (
        <PageLayout role="public" title="Explore Content">
            <input placeholder="  Search articles…" value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="public-content-search" />

            {loading ? <p className="public-content-loading">Loading…</p> : shown.length === 0 ? (
                <p className="public-content-loading">No articles found.</p>
            ) : (
                <>
                    <div className="public-content-grid">
                        {shown.map(a => (
                            <div key={a._id} className="public-content-card" onClick={() => setSelected(a)}>
                                <div className="public-content-card-category">{a.category || 'Article'}</div>
                                <h3 className="public-content-card-title">{a.title}</h3>
                                <p className="public-content-card-summary">{a.summary?.slice(0, 100) || (a.body?.replace(/<[^>]+>/g, '').slice(0, 100))}...</p>
                                <p className="public-content-card-meta">By {a.authorName || 'Expert'} · {new Date(a.createdAt).toLocaleDateString()}</p>
                                <button className="public-content-card-btn">Read More</button>
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="public-content-pagination">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)} className={`public-content-page-btn ${p === page ? 'public-content-page-btn-active' : 'public-content-page-btn-inactive'}`}>{p}</button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </PageLayout>
    )
}

export default PublicContent
