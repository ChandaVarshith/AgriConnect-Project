import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import loanService from '../../services/loanService'

const LoanRequests = () => {
    const [apps, setApps] = useState([])
    const [loading, setL] = useState(true)

    const load = () => {
        loanService.getApplications().then(r => setApps(r.data)).catch(() => { }).finally(() => setL(false))
    }
    useEffect(() => { load() }, [])

    const updateStatus = async (id, status) => {
        await loanService.updateApplicationStatus(id, status)
        load()
    }

    return (
        <PageLayout role="financier" title="All Loan Requests">
            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : (
                <div style={{ display: 'grid', gap: 14, maxWidth: 860 }}>
                    {apps.length === 0 && <p style={{ color: '#888' }}>No loan applications yet.</p>}
                    {apps.map(app => (
                        <div key={app._id} style={{
                            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderLeft: `4px solid ${app.status === 'approved' ? '#4caf50' : app.status === 'rejected' ? '#e02020' : '#f39c12'}`,
                            borderRadius: 10, padding: '18px 22px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                <div>
                                    <h4 style={{ color: '#fff', marginBottom: 4 }}>{app.farmerName || 'Farmer'}</h4>
                                    <p style={{ fontSize: '0.82rem', color: '#bbb' }}>
                                        Loan: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{app.loanType}</strong>
                                    </p>
                                    <p style={{ fontSize: '0.82rem', color: '#bbb' }}>
                                        Amount: <strong style={{ color: '#fff' }}>₹{app.amountRequested?.toLocaleString()}</strong>
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#555', marginTop: 6 }}>
                                        📅 {new Date(app.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700,
                                        background: app.status === 'approved' ? '#4caf50' : app.status === 'rejected' ? '#e02020' : '#f39c12',
                                        color: '#000'
                                    }}>{app.status}</span>
                                    {app.status === 'pending' && (
                                        <>
                                            <button onClick={() => updateStatus(app._id, 'approved')} style={{
                                                padding: '5px 14px', background: '#4caf50', color: '#000',
                                                fontWeight: 700, fontSize: '0.78rem', border: 'none',
                                                borderRadius: 5, cursor: 'pointer',
                                            }}>Approve</button>
                                            <button onClick={() => updateStatus(app._id, 'rejected')} style={{
                                                padding: '5px 14px', background: '#e02020', color: '#fff',
                                                fontWeight: 700, fontSize: '0.78rem', border: 'none',
                                                borderRadius: 5, cursor: 'pointer',
                                            }}>Reject</button>
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
