import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import loanService from '../../services/loanService'

const LoanRequests = () => {
    const [apps, setApps] = useState([])
    const [loading, setL] = useState(true)

    const load = () => {
        loanService.getLoanApplications().then(r => setApps(r.data)).finally(() => setL(false))
    }
    useEffect(() => { load() }, [])

    const updateStatus = async (id, status) => {
        await loanService.updateApplicationStatus(id, status)
        load()
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
            <Navbar role="financier" />
            <div className="content-page">
                <div className="section-title">All Loan Requests</div>
                {loading ? <p className="text-muted">Loading…</p> : (
                    <div style={{ display: 'grid', gap: 14 }}>
                        {apps.map(app => (
                            <div key={app._id} className="info-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                    <div>
                                        <h4>{app.farmerName || 'Farmer'}</h4>
                                        <p style={{ fontSize: '0.82rem', color: '#bbb', marginTop: 4 }}>Loan: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{app.loanType}</strong></p>
                                        <p style={{ fontSize: '0.82rem', color: '#bbb' }}>Amount Requested: <strong style={{ color: '#fff' }}>₹{app.amountRequested?.toLocaleString()}</strong></p>
                                        <p style={{ fontSize: '0.75rem', color: '#555', marginTop: 6 }}>📅 {new Date(app.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <span className={`badge ${app.status === 'approved' ? 'badge-success' : app.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>{app.status}</span>
                                        {app.status === 'pending' && (
                                            <>
                                                <button className="btn btn-green" style={{ fontSize: '0.75rem', padding: '5px 14px' }} onClick={() => updateStatus(app._id, 'approved')}>Approve</button>
                                                <button className="btn btn-danger" style={{ fontSize: '0.75rem', padding: '5px 14px' }} onClick={() => updateStatus(app._id, 'rejected')}>Reject</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {apps.length === 0 && <p className="text-muted">No loan applications yet.</p>}
                    </div>
                )}
            </div>
        </div>
    )
}

export default LoanRequests
