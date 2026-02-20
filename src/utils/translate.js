/**
 * translate.js — Basic translation lookup helper
 * Extend TRANSLATIONS with actual translations for production use
 */
const TRANSLATIONS = {
    en: {
        welcome: 'Welcome',
        submitQuery: 'Submit Query',
        logout: 'Logout',
        login: 'Login',
    },
    hi: {
        welcome: 'स्वागत है',
        submitQuery: 'प्रश्न भेजें',
        logout: 'लॉग आउट',
        login: 'लॉगिन',
    },
    te: {
        welcome: 'స్వాగతం',
        submitQuery: 'ప్రశ్న సమర్పించండి',
        logout: 'లాగ్ అవుట్',
        login: 'లాగిన్',
    },
}

export const t = (key, language = 'en') => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key
}

export default t
