import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../i18n' // Ensure to import to initialize i18n

const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {
    // We can use the useTranslation hook, and that triggers a re-render when language changes
    const { t, i18n } = useTranslation()
    const [language, setLanguage] = useState(i18n.language || localStorage.getItem('language') || 'en')

    useEffect(() => {
        const storedLang = localStorage.getItem('language');
        if (storedLang && storedLang !== i18n.language) {
            i18n.changeLanguage(storedLang);
            setLanguage(storedLang);
        }

        const handleLanguageChange = (lng) => {
            setLanguage(lng);
        };
        i18n.on('languageChanged', handleLanguageChange);
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        }
    }, [i18n])

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang)
        localStorage.setItem('language', lang)
    }

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
