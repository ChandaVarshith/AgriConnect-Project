import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'

const th = { padding: '12px 16px', color: '#fff', textAlign: 'left', fontSize: '0.82rem', letterSpacing: '0.04em', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }
const td = { padding: '12px 16px', color: '#ddd', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }
const inputStyle = { padding: '9px 13px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.87rem', outline: 'none', width: '100%', boxSizing: 'border-box' }
const labelStyle = { display: 'block', color: '#ccc', fontSize: '0.78rem', fontWeight: 600, marginBottom: 4 }

const EMPTY = { name: '', orgName: '', email: '', password: '', contact: '', location: '' }

const ManageFinanciers = () => {
    const [list, setList] = useState([])
    const [loading, setL] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState('')

    const load = () => {
        setL(true)
        API.get('/admin/financiers').then(r => setList(r.data)).catch(() => { }).finally(() => setL(false))
    }
    useEffect(() => { load() }, [])

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

    const handleAdd = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await API.post('/admin/financiers', form)
            setToast('✅ Financier added successfully!')
            setForm(EMPTY)
            setShowForm(false)
            load()
            setTimeout(() => setToast(''), 3000)
        } catch (err) {
            setToast('❌ ' + (err.response?.data?.message || 'Failed to add financier.'))
            setTimeout(() => setToast(''), 3500)
        } finally {
            setSaving(false)
        }
    }

    return (
        <PageLayout role="admin" title="View All Sectors">
            {toast && (
                <div style={{ background: toast.startsWith('✅') ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', border: `1px solid ${toast.startsWith('✅') ? '#22c55e' : '#ef4444'}`, borderRadius: 8, padding: '12px 18px', marginBottom: 20, color: '#fff', fontSize: '0.88rem' }}>
                    {toast}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <p style={{ color: '#aaa', margin: 0, fontSize: '0.88rem' }}>Organisations offering agricultural financial services on AgriConnect.</p>
                <button onClick={() => setShowForm(!showForm)} style={{
                    background: '#f59e0b', color: '#000', border: 'none', borderRadius: 6,
                    padding: '10px 22px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                }}>
                    {showForm ? '✕ Cancel' : '+ Add Financier'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleAdd} style={{
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 12, padding: '24px 28px', marginBottom: 28,
                }}>
                    <h3 style={{ color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.3rem', margin: '0 0 20px' }}>Add New Financier</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px 20px', marginBottom: 20 }}>
                        {[
                            { key: 'orgName', label: 'Organisation Name *', type: 'text', required: true },
                            { key: 'name', label: 'Contact Person Name', type: 'text' },
                            { key: 'email', label: 'Email *', type: 'email', required: true },
                            { key: 'password', label: 'Password *', type: 'password', required: true },
                            { key: 'contact', label: 'Phone / Contact', type: 'tel' },
                            { key: 'location', label: 'Location', type: 'text' },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={labelStyle}>{f.label}</label>
                                <input type={f.type} value={form[f.key]} onChange={set(f.key)} required={f.required} style={inputStyle} placeholder={f.label.replace(' *', '')} />
                            </div>
                        ))}
                    </div>
                    <button type="submit" disabled={saving} style={{
                        background: saving ? '#92400e' : '#f59e0b', color: '#000', border: 'none',
                        borderRadius: 6, padding: '10px 28px', fontWeight: 700, fontSize: '0.9rem',
                        cursor: saving ? 'not-allowed' : 'pointer',
                    }}>
                        {saving ? 'Saving…' : 'Add Financier'}
                    </button>
                </form>
            )}

            {loading ? <p style={{ color: '#aaa' }}>Loading…</p> : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <thead><tr>
                            {['Organisation', 'Contact Person', 'Email', 'Phone', 'Location', 'Loans Offered'].map(h => <th key={h} style={th}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                            {list.length === 0
                                ? <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: '#666', padding: 28 }}>No financiers found.</td></tr>
                                : list.map((f, i) => (
                                    <tr key={f._id} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                                        <td style={{ ...td, fontWeight: 600, color: '#fff' }}>{f.orgName}</td>
                                        <td style={td}>{f.name || '—'}</td>
                                        <td style={td}>{f.email}</td>
                                        <td style={td}>{f.contact || '—'}</td>
                                        <td style={td}>{f.location || '—'}</td>
                                        <td style={td}>
                                            <span style={{ background: '#f59e0b22', color: '#f59e0b', padding: '3px 10px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 700 }}>
                                                {f.loanTypes?.length || 0} products
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </PageLayout>
    )
}

export default ManageFinanciers
