import React, { createContext, useContext, useState } from 'react'
import { t as translate } from '../utils/translate'

const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(
        localStorage.getItem('language') || 'en'
    )

    const changeLanguage = (lang) => {
        setLanguage(lang)
        localStorage.setItem('language', lang)
    }

    // Convenience helper — components can do: const { t } = useLanguage()
    const t = (key) => translate(key, language)

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => {
    const ctx = useContext(LanguageContext)
    if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
    return ctx
}

export default LanguageContext
