const axios = require('axios')

exports.processVoiceQuery = async (req, res) => {
    try {
        const { text, cropType, location } = req.body
        res.json({ transcribedText: text, cropType, location, message: 'Voice query received.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.geminiAssist = async (req, res) => {
    try {
        const { prompt } = req.body
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return res.status(400).json({ message: 'GEMINI_API_KEY not configured on server.' })
        }
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`
        const response = await axios.post(GEMINI_URL, {
            contents: [{ parts: [{ text: prompt }] }]
        })
        const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.'
        res.json({ response: text })
    } catch (err) {
        const status = err.response?.status || 500
        const msg = err.response?.data?.error?.message || err.message || 'Gemini API error.'
        res.status(status).json({ message: msg })
    }
}
