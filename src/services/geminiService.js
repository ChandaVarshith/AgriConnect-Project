const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`

export const geminiService = {
    /**
     * Sends a prompt to Gemini API and returns the text response
     * @param {string} prompt
     */
    ask: async (prompt) => {
        const body = {
            contents: [{ parts: [{ text: prompt }] }],
        }
        const res = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error('Gemini API request failed')
        const data = await res.json()
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.'
    },

    /**
     * Sends a farming-specific query with context prefix
     */
    askFarmingQuery: async (query, cropType = '', location = '') => {
        const prompt = `You are an expert agricultural advisor. A farmer has the following query about ${cropType ? `${cropType} crop` : 'farming'} ${location ? `in ${location}` : ''}:\n\n"${query}"\n\nPlease provide a practical, easy-to-understand response.`
        return geminiService.ask(prompt)
    },
}

export default geminiService
