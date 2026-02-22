import React from 'react'
import { Link } from 'react-router-dom'

const QueryCard = ({ query, role }) => {
    return (
        <div className="card" style={{ borderLeft: `4px solid ${query.status === 'resolved' ? '#27ae60' : '#f39c12'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                    <h4 style={{ marginBottom: 4 }}>{query.cropType}</h4>
                    <p style={{ fontSize: '0.82rem' }}>{query.description?.slice(0, 100)}…</p>
                    {query.location && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>📍 {query.location}</p>}
                </div>
                <span className={`badge badge-${query.status === 'resolved' ? 'success' : 'warning'}`}>{query.status}</span>
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(query.createdAt).toLocaleDateString()}</span>
                {role === 'expert' && (
                    <Link to={`/expert/respond/${query._id}`} className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
                        Respond
                    </Link>
                )}
            </div>
        </div>
    )
}

export default QueryCard
