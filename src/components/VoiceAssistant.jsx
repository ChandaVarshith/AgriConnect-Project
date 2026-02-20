import React, { useState, useEffect } from 'react'

const VoiceAssistant = ({ onResult }) => {
    const [listening, setListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [supported, setSupported] = useState(false)
    let recognition = null

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (SpeechRecognition) {
            setSupported(true)
            recognition = new SpeechRecognition()
            recognition.lang = 'hi-IN'
            recognition.continuous = false
            recognition.interimResults = false
            recognition.onresult = (e) => {
                const text = e.results[0][0].transcript
                setTranscript(text)
                onResult(text)
                setListening(false)
            }
            recognition.onerror = () => setListening(false)
            recognition.onend = () => setListening(false)
        }
    }, [])

    const toggle = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) return

        const rec = new SpeechRecognition()
        rec.lang = 'hi-IN'
        rec.continuous = false
        rec.interimResults = false
        rec.onresult = (e) => {
            const text = e.results[0][0].transcript
            setTranscript(text)
            onResult(text)
            setListening(false)
        }
        rec.onerror = () => setListening(false)
        rec.onend = () => setListening(false)

        if (listening) {
            rec.stop()
            setListening(false)
        } else {
            rec.start()
            setListening(true)
        }
    }

    if (!supported) return <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Voice input not supported in this browser.</p>

    return (
        <div>
            <button type="button" onClick={toggle}
                style={{
                    background: listening ? 'rgba(231,76,60,0.2)' : 'rgba(82,183,136,0.12)',
                    border: `2px solid ${listening ? '#e74c3c' : 'var(--primary-light)'}`,
                    color: listening ? '#e74c3c' : 'var(--primary-light)',
                    borderRadius: 30, padding: '8px 20px', cursor: 'pointer', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                }}>
                {listening ? '🔴 Listening… (click to stop)' : '🎙️ Start Voice Input'}
            </button>
            {transcript && (
                <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    Heard: "{transcript}"
                </p>
            )}
        </div>
    )
}

export default VoiceAssistant
