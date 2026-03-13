import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'
import './ExploreArticles.css'

const ExploreArticles = () => {
    const { t } = useLanguage()
    // Backend serves /uploads/ static files on port 5000, not Vite's port 3000
    const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')
    const imgSrc = (url) => url ? (url.startsWith('http') ? url : `${BACKEND_URL}${url}`) : null
    const [articles, setA] = useState([])
    const [search, setS] = useState('')
    const [page, setPage] = useState(1)
    const [selected, setSelected] = useState(null)
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

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

    return (
        <PageLayout role="farmer" title={t('allfarmingcontent')}>
            {/* Search */}
            <input
                placeholder={`  ${t('search')} by title or crop…`}
                value={search}
                onChange={e => { setS(e.target.value); setPage(1) }}
                className="explore-articles-search"
            />

            {/* Grid */}
            <div className="explore-articles-grid">
                {pageItems.map(a => (
                    <div key={a._id} className="explore-articles-card">
                        {imgSrc(a.imageUrl) ? (
                            <img src={imgSrc(a.imageUrl)} alt={a.title} className="explore-articles-card-img" />
                        ) : (
                            <div className="explore-articles-card-img-placeholder">
                                
                            </div>
                        )}
                        <div className="explore-articles-card-content">
                            <h4 className="explore-articles-card-title">{a.title}</h4>
                            <p className="explore-articles-card-author">by {a.expertName || 'Expert'}</p>
                            <p className="explore-articles-card-desc">
                                {a.content?.substring(0, 90)}…
                            </p>
                            <button onClick={() => setSelected(a)} className="explore-articles-card-btn">
                                {t('showfull')}
                            </button>
                        </div>
                    </div>
                ))}
                {pageItems.length === 0 && <p className="explore-articles-no-msg">{t('noarticlesfound')}</p>}
            </div>

            {/* Pagination */}
            {total > 1 && (
                <div className="explore-articles-pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className={`explore-articles-page-btn ${page === 1 ? 'disabled' : 'active'}`}
                    >
                        ← {t('previous')}
                    </button>
                    {Array.from({ length: total }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            className={`explore-articles-page-num ${page === i + 1 ? 'active' : 'inactive'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        disabled={page === total}
                        onClick={() => setPage(p => p + 1)}
                        className={`explore-articles-page-btn ${page === total ? 'disabled' : 'active'}`}
                    >
                        {t('next')} →
                    </button>
                </div>
            )}

            {/* ── Full Content Modal ─────────────────────────── */}
            {selected && (
                <div className="explore-articles-modal-overlay" onClick={() => setSelected(null)}>
                    <div className="explore-articles-modal-content" onClick={e => e.stopPropagation()}>
                        {imgSrc(selected.imageUrl) && (
                            <img src={imgSrc(selected.imageUrl)} alt={selected.title} className="explore-articles-modal-img" />
                        )}
                        <div className="explore-articles-modal-body">
                            <h2 className="explore-articles-modal-title">
                                {selected.title}
                            </h2>
                            <div className="explore-articles-modal-meta">
                                {[
                                    { label: t('author'), val: selected.expertName || selected.expertEmail || 'Expert' },
                                    { label: t('category'), val: selected.cropType || '—' },
                                    { label: t('createddate'), val: formatDate(selected.createdAt) },
                                ].map(m => (
                                    <div key={m.label}>
                                        <span className="label">{m.label}</span>
                                        <span className="value">{m.val}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="explore-articles-modal-text">
                                {selected.content}
                            </div>
                            <button onClick={() => setSelected(null)} className="explore-articles-modal-close">
                                ← {t('back')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageLayout>
    )
}

export default ExploreArticles
