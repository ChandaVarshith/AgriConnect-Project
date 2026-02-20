import React, { createContext, useContext, useState } from 'react'

const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(
        localStorage.getItem('language') || 'en'
    )

    const changeLanguage = (lang) => {
        setLanguage(lang)
        localStorage.setItem('language', lang)
    }

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
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
