const axios = require('axios')

exports.getWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query
        if (!lat || !lon) return res.status(400).json({ message: 'lat and lon are required.' })
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        const response = await axios.get(url)
        res.json(response.data)
    } catch (err) {
        res.status(500).json({ message: 'Could not fetch weather data.' })
    }
}
