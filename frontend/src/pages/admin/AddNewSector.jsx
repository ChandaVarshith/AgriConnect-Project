import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import './AddNewSector.css'

const STATIC_DASHBOARDS = [
    { _id: 'static-admin', name: 'Admin Dashboard', isStatic: true },
    { _id: 'static-farmer', name: 'Farmer Dashboard', isStatic: true },
    { _id: 'static-expert', name: 'Expert Dashboard', isStatic: true },
    { _id: 'static-financier', name: 'Financier Dashboard', isStatic: true },
    { _id: 'static-public', name: 'Public Dashboard', isStatic: true },
]

const AddNewSector = () => {
    const [sectors, setSectors] = useState([])
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState('')

    const loadSectors = () => {
        setLoading(true)
        API.get('/admin/sectors')
            .then(res => setSectors(res.data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }

    useEffect(() => { loadSectors() }, [])

    const handleAdd = async (e) => {
        e.preventDefault()
        if (!name.trim()) return

        setSaving(true)
        try {
            await API.post('/admin/sectors', { name: name.trim() })
            setToast('Sector created successfully!')
            setName('')
            loadSectors()
            setTimeout(() => setToast(''), 3000)
        } catch (err) {
            setToast('' + (err.response?.data?.message || 'Failed to create sector.'))
            setTimeout(() => setToast(''), 3500)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id, sectorName) => {
        if (!window.confirm(`Are you sure you want to completely remove the sector "${sectorName}"?`)) return

        try {
            await API.delete(`/admin/sectors/${id}`)
            setToast(`Sector "${sectorName}" removed.`)
            loadSectors()
            setTimeout(() => setToast(''), 3000)
        } catch (err) {
            setToast('Failed to remove sector.')
            setTimeout(() => setToast(''), 3500)
        }
    }

    const allSectors = [...STATIC_DASHBOARDS, ...sectors]

    return (
        <PageLayout role="admin" title="Add New Sectors">
            <div className="add-sector-container">
                {toast && (
                    <div className={`add-sector-alert ${toast.startsWith('') ? 'add-sector-alert-success' : 'add-sector-alert-error'}`}>
                        {toast}
                    </div>
                )}

                <div className="add-sector-stats-card">
                    <h3 className="add-sector-stats-title">Total Sectors / Dashboards Present</h3>
                    <div className="add-sector-stats-number">
                        {loading ? '...' : allSectors.length}
                    </div>
                </div>

                <form onSubmit={handleAdd} className="add-sector-form-card">
                    <h3 className="add-sector-form-title">Create a New Sector</h3>
                    <div className="add-sector-input-group">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Organic Farming, Hydroponics, Aquaponics..."
                            className="add-sector-input"
                            required
                        />
                        <button type="submit" disabled={saving || !name.trim()} className="add-sector-btn-submit">
                            {saving ? 'Creating...' : '+ Create New Sector'}
                        </button>
                    </div>
                </form>

                {loading ? <p className="add-sector-loading">Loading sectors...</p> : (
                    <div>
                        <h3 className="add-sector-form-title" style={{ marginTop: '40px' }}>Existing Sectors</h3>
                        {allSectors.length === 0 ? (
                            <p style={{ color: '#888' }}>No sectors created yet.</p>
                        ) : (
                            <div className="add-sector-list">
                                {allSectors.map(sector => (
                                    <div key={sector._id} className={`add-sector-card ${sector.isStatic ? 'add-sector-static' : ''}`}>
                                        <span>{sector.name} {sector.isStatic && <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '5px' }}>(Built-in)</span>}</span>
                                        {!sector.isStatic && (
                                            <button
                                                className="add-sector-delete-btn"
                                                onClick={() => handleDelete(sector._id, sector.name)}
                                                title="Delete sector"
                                            >
                                                
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PageLayout>
    )
}

export default AddNewSector
