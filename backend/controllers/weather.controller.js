const axios = require('axios')

exports.getWeather = async (req, res) => {
    try {
        const { lat, lon, city } = req.query
        const apiKey = process.env.WEATHER_API_KEY || '4d8fb5b93d4af21d66a2948710284366'
        let url
        if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        } else if (city) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        } else {
            return res.status(400).json({ message: 'Provide lat/lon or city parameter.' })
        }
        const response = await axios.get(url)
        res.json(response.data)
    } catch (err) {
        const msg = err.response?.data?.message || 'Could not fetch weather data.'
        res.status(err.response?.status || 500).json({ message: msg })
    }
}
