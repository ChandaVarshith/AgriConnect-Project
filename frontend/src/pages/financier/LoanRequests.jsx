import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'

const LoanRequests = () => {
    const [apps, setApps] = useState([])
    const [loading, setL] = useState(true)

    const load = () => {
        setL(true)
        API.get('/loans/applications').then(r => setApps(r.data)).catch(() => { }).finally(() => setL(false))
    }
    useEffect(() => { load() }, [])

    const updateStatus = async (id, status) => {
        try {
            await API.patch(`/loans/applications/${id}`, { status })
            load()
        } catch { }
    }

    const statusColor = (s) => s === 'approved' ? '#22c55e' : s === 'rejected' ? '#ef4444' : '#f59e0b'

    return (
        <PageLayout role="financier" title="Loan Requests">
            <p style={{ color: '#aaa', fontSize: '0.88rem', marginBottom: 24 }}>
                Review all loan applications submitted by farmers. Accept or reject pending applications.
            </p>

            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : (
                <div style={{ display: 'grid', gap: 14, maxWidth: 900 }}>
                    {apps.length === 0 && <p style={{ color: '#888' }}>No loan applications yet.</p>}
                    {apps.map(app => (
                        <div key={app._id} style={{
                            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderLeft: `4px solid ${statusColor(app.status)}`,
                            borderRadius: 10, padding: '18px 22px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                <div>
                                    <h4 style={{ color: '#fff', marginBottom: 6, fontSize: '1rem' }}>
                                        {app.farmerId?.name || 'Farmer'}
                                        <span style={{ color: '#aaa', fontWeight: 400, fontSize: '0.82rem' }}> · {app.farmerId?.phone}</span>
                                    </h4>
                                    <p style={{ fontSize: '0.82rem', color: '#bbb', margin: '0 0 2px' }}>
                                        Loan: <strong style={{ color: '#fff' }}>{app.loanId?.title || app.loanId?.type}</strong>
                                        {app.loanId?.amount && <span> · ₹{app.loanId.amount.toLocaleString()}</span>}
                                        {app.loanId?.interestRate && <span> · {app.loanId.interestRate}% p.a.</span>}
                                    </p>
                                    {app.purpose && <p style={{ fontSize: '0.8rem', color: '#999', margin: '2px 0' }}>Purpose: {app.purpose}</p>}
                                    {app.income && <p style={{ fontSize: '0.8rem', color: '#999', margin: '2px 0' }}>Annual Income: ₹{Number(app.income).toLocaleString()}</p>}
                                    {app.documents?.length > 0 && (
                                        <p style={{ fontSize: '0.78rem', color: '#3b82f6', margin: '4px 0' }}>
                                            📎 {app.documents.length} document{app.documents.length > 1 ? 's' : ''} attached
                                        </p>
                                    )}
                                    <p style={{ fontSize: '0.75rem', color: '#555', marginTop: 6 }}>
                                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700,
                                        background: `${statusColor(app.status)}20`, color: statusColor(app.status),
                                    }}>{app.status}</span>
                                    {app.status === 'pending' && (
                                        <>
                                            <button onClick={() => updateStatus(app._id, 'approved')} style={{
                                                padding: '6px 16px', background: '#22c55e', color: '#000',
                                                fontWeight: 700, fontSize: '0.78rem', border: 'none',
                                                borderRadius: 5, cursor: 'pointer',
                                            }}>✓ Accept</button>
                                            <button onClick={() => updateStatus(app._id, 'rejected')} style={{
                                                padding: '6px 16px', background: '#ef4444', color: '#fff',
                                                fontWeight: 700, fontSize: '0.78rem', border: 'none',
                                                borderRadius: 5, cursor: 'pointer',
                                            }}>✕ Reject</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageLayout>
    )
}

export default LoanRequests
