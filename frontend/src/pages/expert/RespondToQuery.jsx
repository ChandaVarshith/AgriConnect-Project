import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'

const RespondToQuery = () => {
    const { queryId } = useParams()
    const navigate = useNavigate()
    const [query, setQuery] = useState(null)
    const [response, setResponse] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Weather state
    const [showWeather, setShowWeather] = useState(false)
    const [weatherSearch, setWeatherSearch] = useState('')
    const [weather, setWeather] = useState(null)
    const [weatherLoading, setWeatherLoading] = useState(false)
    const [weatherError, setWeatherError] = useState('')

    useEffect(() => {
        queryService.getQueryById(queryId)
            .then(res => setQuery(res.data))
            .catch(() => setError('Failed to load query.'))
    }, [queryId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await queryService.submitResponse(queryId, { responseText: response })
            setSuccess(true)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit response.')
        } finally {
            setLoading(false)
        }
    }

    const fetchWeather = async () => {
        if (!weatherSearch.trim()) return
        setWeatherLoading(true)
        setWeatherError('')
        try {
            const apiKey = import.meta.env.VITE_WEATHER_API_KEY || '4d8fb5b93d4af21d66a2948710284366'
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(weatherSearch)}&units=metric&appid=${apiKey}`
            )
            const data = await res.json()
            if (data.cod !== 200) throw new Error(data.message)
            setWeather(data)
        } catch (err) {
            setWeatherError(err.message || 'Failed to fetch weather.')
            setWeather(null)
        } finally {
            setWeatherLoading(false)
        }
    }

    if (success) {
        return (
            <PageLayout role="expert" title="Response Submitted">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 300, justifyContent: 'center' }}>
                    <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
                    <h2 style={{ color: '#4caf50', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem' }}>Response Submitted Successfully!</h2>
                    <p style={{ color: '#aaa', marginTop: 8, marginBottom: 20 }}>The farmer will see your advice immediately.</p>
                    <button onClick={() => navigate('/expert/requests')} style={{
                        padding: '10px 28px', background: '#3b82f6', color: '#fff', border: 'none',
                        borderRadius: 6, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    }}>← Back to Requests</button>
                </div>
            </PageLayout>
        )
    }

    // Weather panel
    if (showWeather) {
        return (
            <PageLayout role="expert" title="Check Weather">
                <div style={{ maxWidth: 600 }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                        <input placeholder="Search city or pincode…" value={weatherSearch}
                            onChange={e => setWeatherSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && fetchWeather()}
                            style={{
                                flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                                color: '#fff', fontSize: '0.9rem', outline: 'none',
                            }} />
                        <button onClick={fetchWeather} disabled={weatherLoading} style={{
                            padding: '10px 22px', background: '#3b82f6', color: '#fff', border: 'none',
                            borderRadius: 6, fontWeight: 700, cursor: 'pointer',
                        }}>{weatherLoading ? '…' : 'Search'}</button>
                    </div>

                    {weatherError && <p style={{ color: '#ef4444', marginBottom: 12 }}>{weatherError}</p>}

                    {weather && (
                        <div style={{
                            background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '28px 32px',
                            textAlign: 'center', border: '1px solid rgba(255,255,255,0.12)',
                        }}>
                            <h2 style={{ color: '#fff', fontSize: '2.8rem', margin: '0 0 8px' }}>
                                {Math.round(weather.main?.temp)}°C
                            </h2>
                            <p style={{ color: '#3b82f6', fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>
                                📍 {weather.name}, {weather.sys?.country}
                            </p>
                            <p style={{ color: '#aaa', fontSize: '0.9rem', textTransform: 'capitalize', marginBottom: 16 }}>
                                {weather.weather?.[0]?.description}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
                                <div>
                                    <p style={{ color: '#888', fontSize: '0.78rem' }}>Humidity</p>
                                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>{weather.main?.humidity}%</p>
                                </div>
                                <div>
                                    <p style={{ color: '#888', fontSize: '0.78rem' }}>Wind Speed</p>
                                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>{weather.wind?.speed} m/s</p>
                                </div>
                                <div>
                                    <p style={{ color: '#888', fontSize: '0.78rem' }}>Feels Like</p>
                                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>{Math.round(weather.main?.feels_like)}°C</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button onClick={() => setShowWeather(false)} style={{
                        marginTop: 24, padding: '10px 28px', background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                        borderRadius: 6, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                    }}>← Back to Query</button>
                </div>
            </PageLayout>
        )
    }

    return (
        <PageLayout role="expert" title="Respond To Query">
            {!query ? (
                <p style={{ color: '#aaa' }}>Loading query…</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, maxWidth: 760 }}>
                    {/* Query details */}
                    <div style={{
                        background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.12)', borderLeft: '4px solid #f39c12',
                        borderRadius: 10, padding: '20px 24px',
                    }}>
                        <h4 style={{ color: '#fff', marginBottom: 12 }}>🌾 Farmer's Query</h4>
                        <p style={{ fontSize: '0.88rem', color: '#bbb', marginBottom: 6 }}>
                            <strong style={{ color: '#fff' }}>Name:</strong> {query.farmerId?.name || '—'}
                        </p>
                        <p style={{ fontSize: '0.88rem', color: '#bbb', marginBottom: 6 }}>
                            <strong style={{ color: '#fff' }}>Phone:</strong> {query.farmerId?.phone || '—'}
                        </p>
                        <p style={{ fontSize: '0.88rem', color: '#bbb', marginBottom: 6 }}>
                            <strong style={{ color: '#fff' }}>Email:</strong> {query.farmerId?.email || '—'}
                        </p>
                        <p style={{ fontSize: '0.88rem', color: '#bbb', marginBottom: 6 }}>
                            <strong style={{ color: '#fff' }}>Crop Type:</strong> {query.cropType}
                        </p>
                        <p style={{ fontSize: '0.88rem', color: '#bbb', marginBottom: 6 }}>
                            <strong style={{ color: '#fff' }}>Request Details:</strong> {query.description}
                        </p>
                        <p style={{ fontSize: '0.88rem', color: '#bbb', marginBottom: 6 }}>
                            <strong style={{ color: '#fff' }}>Request Date:</strong> {new Date(query.createdAt).toLocaleDateString()}
                        </p>
                        <p style={{ fontSize: '0.88rem', color: '#bbb', marginBottom: 6 }}>
                            <strong style={{ color: '#fff' }}>Location:</strong> {query.location || '—'}
                        </p>
                        <p style={{ fontSize: '0.88rem', color: '#bbb' }}>
                            <strong style={{ color: '#fff' }}>Status:</strong>{' '}
                            <span style={{ color: query.status === 'resolved' ? '#4caf50' : '#f39c12', fontWeight: 700, textTransform: 'capitalize' }}>
                                {query.status}
                            </span>
                        </p>
                    </div>

                    {/* Response form — only shown for PENDING queries */}
                    {query.status === 'resolved' ? (
                        <div style={{
                            background: 'rgba(34,197,94,0.08)',
                            border: '1px solid rgba(34,197,94,0.3)',
                            borderLeft: '4px solid #22c55e',
                            borderRadius: 10, padding: '20px 24px',
                            display: 'flex', alignItems: 'center', gap: 16,
                        }}>
                            <span style={{ fontSize: '2rem' }}>✅</span>
                            <div>
                                <h4 style={{ color: '#4ade80', margin: '0 0 6px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.1rem' }}>
                                    Query Already Resolved
                                </h4>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                                    A response has been submitted for this query. No further action is needed.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/expert/requests')}
                                style={{
                                    marginLeft: 'auto', padding: '8px 20px',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff', borderRadius: 6,
                                    fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                ← Back
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 10, padding: '20px 24px',
                        }}>
                            <h4 style={{ color: '#fff', marginBottom: 16 }}>📝 Enter Your Response Here</h4>
                            <form onSubmit={handleSubmit}>
                                <textarea rows={6} placeholder="Enter your response here…" value={response}
                                    onChange={e => setResponse(e.target.value)} required
                                    style={{
                                        width: '100%', padding: '12px 14px',
                                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                                        borderRadius: 4, color: '#fff', fontSize: '0.9rem',
                                        outline: 'none', resize: 'vertical', marginBottom: 16,
                                        boxSizing: 'border-box',
                                    }} />
                                {error && <p style={{ color: '#e02020', fontSize: '0.85rem', marginBottom: 10 }}>{error}</p>}
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                    <button type="submit" disabled={loading} style={{
                                        padding: '10px 24px', background: '#4caf50', color: '#fff',
                                        border: 'none', borderRadius: 4, fontWeight: 700, fontSize: '0.9rem',
                                        cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase',
                                    }}>
                                        {loading ? 'Submitting…' : '📤 Submit Response'}
                                    </button>
                                    <button type="button" onClick={() => { setWeatherSearch(query.location || ''); setShowWeather(true) }} style={{
                                        padding: '10px 24px', background: '#3b82f6', color: '#fff',
                                        border: 'none', borderRadius: 4, fontWeight: 700, fontSize: '0.9rem',
                                        cursor: 'pointer', textTransform: 'uppercase',
                                    }}>🌤 Check Weather</button>
                                    <button type="button" onClick={() => navigate(-1)} style={{
                                        padding: '10px 24px', background: 'transparent', color: '#aaa',
                                        border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4,
                                        fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                                    }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </PageLayout>
    )
}

export default RespondToQuery
