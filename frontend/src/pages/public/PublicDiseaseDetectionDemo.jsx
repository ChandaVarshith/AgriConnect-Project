import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import axios from 'axios';
import '../farmer/CropDiseaseDetection.css';
import './PublicHome.css';

const HERO_BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&auto=format&fit=crop&q=80';

// Inject Outfit font if not already present
const injectFont = () => {
    if (!document.getElementById('outfit-font-link')) {
        const link = document.createElement('link');
        link.id = 'outfit-font-link';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap';
        document.head.appendChild(link);
    }
};

const PublicDiseaseDetectionDemo = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => { injectFont(); }, []);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError('');
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) return;
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            let baseUrl = import.meta.env.VITE_API_URL || 'https://agriconnect-project-a44i.onrender.com/api';
            if (baseUrl.includes('your-render-app-url')) baseUrl = 'https://agriconnect-project-a44i.onrender.com/api';
            if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
            if (!baseUrl.endsWith('/api')) baseUrl += '/api';

            const res = await axios.post(`${baseUrl}/ml/predict-disease`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 120000, // 2 min timeout for cold starts
            });

            if (res.data.success) {
                setResult(res.data);
            } else {
                setError(res.data.message || res.data.error || 'Failed to analyze the image.');
            }
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.response?.data?.message || 'An error occurred during analysis. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#060806', position: 'relative', overflow: 'hidden' }}>
            {/* Background */}
            <img src={HERO_BG} alt="Farming" className="hero-bg-img" style={{ zIndex: 0 }} />
            {/* Base overlay */}
            <div className="hero-bg-overlay" style={{ zIndex: 1 }}></div>
            {/* Extra strong vignette — darkens corners */}
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: 2,
                pointerEvents: 'none',
                background: [
                    'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.50) 100%)',
                    'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.45) 100%)',
                    'linear-gradient(to right, rgba(0,0,0,0.20) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.20) 100%)',
                ].join(', ')
            }}></div>

            {/* Custom Navbar — no globe, Sign In active */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 32px', height: '64px',
                background: 'rgba(6, 10, 6, 0.7)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.05em', color: '#fff' }}>AGRI</span>
                    <span style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.05em', color: '#22c55e' }}>CONNECT</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link to="/login" style={{ textDecoration: 'none', color: '#fff', fontWeight: 600, fontSize: '0.95rem', padding: '8px 16px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.2s' }}>Sign In</Link>
                    <Link to="/register" style={{ textDecoration: 'none', color: '#fff', fontWeight: 600, fontSize: '0.95rem', background: '#22c55e', padding: '8px 20px', borderRadius: '50px', boxShadow: '0 4px 15px rgba(34,197,94,0.3)' }}>Register</Link>
                </div>
            </nav>

            {/* Main content */}
            <div style={{ flex: 1, position: 'relative', zIndex: 10 }}>

                {/* Hero — uses EXACT same classes as landing page for identical styling */}
                <section className="landing-hero" style={{ minHeight: 'auto', paddingBottom: '20px' }}>
                    <div className="hero-content">
                        <div className="hero-pill">AI-Powered Crop Health</div>
                        <h1 className="hero-headline">Crop Disease Inspection</h1>
                        <p className="hero-subtext">
                            Upload a photo of your crop leaf and our AI will instantly detect diseases.<br />
                            Create a free account to unlock the full detailed report.
                        </p>
                    </div>
                </section>

                {/* Upload & Result area */}
                <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px 60px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    
                    {/* Upload Card */}
                    <div className="cdd-card" style={{ width: '100%' }}>
                        <div className="cdd-upload-zone">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="crop-image-upload"
                                className="cdd-file-input"
                            />
                            <label htmlFor="crop-image-upload" className="cdd-upload-label">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Selected crop" className="cdd-preview-img" style={{ maxHeight: '320px', objectFit: 'contain', borderRadius: '8px' }} />
                                ) : (
                                    <div className="cdd-upload-placeholder">
                                        <span className="cdd-upload-icon">🌿</span>
                                        <span className="cdd-upload-text">Drop or click to upload a crop image</span>
                                        <span className="cdd-upload-hint">Supports JPG, PNG, WEBP · Max 10MB</span>
                                    </div>
                                )}
                            </label>
                            {previewUrl && (
                                <label htmlFor="crop-image-upload" className="cdd-change-btn">
                                    Change Image
                                </label>
                            )}
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={!selectedImage || loading}
                            className="cdd-analyze-btn"
                        >
                            {loading ? (
                                <><span className="cdd-spinner" />Analyzing image...</>
                            ) : (
                                '⚡ Analyze Crop'
                            )}
                        </button>

                        {error && (
                            <div className="cdd-error">⚠ {error}</div>
                        )}
                    </div>

                    {/* Result Card */}
                    {result && (
                        <div className={`cdd-result-card ${result.isHealthy ? 'healthy' : 'diseased'}`} style={{ width: '100%', animation: 'slideUp 0.5s ease-out' }}>
                            <div className="cdd-result-header">
                                <span className="cdd-result-icon">{result.isHealthy ? '✓' : '!'}</span>
                                <h3 className="cdd-result-title">Analysis Result</h3>
                            </div>

                            <div className="cdd-result-body">
                                {/* Status — fully visible */}
                                <div className="cdd-result-row">
                                    <span className="cdd-result-label">Status</span>
                                    <span className={`cdd-result-badge ${result.isHealthy ? 'badge-healthy' : 'badge-diseased'}`}>
                                        {result.isHealthy ? '✓ Healthy Crop' : '⚠ Disease Detected'}
                                    </span>
                                </div>

                                {/* Paywall: blurred rows + overlay in same wrapper */}
                                <div style={{ position: 'relative' }}>
                                    {/* Ghost rows — blurred */}
                                    <div style={{ filter: 'blur(5px)', opacity: 0.4, pointerEvents: 'none', userSelect: 'none', minHeight: '220px' }}>
                                        <div className="cdd-result-row">
                                            <span className="cdd-result-label">Disease Name</span>
                                            <span className="cdd-result-value">{result.prediction}</span>
                                        </div>
                                        <div className="cdd-result-row">
                                            <span className="cdd-result-label">AI Confidence</span>
                                            <div className="cdd-confidence-bar-wrap">
                                                <div className="cdd-confidence-bar" style={{ width: `${result.confidence}%`, background: result.isHealthy ? '#22c55e' : '#ef4444' }} />
                                                <span className="cdd-confidence-pct">{result.confidence}%</span>
                                            </div>
                                        </div>
                                        <div className="cdd-result-row" style={{ borderBottom: 'none' }}>
                                            <span className="cdd-result-label">Recommended Treatment</span>
                                            <span className="cdd-result-value">Expert remedy available...</span>
                                        </div>
                                    </div>

                                    {/* Smooth lock overlay */}
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(8,14,8,0.78)',
                                        backdropFilter: 'blur(8px)',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        padding: '20px 24px',
                                        zIndex: 5,
                                    }}>
                                        <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>🔒</div>
                                        <h4 style={{ color: '#fff', margin: '0 0 8px', fontSize: '1.1rem', fontFamily: '"Outfit", sans-serif', fontWeight: 700 }}>
                                            Unlock Full Report
                                        </h4>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 18px', fontSize: '0.85rem', maxWidth: '280px', lineHeight: 1.55, fontFamily: '"Outfit", sans-serif' }}>
                                            Sign in to see the disease name, confidence score, and treatment advice.
                                        </p>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                            <Link to="/login" style={{ padding: '8px 22px', borderRadius: '50px', background: 'transparent', border: '1px solid rgba(255,255,255,0.35)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem', fontFamily: '"Outfit", sans-serif' }}>Login</Link>
                                            <Link to="/register/public" style={{ padding: '8px 22px', borderRadius: '50px', background: '#22c55e', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(34,197,94,0.35)' }}>Create Free Account</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div style={{ position: 'relative', zIndex: 10 }}>
                <Footer />
            </div>
        </div>
    );
};

export default PublicDiseaseDetectionDemo;
