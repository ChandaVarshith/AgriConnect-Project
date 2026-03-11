import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = {
    admin: [
        { to: '/admin', icon: '📊', label: 'Dashboard' },
        { to: '/admin/farmers', icon: '🌾', label: 'Farmers' },
        { to: '/admin/experts', icon: '👨‍🔬', label: 'Experts' },
        { to: '/admin/financiers', icon: '🏦', label: 'Financiers' },
    ],
    farmer: [
        { to: '/farmer', icon: '🏠', label: 'Home' },
        { to: '/farmer/disease-detection', icon: '🔍', label: 'Disease Detection' },
        { to: '/farmer/query', icon: '❓', label: 'Ask Expert' },
        { to: '/farmer/responses', icon: '💬', label: 'Responses' },
        { to: '/farmer/loans', icon: '🏦', label: 'Loans' },
        { to: '/farmer/articles', icon: '📰', label: 'Articles' },
        { to: '/farmer/marketplace', icon: '🛒', label: 'My Produce' },
    ],
    expert: [
        { to: '/expert', icon: '🏠', label: 'Dashboard' },
        { to: '/expert/requests', icon: '📋', label: 'Farmer Queries' },
        { to: '/expert/responses', icon: '💬', label: 'My Responses' },
        { to: '/expert/article/create', icon: '✍️', label: 'Write Article' },
        { to: '/expert/crop-map', icon: '🗺️', label: 'Crop Map' },
    ],
    financier: [
        { to: '/financier', icon: '🏠', label: 'Dashboard' },
        { to: '/financier/add-loan', icon: '➕', label: 'Add Loan' },
        { to: '/financier/loan-requests', icon: '📋', label: 'Applications' },
        { to: '/financier/all-loans', icon: '📊', label: 'All Loans' },
    ],
}

const Sidebar = ({ role }) => {
    const items = navItems[role] || []

    return (
        <aside style={{
            width: 220, minHeight: '100vh', background: '#0b1410',
            borderRight: '1px solid var(--border)', padding: '24px 0', flexShrink: 0,
        }}>
            <div style={{ padding: '0 20px 20px', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                    🌾 AgriConnect
                </span>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 4 }}>{role}</p>
            </div>
            {items.map(item => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to.split('/').length <= 2}
                    style={({ isActive }) => ({
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 20px', textDecoration: 'none',
                        color: isActive ? 'var(--primary-light)' : 'var(--text-muted)',
                        background: isActive ? 'rgba(82,183,136,0.12)' : 'transparent',
                        borderLeft: isActive ? '3px solid var(--primary-light)' : '3px solid transparent',
                        fontWeight: isActive ? 600 : 400, fontSize: '0.88rem',
                        transition: 'all 0.15s',
                    })}
                >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </aside>
    )
}

export default Sidebar
