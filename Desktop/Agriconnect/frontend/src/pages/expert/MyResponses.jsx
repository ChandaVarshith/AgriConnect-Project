import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import queryService from '../../services/queryService'

const BG = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1400&auto=format&fit=crop&q=80'

const MyResponses = () => {
    const [responses, setResponses] = useState([])
    const [loading, setL] = useState(true)

    useEffect(() => {
        queryService.getExpertResponses().then(r => setResponses(r.data)).finally(() => setL(false))
    }, [])

    return (
        <div style={{ minHeight: '100vh', background: '#000', position: 'relative' }}>
            <img src={BG} alt="greenhouse"
                style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.32)', zIndex: 0 }} />
            <Navbar role="expert" />

            <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', padding: '90px 20px 60px' }}>
                <div style={{ maxWidth: 860, margin: '0 auto' }}>
                    {loading ? (
                        <p style={{ color: '#aaa', textAlign: 'center' }}>Loading…</p>
                    ) : responses.length === 0 ? (
                        <p style={{ color: '#aaa', textAlign: 'center' }}>No responses yet.</p>
                    ) : (
                        responses.map(r => (
                            <div key={r._id} style={{
                                background: 'rgba(255,255,255,0.93)', borderRadius: 8,
                                padding: '22px 28px', marginBottom: 16,
                                borderLeft: '4px solid #4caf50',
                                color: '#1a1a1a',
                            }}>
                                <h4 style={{
                                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                                    fontSize: '1.1rem', marginBottom: 8, color: '#111',
                                }}>
                                    My Response: {r.responseText?.substring(0, 60)}{r.responseText?.length > 60 ? '…' : ''}
                                </h4>
                                <p style={{ fontSize: '0.83rem', color: '#555', marginBottom: 4 }}>
                                    Date: {new Date(r.createdAt).toLocaleString()}
                                </p>
                                <p style={{ fontSize: '0.83rem', color: '#555', marginBottom: 4 }}>
                                    Status: <span style={{ color: '#4caf50', fontWeight: 600 }}>Resolved</span>
                                </p>
                                <p style={{ fontSize: '0.83rem', color: '#555' }}>
                                    Farmer Contact: {r.queryId?.farmerId?.phone || r.queryId?.farmerId?.email || '—'}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyResponses
