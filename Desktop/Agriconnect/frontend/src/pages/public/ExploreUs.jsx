import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import articleService from '../../services/articleService'

const ExploreUs = () => {
    const [articles, setA] = useState([])
    const [cat, setCat] = useState('all')
    const [loading, setL] = useState(true)

    useEffect(() => {
        articleService.getAllArticles().then(r => setA(r.data)).finally(() => setL(false))
    }, [])

    const cats = ['all', ...new Set(articles.map(a => a.category).filter(Boolean))]
    const filtered = cat === 'all' ? articles : articles.filter(a => a.category === cat)

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
            <Navbar publicNav />
            <div className="content-page">
                <div className="section-title">Explore Farming Content</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
                    {cats.map(c => (
                        <button key={c} onClick={() => setCat(c)} className="btn"
                            style={{ background: cat === c ? '#e02020' : 'rgba(255,255,255,0.07)', color: '#fff', textTransform: 'capitalize', fontSize: '0.8rem' }}>
                            {c}
                        </button>
                    ))}
                </div>
                {loading ? <p className="text-muted">Loading…</p> : (
                    <div className="grid-3">
                        {filtered.map(a => (
                            <div key={a._id} className="info-card">
                                {a.imageUrl && (
                                    <img src={a.imageUrl} alt={a.title}
                                        style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 4, marginBottom: 12, filter: 'brightness(0.8)' }} />
                                )}
                                <h4 style={{ marginBottom: 6, lineHeight: 1.3 }}>{a.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: 8 }}>by {a.expertName || 'Expert'}</p>
                                <p style={{ fontSize: '0.82rem', color: '#bbb', lineHeight: 1.5 }}>{a.content?.substring(0, 120)}…</p>
                            </div>
                        ))}
                        {filtered.length === 0 && <p className="text-muted">No articles found.</p>}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExploreUs
