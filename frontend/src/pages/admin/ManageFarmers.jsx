import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'

const tableStyle = {
    width: '100%', borderCollapse: 'collapse',
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
    borderRadius: 10, overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
}
const th = { padding: '12px 16px', color: '#fff', textAlign: 'left', fontSize: '0.82rem', letterSpacing: '0.04em', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }
const td = { padding: '12px 16px', color: '#ddd', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }
const inputStyle = { padding: '9px 13px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.87rem', outline: 'none', width: '100%', boxSizing: 'border-box' }
const labelStyle = { display: 'block', color: '#ccc', fontSize: '0.78rem', fontWeight: 600, marginBottom: 4 }

const EMPTY = { name: '', email: '', phone: '', password: '', district: '', state: '', farmSize: '', primaryCrops: '', preferredLanguage: 'en' }

const ManageFarmers = () => {
    const [farmers, setFarmers] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState('')

    const fetchFarmers = () => {
        setLoading(true)
        API.get('/admin/farmers').then(r => setFarmers(r.data)).catch(() => { }).finally(() => setLoading(false))
    }

    useEffect(() => { fetchFarmers() }, [])

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

    const handleAdd = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await API.post('/admin/farmers', form)
            setToast('✅ Farmer added successfully!')
            setForm(EMPTY)
            setShowForm(false)
            fetchFarmers()
            setTimeout(() => setToast(''), 3000)
        } catch (err) {
            setToast('❌ ' + (err.response?.data?.message || 'Failed to add farmer.'))
            setTimeout(() => setToast(''), 3500)
        } finally {
            setSaving(false)
        }
    }

    const filtered = farmers.filter(f =>
        f.name?.toLowerCase().includes(search.toLowerCase()) ||
        f.phone?.includes(search) ||
        f.location?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <PageLayout role="admin" title="Manage Farmers">
            {toast && (
                <div style={{ background: toast.startsWith('✅') ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', border: `1px solid ${toast.startsWith('✅') ? '#22c55e' : '#ef4444'}`, borderRadius: 8, padding: '12px 18px', marginBottom: 20, color: '#fff', fontSize: '0.88rem' }}>
                    {toast}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <input placeholder="🔍  Search by name, phone or location…" value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ ...inputStyle, maxWidth: 360 }} />
                <button onClick={() => setShowForm(!showForm)} style={{
                    background: '#22c55e', color: '#000', border: 'none', borderRadius: 6,
                    padding: '10px 22px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                }}>
                    {showForm ? '✕ Cancel' : '+ Add Farmer'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleAdd} style={{
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 12, padding: '24px 28px', marginBottom: 28,
                }}>
                    <h3 style={{ color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.3rem', margin: '0 0 20px' }}>Add New Farmer</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px 20px', marginBottom: 20 }}>
                        {[
                            { key: 'name', label: 'Full Name *', type: 'text', required: true },
                            { key: 'phone', label: 'Phone Number *', type: 'tel', required: true },
                            { key: 'password', label: 'Password *', type: 'password', required: true },
                            { key: 'email', label: 'Email', type: 'email', required: false },
                            { key: 'district', label: 'District', type: 'text' },
                            { key: 'state', label: 'State', type: 'text' },
                            { key: 'farmSize', label: 'Farm Size (acres)', type: 'text' },
                            { key: 'primaryCrops', label: 'Primary Crops', type: 'text' },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={labelStyle}>{f.label}</label>
                                <input type={f.type} value={form[f.key]} onChange={set(f.key)} required={f.required} style={inputStyle} placeholder={f.label.replace(' *', '')} />
                            </div>
                        ))}
                        <div>
                            <label style={labelStyle}>Preferred Language</label>
                            <select value={form.preferredLanguage} onChange={set('preferredLanguage')} style={{ ...inputStyle, cursor: 'pointer' }}>
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                                <option value="te">Telugu</option>
                                <option value="es">Spanish</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" disabled={saving} style={{
                        background: saving ? '#166534' : '#22c55e', color: '#000', border: 'none',
                        borderRadius: 6, padding: '10px 28px', fontWeight: 700, fontSize: '0.9rem',
                        cursor: saving ? 'not-allowed' : 'pointer',
                    }}>
                        {saving ? 'Saving…' : 'Add Farmer'}
                    </button>
                </form>
            )}

            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        <thead><tr>
                            {['Name', 'Email', 'Phone', 'Location', 'Farm Size', 'Primary Crops', 'Language'].map(h => <th key={h} style={th}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {filtered.length === 0
                                ? <tr><td colSpan={7} style={{ ...td, textAlign: 'center', color: '#666', padding: 28 }}>No farmers found.</td></tr>
                                : filtered.map((f, i) => (
                                    <tr key={f._id} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                                        <td style={td}>{f.name}</td>
                                        <td style={td}>{f.email || '—'}</td>
                                        <td style={td}>{f.phone}</td>
                                        <td style={td}>{f.location || '—'}</td>
                                        <td style={td}>{f.farmSize || '—'}</td>
                                        <td style={td}>{f.primaryCrops || '—'}</td>
                                        <td style={td}>{f.preferredLanguage?.toUpperCase() || 'EN'}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </PageLayout>
    )
}

export default ManageFarmers
