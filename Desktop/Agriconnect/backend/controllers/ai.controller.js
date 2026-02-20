const axios = require('axios')

exports.processVoiceQuery = async (req, res) => {
    try {
        // Frontend sends transcribed text from Web Speech API
        const { text, cropType, location } = req.body
        res.json({ transcribedText: text, cropType, location, message: 'Voice query received.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.geminiAssist = async (req, res) => {
    try {
        const { prompt } = req.body
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`
        const response = await axios.post(GEMINI_URL, {
            contents: [{ parts: [{ text: prompt }] }]
        })
        const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.'
        res.json({ response: text })
    } catch (err) {
        res.status(500).json({ message: err.message || 'Gemini API error.' })
    }
}
