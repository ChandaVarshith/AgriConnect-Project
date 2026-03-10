const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const OPENROUTER_URL = `https://openrouter.ai/api/v1/chat/completions`

export const agribotService = {
    /**
     * Sends a prompt to OpenRouter API and returns the text response
     * @param {string} prompt
     */
    ask: async (prompt) => {
        const body = {
            model: "google/gemini-2.0-flash-001",
            messages: [{ role: "user", content: prompt }]
        }
        const res = await fetch(OPENROUTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`
            },
            body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error('OpenRouter API request failed')
        const data = await res.json()
        return data.choices?.[0]?.message?.content || 'No response from AI.'
    },

    /**
     * Sends a farming-specific query with context prefix
     */
    askFarmingQuery: async (query, cropType = '', location = '') => {
        const prompt = `You are an expert agricultural advisor. A farmer has the following query about ${cropType ? `${cropType} crop` : 'farming'} ${location ? `in ${location}` : ''}:\n\n"${query}"\n\nPlease provide a practical, easy-to-understand response.`
        return agribotService.ask(prompt)
    },
}

export default agribotService
