import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import './AdminDashboard.css'
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'

const StatCard = ({ label, value, color }) => (
    <div className="admin-dash-stat-card" style={{ border: `1px solid ${color}40` }}>
        <div className="admin-dash-stat-value" style={{ color }}>{value}</div>
        <div className="admin-dash-stat-label">{label}</div>
    </div>
)

const AdminDashboard = () => {
    const [stats, setStats] = useState({ farmers: 0, experts: 0, financiers: 0, queries: 0, loans: 0 })
    const [queryStats, setQueryStats] = useState({ pending: 0, resolved: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            API.get('/admin/stats'),
            API.get('/admin/query-stats'),
        ]).then(([s, q]) => {
            setStats(s.data)
            setQueryStats(q.data)
        }).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const statCards = [
        { label: 'Total Farmers', value: stats.farmers, color: '#22c55e' },
        { label: 'Active Experts', value: stats.experts, color: '#3b82f6' },
        { label: 'Financiers', value: stats.financiers, color: '#f59e0b' },
        { label: 'Total Queries', value: stats.queries, color: '#a855f7' },
        { label: 'Active Loans', value: stats.loans, color: '#ec4899' },
    ]

    const roleData = [
        { name: 'Farmers', value: stats.farmers },
        { name: 'Experts', value: stats.experts },
        { name: 'Financiers', value: stats.financiers },
    ].filter(d => d.value > 0);
    const roleColors = ['#22c55e', '#3b82f6', '#f59e0b'];

    const queryData = [
        { name: 'Pending', value: queryStats.pending },
        { name: 'Resolved', value: queryStats.resolved },
    ].filter(d => d.value > 0);
    const queryColors = ['#f59e0b', '#22c55e'];

    const activityData = [
        { name: 'Queries', value: stats.queries },
        { name: 'Loans', value: stats.loans },
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="admin-dash-tooltip">
                    <p className="admin-dash-tooltip-label">{`${payload[0].name} : ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <PageLayout role="admin" title="Admin Dashboard">
            {loading ? <p className="admin-dash-loading">Loading…</p> : (
                <>
                    <div className="admin-dash-stats-grid">
                        {statCards.map(c => <StatCard key={c.label} {...c} />)}
                    </div>

                    <div className="admin-dash-charts-grid">
                        <div className="admin-dash-chart-card">
                            <h3 className="admin-dash-chart-title">Users by Role</h3>
                            <div className="admin-dash-chart-wrapper">
                                {roleData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie data={roleData} cx="50%" cy="50%" innerRadius={0} outerRadius={80} paddingAngle={2} dataKey="value">
                                                {roleData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={roleColors[index % roleColors.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ fontSize: '0.85rem', paddingTop: '10px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : <p className="admin-dash-chart-empty">No data available</p>}
                            </div>
                        </div>

                        <div className="admin-dash-chart-card">
                            <h3 className="admin-dash-chart-title">Query Status</h3>
                            <div className="admin-dash-chart-wrapper">
                                {queryData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie data={queryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {queryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={queryColors[index % queryColors.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ fontSize: '0.85rem', paddingTop: '10px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : <p className="admin-dash-chart-empty">No data available</p>}
                            </div>
                        </div>

                        <div className="admin-dash-chart-card">
                            <h3 className="admin-dash-chart-title">System Activity</h3>
                            <div className="admin-dash-chart-wrapper">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={activityData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <XAxis dataKey="name" tick={{ fill: '#aaa', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={false} />
                                        <YAxis tick={{ fill: '#aaa', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {activityData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? '#a855f7' : '#ec4899'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </PageLayout>
    )
}

export default AdminDashboard
