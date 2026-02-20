import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import ProduceCard from '../../components/ProduceCard'
import Modal from '../../components/Modal'
import marketplaceService from '../../services/marketplaceService'

const MarketplaceFarmer = () => {
    const [listings, setListings] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ name: '', quantity: '', price: '', unit: 'kg' })

    const loadListings = () => {
        marketplaceService.getMyListings().then(res => setListings(res.data)).catch(console.error)
    }

    useEffect(() => { loadListings() }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            await marketplaceService.createListing(form)
            setShowModal(false)
            setForm({ name: '', quantity: '', price: '', unit: 'kg' })
            loadListings()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this listing?')) return
        await marketplaceService.deleteListing(id)
        loadListings()
    }

    return (
        <div className="page-wrapper">
            <Sidebar role="farmer" />
            <div className="main-content">
                <Navbar title="My Produce Listings" />
                <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>+ Add New Listing</button>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                    {listings.length === 0
                        ? <p>No listings yet. Add your produce to the marketplace!</p>
                        : listings.map(l => <ProduceCard key={l._id} produce={l} onDelete={handleDelete} showActions />)
                    }
                </div>

                {showModal && (
                    <Modal title="Add Produce Listing" onClose={() => setShowModal(false)}>
                        <form onSubmit={handleCreate}>
                            <div className="form-group"><label>Produce Name</label>
                                <input type="text" placeholder="e.g. Tomato, Rice" value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                            <div className="form-group"><label>Quantity</label>
                                <input type="number" placeholder="Amount" value={form.quantity}
                                    onChange={e => setForm({ ...form, quantity: e.target.value })} required /></div>
                            <div className="form-group"><label>Unit</label>
                                <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                                    <option value="kg">kg</option>
                                    <option value="quintal">Quintal</option>
                                    <option value="tonne">Tonne</option>
                                </select></div>
                            <div className="form-group"><label>Price (₹ per unit)</label>
                                <input type="number" placeholder="Price" value={form.price}
                                    onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
                            <button className="btn btn-primary" type="submit">Create Listing</button>
                        </form>
                    </Modal>
                )}
            </div>
        </div>
    )
}

export default MarketplaceFarmer
