import React from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

const cropData = [
    { region: 'Punjab', crops: ['Wheat', 'Rice', 'Maize'] },
    { region: 'Maharashtra', crops: ['Sugarcane', 'Cotton', 'Soybean'] },
    { region: 'Tamil Nadu', crops: ['Rice', 'Sugarcane', 'Banana'] },
    { region: 'Rajasthan', crops: ['Bajra', 'Jowar', 'Mustard'] },
    { region: 'West Bengal', crops: ['Rice', 'Jute', 'Tea'] },
    { region: 'Karnataka', crops: ['Coffee', 'Silk', 'Ragi'] },
    { region: 'Andhra Pradesh', crops: ['Rice', 'Tobacco', 'Chillies'] },
    { region: 'Uttar Pradesh', crops: ['Wheat', 'Rice', 'Sugarcane'] },
]

const CropSuitabilityMap = () => {
    return (
        <div className="page-wrapper">
            <Sidebar role="expert" />
            <div className="main-content">
                <Navbar title="Crop Suitability Map" />
                <div className="card mb-3">
                    <p>Interactive map integration (Leaflet.js / Google Maps) can be connected here to show regional crop suitability zones.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                    {cropData.map(item => (
                        <div key={item.region} className="card" style={{ borderLeft: '4px solid var(--primary-light)' }}>
                            <h4 style={{ color: 'var(--primary-light)', marginBottom: 10 }}>📍 {item.region}</h4>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {item.crops.map(c => (
                                    <span key={c} style={{
                                        background: 'rgba(82,183,136,0.15)', color: 'var(--accent)',
                                        padding: '3px 10px', borderRadius: 12, fontSize: '0.78rem', fontWeight: 600
                                    }}>{c}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CropSuitabilityMap
