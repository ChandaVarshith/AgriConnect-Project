import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'

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
                placeholder={`🔍  ${t('search')} by title or crop…`}
                value={search}
                onChange={e => { setS(e.target.value); setPage(1) }}
                style={{
                    padding: '10px 16px', borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.18)',
                    background: 'rgba(255,255,255,0.07)',
                    color: '#fff', fontSize: '0.9rem',
                    width: '100%', maxWidth: 420, marginBottom: 24,
                    outline: 'none', backdropFilter: 'blur(8px)',
                    fontFamily: "'Inter', sans-serif",
                }}
            />

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                gap: 20,
            }}>
                {pageItems.map(a => (
                    <div key={a._id} style={{
                        background: 'rgba(10,18,10,0.88)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 12, overflow: 'hidden',
                        display: 'flex', flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'; }}
                    >
                        {imgSrc(a.imageUrl) ? (
                            <img src={imgSrc(a.imageUrl)} alt={a.title}
                                style={{ width: '100%', height: 160, objectFit: 'cover', filter: 'brightness(0.85)' }} />
                        ) : (
                            <div style={{ width: '100%', height: 120, background: 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(5,150,105,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                                🌱
                            </div>
                        )}
                        <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h4 style={{ color: '#fff', marginBottom: 6, lineHeight: 1.3, fontSize: '0.95rem' }}>{a.title}</h4>
                            <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: 8 }}>by {a.expertName || 'Expert'}</p>
                            <p style={{ fontSize: '0.82rem', color: '#bbb', marginBottom: 16, lineHeight: 1.55, flex: 1 }}>
                                {a.content?.substring(0, 90)}…
                            </p>
                            <button onClick={() => setSelected(a)} style={{
                                display: 'inline-block', padding: '8px 0', width: '100%',
                                background: 'linear-gradient(135deg,#16a34a,#22c55e)',
                                color: '#fff',
                                fontFamily: "'Barlow Condensed', sans-serif",
                                fontWeight: 700, fontSize: '0.82rem',
                                borderRadius: 6, border: 'none', cursor: 'pointer',
                                textTransform: 'uppercase', letterSpacing: '0.06em',
                            }}>
                                {t('showfull')}
                            </button>
                        </div>
                    </div>
                ))}
                {pageItems.length === 0 && <p style={{ color: '#888' }}>{t('noarticlesfound')}</p>}
            </div>

            {/* Pagination */}
            {total > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 36 }}>
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{
                        padding: '8px 20px', background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.18)', color: page === 1 ? '#444' : '#fff',
                        borderRadius: 6, cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '0.85rem',
                    }}>
                        ← {t('previous')}
                    </button>
                    {Array.from({ length: total }, (_, i) => (
                        <button key={i + 1} onClick={() => setPage(i + 1)} style={{
                            width: 36, height: 36,
                            background: page === i + 1 ? '#22c55e' : 'rgba(255,255,255,0.06)',
                            color: page === i + 1 ? '#000' : '#ccc',
                            border: `1px solid ${page === i + 1 ? '#22c55e' : 'rgba(255,255,255,0.15)'}`,
                            borderRadius: 6, cursor: 'pointer', fontWeight: page === i + 1 ? 700 : 400, fontSize: '0.85rem',
                        }}>{i + 1}</button>
                    ))}
                    <button disabled={page === total} onClick={() => setPage(p => p + 1)} style={{
                        padding: '8px 20px', background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.18)', color: page === total ? '#444' : '#fff',
                        borderRadius: 6, cursor: page === total ? 'not-allowed' : 'pointer', fontSize: '0.85rem',
                    }}>
                        {t('next')} →
                    </button>
                </div>
            )}

            {/* ── Full Content Modal ─────────────────────────── */}
            {selected && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 900,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                    padding: '40px 20px', overflowY: 'auto',
                }} onClick={() => setSelected(null)}>
                    <div style={{
                        background: 'rgba(10,20,10,0.98)',
                        border: '1px solid rgba(34,197,94,0.25)',
                        borderRadius: 16, maxWidth: 720, width: '100%',
                        boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
                        animation: 'slideUp 0.3s ease',
                    }} onClick={e => e.stopPropagation()}>
                        {imgSrc(selected.imageUrl) && (
                            <img src={imgSrc(selected.imageUrl)} alt={selected.title}
                                style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: '16px 16px 0 0', filter: 'brightness(0.8)' }} />
                        )}
                        <div style={{ padding: '28px 32px' }}>
                            <h2 style={{ marginBottom: 16, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.8rem' }}>
                                {selected.title}
                            </h2>
                            <div style={{ display: 'flex', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
                                {[
                                    { label: t('author'), val: selected.expertName || selected.expertEmail || 'Expert' },
                                    { label: t('category'), val: selected.cropType || '—' },
                                    { label: t('createddate'), val: formatDate(selected.createdAt) },
                                ].map(m => (
                                    <div key={m.label}>
                                        <span style={{ fontSize: '0.72rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>{m.label}</span>
                                        <span style={{ color: '#4ade80', fontSize: '0.88rem', fontWeight: 600 }}>{m.val}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.75, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, whiteSpace: 'pre-wrap' }}>
                                {selected.content}
                            </div>
                            <button onClick={() => setSelected(null)} style={{
                                marginTop: 28, padding: '10px 28px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff', borderRadius: 6, cursor: 'pointer',
                                fontSize: '0.85rem', fontFamily: "'Barlow Condensed', sans-serif",
                                letterSpacing: '0.06em', textTransform: 'uppercase',
                            }}>
                                ← {t('back')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </PageLayout>
    )
}

export default ExploreArticles
