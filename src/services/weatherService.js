const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

export const weatherService = {
    /**
     * Fetches current weather data using OpenWeatherMap API
     * @param {number} lat - latitude
     * @param {number} lon - longitude
     */
    getWeather: async (lat, lon) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch weather data')
        return res.json()
    },

    /**
     * Fetches 5-day forecast
     */
    getForecast: async (lat, lon) => {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch forecast data')
        return res.json()
    },
}

export default weatherService
