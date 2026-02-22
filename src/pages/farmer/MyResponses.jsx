import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'
import { useLanguage } from '../../context/LanguageContext'

const MyResponsesFarmer = () => {
    const { t } = useLanguage()
    const [queries, setQ] = useState([])
    const [loading, setL] = useState(true)

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
                    maxWidth: 960,
                }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>{t('croptype')}</th>
                                    <th style={thStyle}>{t('expertemail')}</th>
                                    <th style={thStyle}>{t('responsedetails')}</th>
                                    <th style={thStyle}>{t('status')}</th>
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
                                                ? <span style={{ color: '#4ade80', fontSize: '0.82rem' }}>{q.expertEmail || q.respondedBy || '—'}</span>
                                                : <span style={{ color: '#555', fontStyle: 'italic', fontSize: '0.82rem' }}>{t('pending')}</span>
                                            }
                                        </td>
                                        <td style={{ ...tdStyle, maxWidth: 340 }}>
                                            {q.response
                                                ? <span style={{ color: '#ccc' }}>{q.response}</span>
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
