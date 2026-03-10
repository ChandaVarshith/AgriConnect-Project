import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'
import './MyResponses.css'

const ExpertMyResponses = () => {
    const [responses, setResponses] = useState([])
    const [loading, setL] = useState(true)

    useEffect(() => {
        queryService.getExpertResponses().then(r => setResponses(r.data)).catch(() => { }).finally(() => setL(false))
    }, [])

    return (
        <PageLayout role="expert" title="My Responses">
            {loading ? (
                <p className="expert-my-resp-loading">Loading…</p>
            ) : (
                <div className="expert-my-resp-grid">
                    {responses.length === 0 && <p className="expert-my-resp-empty">No responses yet.</p>}
                    {responses.map(r => (
                        <div key={r._id} className="expert-my-resp-card">
                            {/* Heading: show query topic, not the response text */}
                            <h4 className="expert-my-resp-title">
                                🌾 Query: {r.queryId?.cropType || 'Farming Query'}
                                {r.queryId?.location && (
                                    <span className="expert-my-resp-location">
                                        📍 {r.queryId.location}
                                    </span>
                                )}
                            </h4>

                            {/* Farmer's original description */}
                            {r.queryId?.description && (
                                <div className="expert-my-resp-farmer-box">
                                    <span className="expert-my-resp-farmer-label">Farmer's Question: </span>
                                    <span className="expert-my-resp-farmer-text">{r.queryId.description}</span>
                                </div>
                            )}

                            {/* Expert's response */}
                            <div className="expert-my-resp-expert-box">
                                <span className="expert-my-resp-expert-label">Your Response: </span>
                                <p className="expert-my-resp-expert-text">{r.responseText}</p>
                            </div>

                            <div className="expert-my-resp-meta-row">
                                <p className="expert-my-resp-meta">
                                    🗓 {new Date(r.createdAt).toLocaleString()}
                                </p>
                                <p className="expert-my-resp-meta-status">
                                    Status: <span className="expert-my-resp-meta-resolved">Resolved</span>
                                </p>
                                <p className="expert-my-resp-meta">
                                    Farmer: {r.queryId?.farmerId?.phone || r.queryId?.farmerId?.email || '—'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageLayout>
    )
}

export default ExpertMyResponses
