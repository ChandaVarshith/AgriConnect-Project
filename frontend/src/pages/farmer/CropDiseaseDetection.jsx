import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';
import './CropDiseaseDetection.css';

const BG = 'https://images.unsplash.com/photo-1586771107513-4ce883fb548c?w=1400&auto=format&fit=crop&q=80';

const CropDiseaseDetection = () => {
    const { t } = useLanguage();
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
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ml/predict-disease`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            if (res.data.success) {
                setResult(res.data);
            } else {
                setError(res.data.message || 'Failed to analyze the image.');
            }
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.response?.data?.message || 'An error occurred during analysis.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout
            role="farmer"
            photoUrl={BG}
            welcomeText={t('detectcropdisease')}
            subText="Upload a clear image of your crop leaf for AI-powered disease detection."
        >
            <div className="disease-detection-container">
                <div className="disease-detection-card">
                    <h2 className="disease-detection-title">{t('uploadcropimage')}</h2>
                    
                    <div className="upload-area">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            id="crop-image-upload"
                            className="file-input"
                        />
                        <label htmlFor="crop-image-upload" className="upload-label">
                            <span className="upload-icon">📸</span>
                            <span>{previewUrl ? 'Change Image' : 'Select Image'}</span>
                        </label>
                        
                        {previewUrl && (
                            <div className="image-preview">
                                <img src={previewUrl} alt="Crop Preview" />
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleAnalyze} 
                        disabled={!selectedImage || loading}
                        className="analyze-btn"
                    >
                        {loading ? t('analyzing') : t('analyzecrop')}
                    </button>

                    {error && <div className="error-message">{error}</div>}

                    {result && (
                        <div className="result-container">
                            <h3 className="result-title">{t('diseaseresult')}</h3>
                            <div className="result-content">
                                <div className="result-item">
                                    <span className="result-label">Detected Disease:</span>
                                    <span className="result-value highlight">{result.prediction}</span>
                                </div>
                                {result.confidence && (
                                    <div className="result-item">
                                        <span className="result-label">{t('predictionconfidence')}:</span>
                                        <span className="result-value">{result.confidence}%</span>
                                    </div>
                                )}
                            </div>
                            {result.mocked && (
                                <div className="mock-warning">
                                    {t('mockresultwarning')}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CropDiseaseDetection;
