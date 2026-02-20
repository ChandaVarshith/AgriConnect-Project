import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import API from '../../services/api'

const PHOTO = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1200&auto=format&fit=crop&q=80'

// Simple SVG line chart
const LineChart = ({ data }) => {
    if (!data || data.length === 0) return null
    const W = 480, H = 200
    const maxY = Math.max(...data.map(d => d.count), 1)
    const pts = data.map((d, i) => ({
        x: (i / (data.length - 1 || 1)) * (W - 40) + 20,
        y: H - 20 - ((d.count / maxY) * (H - 40)),
        label: d.date,
        val: d.count,
    }))
    const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: '#fff', borderRadius: 6 }}>
            {/* Y grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map(r => (
                <line key={r} x1={20} y1={H - 20 - r * (H - 40)} x2={W - 20} y2={H - 20 - r * (H - 40)}
                    stroke="#e5e5e5" strokeWidth={1} />
            ))}
            {/* Y axis labels */}
            {[0, 0.5, 1].map(r => (
                <text key={r} x={16} y={H - 20 - r * (H - 40) + 4} textAnchor="end" fontSize={11} fill="#888">
                    {Math.round(r * maxY)}
                </text>
            ))}
            {/* Line */}
            <path d={path} fill="none" stroke="#4caf50" strokeWidth={2} />
            {/* Dots */}
            {pts.map((p, i) => (
                <g key={i}>
                    <circle cx={p.x} cy={p.y} r={4} fill="#fff" stroke="#4caf50" strokeWidth={2} />
                    <text x={p.x} y={H - 4} textAnchor="middle" fontSize={9} fill="#888">{p.label}</text>
                </g>
            ))}
        </svg>
    )
}

// Simple SVG bar chart
const BarChart = ({ data }) => {
    if (!data || data.length === 0) return null
    const W = 480, H = 200
    const maxY = Math.max(...data.map(d => d.count), 1)
    const barW = Math.min(60, ((W - 60) / data.length) - 10)
    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: '#fff', borderRadius: 6 }}>
            {[0, 0.5, 1].map(r => (
                <line key={r} x1={30} y1={H - 20 - r * (H - 40)} x2={W - 10} y2={H - 20 - r * (H - 40)}
                    stroke="#e5e5e5" strokeWidth={1} />
            ))}
            {[0, 0.5, 1].map(r => (
                <text key={r} x={26} y={H - 20 - r * (H - 40) + 4} textAnchor="end" fontSize={11} fill="#888">
                    {Math.round(r * maxY)}
                </text>
            ))}
            {data.map((d, i) => {
                const bH = (d.count / maxY) * (H - 40)
                const x = 40 + i * ((W - 60) / data.length)
                return (
                    <g key={i}>
                        <rect x={x} y={H - 20 - bH} width={barW} height={bH} fill="#4caf50" rx={2} />
                        <text x={x + barW / 2} y={H - 4} textAnchor="middle" fontSize={9} fill="#888">{d.label}</text>
                    </g>
                )
            })}
            <text x={W / 2} y={H - 0} textAnchor="middle" fontSize={10} fill="#4caf50">■ solvedRequests</text>
        </svg>
    )
}

const AdminDashboard = () => {
    const [stats, setStats] = useState({ farmers: 0, experts: 0, financiers: 0, queries: 0 })
    const [lineData, setLineData] = useState([])
    const [barData, setBarData] = useState([])

    useEffect(() => {
        API.get('/admin/stats').then(r => setStats(r.data)).catch(() => { })
        API.get('/admin/chart-data').then(r => {
            setLineData(r.data?.queriesOverTime || [])
            setBarData(r.data?.expertActivity || [])
        }).catch(() => {
            // Fallback demo data
            setLineData([
                { date: '2024-11-12', count: 1 },
                { date: '2024-11-13', count: 4 },
                { date: '2024-11-14', count: 5 },
                { date: '2024-11-15', count: 1 },
                { date: '2024-12-08', count: 1 },
            ])
            setBarData([
                { label: 'Expert 1', count: 3 },
                { label: 'Expert 2', count: 3 },
            ])
        })
    }, [])

    return (
        <DashboardLayout
            role="admin"
            photoUrl={PHOTO}
            welcomeText="ADMIN HOME"
            subText="Manage farmers, experts, and financiers. Monitor platform activity and maintain the AgriConnect ecosystem."
        >
            {/* Stats strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 16, marginTop: 40 }}>
                {[
                    { label: 'Farmers', num: stats.farmers },
                    { label: 'Experts', num: stats.experts },
                    { label: 'Financiers', num: stats.financiers },
                    { label: 'Queries', num: stats.queries },
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <span className="stat-num">{s.num}</span>
                        <span className="stat-label">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px,1fr))', gap: 20, marginTop: 30 }}>
                <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 8, padding: '20px 24px' }}>
                    <LineChart data={lineData} />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 8, padding: '20px 24px' }}>
                    <BarChart data={barData} />
                </div>
            </div>
        </DashboardLayout>
    )
}

export default AdminDashboard
