import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'
import { useLanguage } from '../../context/LanguageContext'
import './MyResponses.css'

const MyResponsesFarmer = () => {
    const { t } = useLanguage()
    const [queries, setQ] = useState([])
    const [loading, setL] = useState(true)
    const [selected, setSelected] = useState(null)   // query being viewed

    useEffect(() => {
        queryService.getMyQueries().then(r => setQ(r.data)).catch(() => { }).finally(() => setL(false))
    }, [])

    // ── Read-only detail view ───────────────────────────────────────────
    if (selected) {
        const q = selected
        const isResolved = q.status === 'resolved'

        const row = (label, value, valueColor = '#fff') => (
            <div className="my-resp-row">
                <span className="my-resp-row-label">{label}</span>
                <span className="my-resp-row-value" style={{ color: valueColor }}>{value || '—'}</span>
            </div>
        )

        return (
            <PageLayout role="farmer" title="Query Details">
                {/* ── Farmer's Query Card (matches image 3 style) ── */}
                <div className="my-resp-query-card">
                    <h3 className="my-resp-query-title">
                         My Query
                    </h3>
                    {row('Crop Type:', q.cropType)}
                    {row('Request Details:', q.description)}
                    {row('Request Date:', q.createdAt ? new Date(q.createdAt).toLocaleDateString() : '—')}
                    {row('Location:', q.location)}
                    {row('Status:', isResolved ? 'Resolved' : 'Pending', isResolved ? '#4ade80' : '#fbbf24')}
                </div>

                {/* ── Expert's Response / Awaiting ── */}
                {isResolved ? (
                    <div className="my-resp-resolved-card">
                        <h3 className="my-resp-resolved-title">
                            Expert's Response
                        </h3>
                        {row('Expert Email:', q.expertEmail, '#4ade80')}
                        <div className="my-resp-response-box">
                            <span className="my-resp-response-label">Response:</span>
                            <p className="my-resp-response-text">
                                {q.responseText}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="my-resp-pending-card">
                        <span className="my-resp-pending-icon"></span>
                        <div>
                            <h4 className="my-resp-pending-title">
                                Awaiting Expert Response
                            </h4>
                            <p className="my-resp-pending-desc">
                                An expert will review your query and respond shortly.
                            </p>
                        </div>
                    </div>
                )}

                <button onClick={() => setSelected(null)} className="my-resp-back-btn">
                    ← Back
                </button>
            </PageLayout>
        )
    }

    // ── Table view ──────────────────────────────────────────────────────
    return (
        <PageLayout role="farmer" title={t('allresponses')}>
            {loading ? (
                <p className="my-resp-loading">{t('loading')}</p>
            ) : queries.length === 0 ? (
                <div className="my-resp-empty-card">
                    <div className="my-resp-empty-icon">📭</div>
                    <p className="my-resp-empty-text">{t('noqueriesyet')}</p>
                </div>
            ) : (
                <div className="my-resp-table-container">
                    <div className="my-resp-table-wrapper">
                        <table className="my-resp-table">
                            <thead>
                                <tr>
                                    <th className="my-resp-th">{t('croptype')}</th>
                                    <th className="my-resp-th">{t('expertemail')}</th>
                                    <th className="my-resp-th">{t('responsedetails')}</th>
                                    <th className="my-resp-th">{t('status')}</th>
                                    <th className="my-resp-th" style={{ textAlign: 'center' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queries.map(q => (
                                    <tr key={q._id} className="my-resp-tr">
                                        <td className="my-resp-td my-resp-crop">
                                            {q.cropType}
                                            <div className="my-resp-loc">
                                                {q.location || '—'}
                                            </div>
                                        </td>
                                        <td className="my-resp-td">
                                            {q.status === 'resolved'
                                                ? <span className="my-resp-email-resolved">{q.expertEmail || '—'}</span>
                                                : <span className="my-resp-email-pending">{t('pending')}</span>
                                            }
                                        </td>
                                        <td className="my-resp-td my-resp-td-text">
                                            {q.responseText
                                                ? <span className="my-resp-text-resolved">{q.responseText.slice(0, 80)}{q.responseText.length > 80 ? '…' : ''}</span>
                                                : <span className="my-resp-text-pending"> {t('awaitingresponse')}</span>
                                            }
                                        </td>
                                        <td className="my-resp-td">
                                            <span className={`my-resp-status-badge ${q.status === 'resolved' ? 'resolved' : 'pending'}`}>
                                                {t(q.status) || q.status}
                                            </span>
                                        </td>
                                        <td className="my-resp-td my-resp-td-action">
                                            <button
                                                onClick={() => setSelected(q)}
                                                className="my-resp-action-btn"
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
