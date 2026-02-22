import React, { useEffect, useState } from 'react'
import weatherService from '../services/weatherService'

const WeatherWidget = ({ location }) => {
    const [weather, setWeather] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    try {
                        const data = await weatherService.getWeather(pos.coords.latitude, pos.coords.longitude)
                        setWeather(data)
                    } catch {
                        setError('Could not load weather.')
                    }
                },
                () => setError('Location access denied.')
            )
        } else {
            setError('Geolocation not supported.')
        }
    }, [])

    if (error) return (
        <div className="card" style={{ textAlign: 'center' }}>
            <p>🌤️ {error}</p>
        </div>
    )
    if (!weather) return <div className="card"><p>Loading weather…</p></div>

    const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    const temp = Math.round(weather.main.temp)
    const desc = weather.weather[0].description
    const city = weather.name

    return (
        <div className="card" style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'var(--primary-light)', marginBottom: 8 }}>🌤️ Weather</h4>
            <img src={icon} alt={desc} style={{ width: 64, height: 64 }} />
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--white)' }}>{temp}°C</p>
            <p style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{desc}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--accent)', marginTop: 4 }}>📍 {city}</p>
            <div style={{ marginTop: 12, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>💧 {weather.main.humidity}% Humidity</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🌬️ {weather.wind.speed} m/s Wind</span>
            </div>
        </div>
    )
}

export default WeatherWidget
