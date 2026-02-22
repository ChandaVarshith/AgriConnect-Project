import React from 'react'
import { Link } from 'react-router-dom'

const LoanCard = ({ loan, showManage }) => {
    return (
        <div className="card" style={{ borderTop: '3px solid var(--primary-light)' }}>
            <h4 style={{ color: 'var(--primary-light)', marginBottom: 8 }}>{loan.title}</h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(82,183,136,0.15)', color: 'var(--accent)', padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem' }}>
                    {loan.type}
                </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                💰 Up to <strong>₹{Number(loan.amount).toLocaleString('en-IN')}</strong>
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                📈 Interest: <strong>{loan.interestRate}% p.a.</strong>
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                📅 Tenure: <strong>{loan.tenure} months</strong>
            </p>
            {loan.eligibility && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
                    Eligibility: {loan.eligibility}
                </p>
            )}
            <div style={{ marginTop: 14 }}>
                {showManage ? (
                    <Link to={`/financier/all-loans`} className="btn btn-outline" style={{ padding: '5px 14px', fontSize: '0.82rem' }}>
                        Manage
                    </Link>
                ) : (
                    <Link to={`/farmer/loan-apply/${loan._id}`} className="btn btn-primary" style={{ padding: '5px 14px', fontSize: '0.82rem' }}>
                        Apply Now
                    </Link>
                )}
            </div>
        </div>
    )
}

export default LoanCard
