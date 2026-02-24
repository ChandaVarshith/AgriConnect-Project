import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'
import { useLanguage } from '../../context/LanguageContext'

const MyResponsesFarmer = () => {
    const { t } = useLanguage()
    const [queries, setQ] = useState([])
    const [loading, setL] = useState(true)
    const [selected, setSelected] = useState(null)   // query being viewed

    useEffect(() => {
        queryService.getMyQueries().then(r => setQ(r.data)).catch(() => { }).finally(() => setL(false))
    }, [])

    const thStyle = {
        padding: '12px 18px',
        background: 'rgba(220,38,38,0.85)',
        color: '#fff',
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 700, fontSize: '0.85rem',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        textAlign: 'left', whiteSpace: 'nowrap',
    }
    const tdStyle = {
        padding: '14px 18px',
        color: '#ccc',
        fontSize: '0.875rem',
        lineHeight: 1.5,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        verticalAlign: 'top',
    }

    // ── Read-only detail view ───────────────────────────────────────────
    if (selected) {
        const q = selected
        const isResolved = q.status === 'resolved'

        const row = (label, value, valueColor = '#fff') => (
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ color: '#fff', fontWeight: 700, minWidth: 140, fontSize: '0.9rem' }}>{label}</span>
                <span style={{ color: valueColor, fontSize: '0.9rem' }}>{value || '—'}</span>
            </div>
        )

        return (
            <PageLayout role="farmer" title="Query Details">
                {/* ── Farmer's Query Card (matches image 3 style) ── */}
                <div style={{
                    background: 'rgba(18,24,16,0.92)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderLeft: '4px solid #fbbf24',
                    borderRadius: 12, padding: '28px 32px',
                    maxWidth: 740, marginBottom: 20,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                }}>
                    <h3 style={{
                        color: '#fff', marginBottom: 20,
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: '1.1rem', letterSpacing: '0.08em',
                        textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                        🌾 My Query
                    </h3>
                    {row('Crop Type:', q.cropType)}
                    {row('Request Details:', q.description)}
                    {row('Request Date:', q.createdAt ? new Date(q.createdAt).toLocaleDateString() : '—')}
                    {row('Location:', q.location)}
                    {row('Status:', isResolved ? 'Resolved' : 'Pending', isResolved ? '#4ade80' : '#fbbf24')}
                </div>

                {/* ── Expert's Response / Awaiting ── */}
                {isResolved ? (
                    <div style={{
                        background: 'rgba(34,197,94,0.08)',
                        border: '1px solid rgba(34,197,94,0.3)',
                        borderLeft: '4px solid #22c55e',
                        borderRadius: 12, padding: '24px 32px',
                        maxWidth: 740, marginBottom: 20,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                    }}>
                        <h3 style={{
                            color: '#4ade80', marginBottom: 16,
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: '1.05rem', letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                        }}>
                            ✅ Expert's Response
                        </h3>
                        {row('Expert Email:', q.expertEmail, '#4ade80')}
                        <div style={{ marginTop: 12 }}>
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Response:</span>
                            <p style={{
                                color: '#d1fae5', fontSize: '0.9rem', lineHeight: 1.75,
                                marginTop: 8, whiteSpace: 'pre-wrap',
                                background: 'rgba(0,0,0,0.2)', borderRadius: 8,
                                padding: '12px 16px',
                            }}>
                                {q.responseText}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        background: 'rgba(251,191,36,0.08)',
                        border: '1px solid rgba(251,191,36,0.3)',
                        borderLeft: '4px solid #fbbf24',
                        borderRadius: 12, padding: '20px 28px', maxWidth: 740,
                        display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20,
                    }}>
                        <span style={{ fontSize: '2rem' }}>⏳</span>
                        <div>
                            <h4 style={{ color: '#fbbf24', margin: '0 0 4px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem' }}>
                                Awaiting Expert Response
                            </h4>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                                An expert will review your query and respond shortly.
                            </p>
                        </div>
                    </div>
                )}

                <button onClick={() => setSelected(null)} style={{
                    padding: '10px 28px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff', borderRadius: 6,
                    fontWeight: 700, fontSize: '0.88rem',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    cursor: 'pointer',
                }}>← Back</button>
            </PageLayout>
        )
    }

    // ── Table view ──────────────────────────────────────────────────────
    return (
        <PageLayout role="farmer" title={t('allresponses')}>
            {loading ? (
                <p style={{ color: '#aaa', padding: 24 }}>{t('loading')}</p>
            ) : queries.length === 0 ? (
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, padding: '48px 24px',
                    textAlign: 'center', maxWidth: 480,
                }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>📭</div>
                    <p style={{ color: '#888', fontSize: '0.95rem' }}>{t('noqueriesyet')}</p>
                </div>
            ) : (
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 14, overflow: 'hidden',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                    maxWidth: 1040,
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>{t('croptype')}</th>
                                    <th style={thStyle}>{t('expertemail')}</th>
                                    <th style={thStyle}>{t('responsedetails')}</th>
                                    <th style={thStyle}>{t('status')}</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queries.map(q => (
                                    <tr key={q._id} style={{ transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ ...tdStyle, color: '#fff', fontWeight: 600 }}>
                                            {q.cropType}
                                            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: 3 }}>
                                                {q.location || '—'}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            {q.status === 'resolved'
                                                ? <span style={{ color: '#4ade80', fontSize: '0.82rem' }}>{q.expertEmail || '—'}</span>
                                                : <span style={{ color: '#555', fontStyle: 'italic', fontSize: '0.82rem' }}>{t('pending')}</span>
                                            }
                                        </td>
                                        <td style={{ ...tdStyle, maxWidth: 260 }}>
                                            {q.responseText
                                                ? <span style={{ color: '#ccc', whiteSpace: 'pre-wrap' }}>{q.responseText.slice(0, 80)}{q.responseText.length > 80 ? '…' : ''}</span>
                                                : <span style={{ color: '#555', fontStyle: 'italic', fontSize: '0.82rem' }}>⏳ {t('awaitingresponse')}</span>
                                            }
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                borderRadius: 50,
                                                fontSize: '0.72rem',
                                                fontWeight: 700,
                                                letterSpacing: '0.06em',
                                                textTransform: 'uppercase',
                                                background: q.status === 'resolved'
                                                    ? 'rgba(74,222,128,0.15)'
                                                    : 'rgba(251,191,36,0.15)',
                                                color: q.status === 'resolved' ? '#4ade80' : '#fbbf24',
                                                border: `1px solid ${q.status === 'resolved' ? '#4ade80' : '#fbbf24'}`,
                                            }}>
                                                {t(q.status) || q.status}
                                            </span>
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                                            <button
                                                onClick={() => setSelected(q)}
                                                style={{
                                                    padding: '5px 16px',
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: '1px solid rgba(255,255,255,0.25)',
                                                    color: '#fff', borderRadius: 5,
                                                    fontWeight: 700, fontSize: '0.78rem',
                                                    cursor: 'pointer',
                                                    fontFamily: "'Barlow Condensed', sans-serif",
                                                    letterSpacing: '0.05em',
                                                    textTransform: 'uppercase',
                                                    transition: 'background 0.15s',
                                                }}
                                                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
                                                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                            >
                                                VIEW
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </PageLayout>
    )
}

export default MyResponsesFarmer
