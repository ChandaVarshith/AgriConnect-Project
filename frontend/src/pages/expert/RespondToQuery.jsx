import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import queryService from '../../services/queryService'
import './RespondToQuery.css'

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
                <div className="resp-query-success-box">
                    <div className="resp-query-success-icon">✅</div>
                    <h2 className="resp-query-success-title">Response Submitted Successfully!</h2>
                    <p className="resp-query-success-text">The farmer will see your advice immediately.</p>
                    <button onClick={() => navigate('/expert/requests')} className="resp-query-btn-primary">← Back to Requests</button>
                </div>
            </PageLayout>
        )
    }

    // Weather panel
    if (showWeather) {
        return (
            <PageLayout role="expert" title="Check Weather">
                <div className="resp-query-weather-container">
                    <div className="resp-query-weather-search-row">
                        <input placeholder="Search city or pincode…" value={weatherSearch}
                            onChange={e => setWeatherSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && fetchWeather()}
                            className="resp-query-weather-input" />
                        <button onClick={fetchWeather} disabled={weatherLoading} className="resp-query-weather-search-btn">
                            {weatherLoading ? '…' : 'Search'}
                        </button>
                    </div>

                    {weatherError && <p className="resp-query-error">{weatherError}</p>}

                    {weather && (
                        <div className="resp-query-weather-card">
                            <h2 className="resp-query-weather-temp">
                                {Math.round(weather.main?.temp)}°C
                            </h2>
                            <p className="resp-query-weather-loc">
                                📍 {weather.name}, {weather.sys?.country}
                            </p>
                            <p className="resp-query-weather-desc">
                                {weather.weather?.[0]?.description}
                            </p>
                            <div className="resp-query-weather-details">
                                <div>
                                    <p className="resp-query-weather-detail-label">Humidity</p>
                                    <p className="resp-query-weather-detail-val">{weather.main?.humidity}%</p>
                                </div>
                                <div>
                                    <p className="resp-query-weather-detail-label">Wind Speed</p>
                                    <p className="resp-query-weather-detail-val">{weather.wind?.speed} m/s</p>
                                </div>
                                <div>
                                    <p className="resp-query-weather-detail-label">Feels Like</p>
                                    <p className="resp-query-weather-detail-val">{Math.round(weather.main?.feels_like)}°C</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button onClick={() => setShowWeather(false)} className="resp-query-btn-secondary">
                        ← Back to Query
                    </button>
                </div>
            </PageLayout>
        )
    }

    return (
        <PageLayout role="expert" title="Respond To Query">
            {!query ? (
                <p className="resp-query-loading">Loading query…</p>
            ) : (
                <div className="resp-query-grid">
                    {/* Query details */}
                    <div className="resp-query-details-card">
                        <h4 className="resp-query-details-title">🌾 Farmer's Query</h4>
                        <p className="resp-query-detail-row">
                            <strong className="resp-query-detail-strong">Name:</strong> {query.farmerId?.name || '—'}
                        </p>
                        <p className="resp-query-detail-row">
                            <strong className="resp-query-detail-strong">Phone:</strong> {query.farmerId?.phone || '—'}
                        </p>
                        <p className="resp-query-detail-row">
                            <strong className="resp-query-detail-strong">Email:</strong> {query.farmerId?.email || '—'}
                        </p>
                        <p className="resp-query-detail-row">
                            <strong className="resp-query-detail-strong">Crop Type:</strong> {query.cropType}
                        </p>
                        <p className="resp-query-detail-row">
                            <strong className="resp-query-detail-strong">Request Details:</strong> {query.description}
                        </p>
                        <p className="resp-query-detail-row">
                            <strong className="resp-query-detail-strong">Request Date:</strong> {new Date(query.createdAt).toLocaleDateString()}
                        </p>
                        <p className="resp-query-detail-row">
                            <strong className="resp-query-detail-strong">Location:</strong> {query.location || '—'}
                        </p>
                        <p className="resp-query-detail-row">
                            <strong className="resp-query-detail-strong">Status:</strong>{' '}
                            <span className="resp-query-status-badge" style={{ color: query.status === 'resolved' ? '#4caf50' : '#f39c12' }}>
                                {query.status}
                            </span>
                        </p>
                    </div>

                    {/* Response form — only shown for PENDING queries */}
                    {query.status === 'resolved' ? (
                        <div className="resp-query-resolved-card">
                            <span className="resp-query-resolved-icon">✅</span>
                            <div>
                                <h4 className="resp-query-resolved-title">
                                    Query Already Resolved
                                </h4>
                                <p className="resp-query-resolved-text">
                                    A response has been submitted for this query. No further action is needed.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/expert/requests')}
                                className="resp-query-btn-back"
                            >
                                ← Back
                            </button>
                        </div>
                    ) : (
                        <div className="resp-query-form-card">
                            <h4 className="resp-query-form-title">📝 Enter Your Response Here</h4>
                            <form onSubmit={handleSubmit}>
                                <textarea rows={6} placeholder="Enter your response here…" value={response}
                                    onChange={e => setResponse(e.target.value)} required
                                    className="resp-query-textarea" />
                                {error && <p className="resp-query-form-error">{error}</p>}
                                <div className="resp-query-actions-row">
                                    <button type="submit" disabled={loading} className="resp-query-btn-submit">
                                        {loading ? 'Submitting…' : '📤 Submit Response'}
                                    </button>
                                    <button type="button" onClick={() => { setWeatherSearch(query.location || ''); setShowWeather(true) }} className="resp-query-btn-weather">
                                        🌤 Check Weather
                                    </button>
                                    <button type="button" onClick={() => navigate(-1)} className="resp-query-btn-cancel">
                                        Cancel
                                    </button>
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
