import React, { useEffect } from 'react'

const Modal = ({ title, onClose, children }) => {
    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.7)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: 16,
        }} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 10, padding: 28, width: '100%', maxWidth: 500,
                maxHeight: '90vh', overflowY: 'auto',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h4>{title}</h4>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', color: 'var(--text-muted)',
                        fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1,
                    }}>×</button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal
