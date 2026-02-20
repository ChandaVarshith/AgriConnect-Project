import React from 'react'
import { Link } from 'react-router-dom'

const ArticleCard = ({ article }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {article.imageUrl && (
                <img src={article.imageUrl} alt={article.title}
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 4 }} />
            )}
            <div>
                <h4 style={{ color: 'var(--white)', marginBottom: 6 }}>{article.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {article.content?.slice(0, 100)}…
                </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ✍️ {article.expertId?.name || 'Expert'} · {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}
                </span>
                <Link to={`/articles/${article._id}`} className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
                    Read →
                </Link>
            </div>
        </div>
    )
}

export default ArticleCard
