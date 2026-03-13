import React, { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import axios from 'axios';
import './CropDiseaseDetection.css';

const CropDiseaseDetection = ({ role = 'farmer' }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

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
                withCredentials: true
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
        <PageLayout
            role={role}
            title="Crop Disease Detection"
            bgUrl="https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1400&auto=format&fit=crop&q=80"
        >
            <p className="cdd-subtitle">
                Upload a clear image of your crop leaf for instant AI-powered disease detection
            </p>

            <div className="cdd-content">
                {/* Upload Card */}
                <div className="cdd-card">
                    <h2 className="cdd-card-title"> Upload Crop Image</h2>

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
                                <img src={previewUrl} alt="Selected crop" className="cdd-preview-img" />
                            ) : (
                                <div className="cdd-upload-placeholder">
                                    <span className="cdd-upload-icon"></span>
                                    <span className="cdd-upload-text">Click to select a crop image</span>
                                    <span className="cdd-upload-hint">Supports JPG, PNG, WEBP</span>
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
                            <><span className="cdd-spinner" />Analyzing...</>
                        ) : (
                            '⚡ Analyze Crop'
                        )}
                    </button>

                    {error && (
                        <div className="cdd-error">
                            ! {error}
                        </div>
                    )}
                </div>

                {/* Result Card */}
                <div className="cdd-result-card-wrapper">
                    {result ? (
                        <div className={`cdd-result-card ${result.isHealthy ? 'healthy' : 'diseased'}`}>
                            <div className="cdd-result-header">
                                <span className="cdd-result-icon">{result.isHealthy ? '' : '!'}</span>
                                <h3 className="cdd-result-title">Analysis Result</h3>
                            </div>

                            <div className="cdd-result-body">
                                <div className="cdd-result-row">
                                    <span className="cdd-result-label">Status</span>
                                    <span className={`cdd-result-badge ${result.isHealthy ? 'badge-healthy' : 'badge-diseased'}`}>
                                        {result.isHealthy ? 'Healthy Crop' : 'Disease Detected'}
                                    </span>
                                </div>
                                <div className="cdd-result-row">
                                    <span className="cdd-result-label">Detection</span>
                                    <span className="cdd-result-value">{result.prediction}</span>
                                </div>
                                <div className="cdd-result-row cdd-result-row-col">
                                    <span className="cdd-result-label">Confidence</span>
                                    <div className="cdd-confidence-bar-wrap">
                                        <div
                                            className="cdd-confidence-bar"
                                            style={{ width: `${result.confidence}%`, background: result.isHealthy ? '#22c55e' : '#ef4444' }}
                                        />
                                        <span className="cdd-confidence-pct">{result.confidence}%</span>
                                    </div>
                                </div>
                            </div>

                            {result.mocked && (
                                <div className="cdd-mock-badge">
                                    ℹ️ Model file not found on server — showing mock result.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="cdd-info-card">
                            <h3 className="cdd-info-title">📖 How it Works</h3>
                            <ul className="cdd-info-list">
                                <li>Upload a clear, well-lit image of a crop leaf</li>
                                <li>The AI model analyzes the leaf pattern for disease signatures</li>
                                <li>Results show the detected condition and confidence score</li>
                                <li>Supports 38+ common plant diseases across 14 crop types</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default CropDiseaseDetection;
