import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'

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

    const cardStyle = {
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12, padding: '22px 20px',
        display: 'flex', flexDirection: 'column', gap: 10,
        cursor: 'pointer', transition: 'all 0.2s',
    }

    if (selected) return (
        <PageLayout role="public" title="Article">
            <button onClick={() => setSelected(null)} style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', marginBottom: 24, fontSize: '0.88rem',
            }}>← Back to Articles</button>
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '32px 36px' }}>
                <h2 style={{ color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '2rem', marginBottom: 8 }}>{selected.title}</h2>
                <p style={{ color: '#aaa', fontSize: '0.82rem', marginBottom: 20 }}>By {selected.authorName || 'Expert'} · {new Date(selected.createdAt).toLocaleDateString()}</p>
                <div style={{ color: '#ddd', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: selected.body || selected.summary || selected.content || '' }} />
            </div>
        </PageLayout>
    )

    return (
        <PageLayout role="public" title="Explore Content">
            <input placeholder="🔍  Search articles…" value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', width: '100%', maxWidth: 400, marginBottom: 24, outline: 'none' }} />

            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : shown.length === 0 ? (
                <p style={{ color: '#aaa' }}>No articles found.</p>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 28 }}>
                        {shown.map(a => (
                            <div key={a._id} style={cardStyle}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                                <div style={{ color: '#3b82f6', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{a.category || 'Article'}</div>
                                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.05rem', fontFamily: "'Barlow Condensed',sans-serif" }}>{a.title}</h3>
                                <p style={{ color: '#aaa', fontSize: '0.83rem', margin: 0, lineHeight: 1.5 }}>{a.summary?.slice(0, 100) || (a.body?.replace(/<[^>]+>/g, '').slice(0, 100))}...</p>
                                <p style={{ color: '#666', fontSize: '0.76rem', margin: 0 }}>By {a.authorName || 'Expert'} · {new Date(a.createdAt).toLocaleDateString()}</p>
                                <button onClick={() => setSelected(a)} style={{ alignSelf: 'flex-start', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Read More</button>
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)} style={{
                                    background: p === page ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                    color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: p === page ? 700 : 400,
                                }}>{p}</button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </PageLayout>
    )
}

export default PublicContent
