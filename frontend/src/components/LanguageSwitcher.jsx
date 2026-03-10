import React from 'react'
import { useLanguage } from '../context/LanguageContext'

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'fr', label: 'Français' },
]

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage()

    return (
        <select
            value={language}
            onChange={e => changeLanguage(e.target.value)}
            style={{ padding: '4px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 6, fontSize: '0.85rem' }}>
            {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
        </select>
    )
}

export default LanguageSwitcher
