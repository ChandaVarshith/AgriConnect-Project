import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'

const ExpertMyResponses = () => {
    const [responses, setResponses] = useState([])
    const [loading, setL] = useState(true)

    useEffect(() => {
        queryService.getExpertResponses().then(r => setResponses(r.data)).catch(() => { }).finally(() => setL(false))
    }, [])

    return (
        <PageLayout role="expert" title="My Responses">
            {loading ? (
                <p style={{ color: '#aaa' }}>Loading…</p>
            ) : (
                <div style={{ display: 'grid', gap: 14, maxWidth: 860 }}>
                    {responses.length === 0 && <p style={{ color: '#888' }}>No responses yet.</p>}
                    {responses.map(r => (
                        <div key={r._id} style={{
                            background: 'rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderLeft: '4px solid #4caf50',
                            borderRadius: 10, padding: '18px 22px',
                        }}>
                            <h4 style={{ color: '#fff', marginBottom: 8 }}>
                                My Response: {r.responseText?.substring(0, 60)}{r.responseText?.length > 60 ? '…' : ''}
                            </h4>
                            <p style={{ fontSize: '0.83rem', color: '#bbb', marginBottom: 4 }}>
                                Date: {new Date(r.createdAt).toLocaleString()}
                            </p>
                            <p style={{ fontSize: '0.83rem', color: '#bbb', marginBottom: 4 }}>
                                Status: <span style={{ color: '#4caf50', fontWeight: 600 }}>Resolved</span>
                            </p>
                            <p style={{ fontSize: '0.83rem', color: '#bbb' }}>
                                Farmer Contact: {r.queryId?.farmerId?.phone || r.queryId?.farmerId?.email || '—'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </PageLayout>
    )
}

export default ExpertMyResponses
