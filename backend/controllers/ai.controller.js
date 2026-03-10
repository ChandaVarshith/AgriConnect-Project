const axios = require('axios')

exports.processVoiceQuery = async (req, res) => {
    try {
        const { text, cropType, location } = req.body
        res.json({ transcribedText: text, cropType, location, message: 'Voice query received.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.openRouterAssist = async (req, res) => {
    try {
        const { prompt } = req.body
        const apiKey = process.env.OPENROUTER_API_KEY
        if (!apiKey) {
            return res.status(400).json({ message: 'OPENROUTER_API_KEY not configured on server.' })
        }
        const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
        const response = await axios.post(OPENROUTER_URL, {
            model: 'google/gemini-2.0-flash-001',
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        })
        const text = response.data.choices?.[0]?.message?.content || 'No response.'
        res.json({ response: text })
    } catch (err) {
        const status = err.response?.status || 500
        const msg = err.response?.data?.error?.message || err.message || 'OpenRouter API error.'
        res.status(status).json({ message: msg })
    }
}
