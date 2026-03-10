import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import articleService from '../../services/articleService'
import './ExploreUs.css'

const ExploreUs = () => {
    const [articles, setA] = useState([])
    const [cat, setCat] = useState('all')
    const [loading, setL] = useState(true)

    useEffect(() => {
        articleService.getArticles().then(r => setA(r.data)).finally(() => setL(false))
    }, [])

    const cats = ['all', ...new Set(articles.map(a => a.category).filter(Boolean))]
    const filtered = cat === 'all' ? articles : articles.filter(a => a.category === cat)

    return (
        <PageLayout role="public" publicNav title="Explore Farming Content">
            <div className="content-page" style={{ padding: 0 }}>
                <div className="explore-us-filters">
                    {cats.map(c => (
                        <button key={c} onClick={() => setCat(c)} className={`btn explore-us-filter-btn ${cat === c ? 'active' : ''}`}>
                            {c}
                        </button>
                    ))}
                </div>
                {loading ? <p className="text-muted">Loading…</p> : (
                    <div className="grid-3">
                        {filtered.map(a => (
                            <div key={a._id} className="info-card">
                                {a.imageUrl && (
                                    <img src={a.imageUrl} alt={a.title} className="explore-us-card-img" />
                                )}
                                <h4 className="explore-us-card-title">{a.title}</h4>
                                <p className="explore-us-card-author">by {a.expertName || 'Expert'}</p>
                                <p className="explore-us-card-summary">{a.content?.substring(0, 120)}…</p>
                            </div>
                        ))}
                        {filtered.length === 0 && <p className="text-muted">No articles found.</p>}
                    </div>
                )}
            </div>
        </PageLayout>
    )
}

export default ExploreUs
