const Produce = require('../models/Produce.model')

exports.getListings = async (req, res) => {
    try {
        const { search } = req.query
        const filter = { available: true }
        if (search) filter.name = { $regex: search, $options: 'i' }
        const listings = await Produce.find(filter).populate('farmerId', 'name location').sort({ createdAt: -1 })
        res.json(listings)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getMyListings = async (req, res) => {
    try {
        const listings = await Produce.find({ farmerId: req.user.id, available: { $ne: false } }).sort({ createdAt: -1 })
        res.json(listings)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getListingById = async (req, res) => {
    try {
        const listing = await Produce.findById(req.params.id).populate('farmerId', 'name phone location')
        if (!listing) return res.status(404).json({ message: 'Listing not found.' })
        res.json(listing)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.createListing = async (req, res) => {
    try {
        const listing = await Produce.create({ ...req.body, farmerId: req.user.id })
        res.status(201).json(listing)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateListing = async (req, res) => {
    try {
        const listing = await Produce.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(listing)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteListing = async (req, res) => {
    try {
        const listing = await Produce.findOneAndDelete({ _id: req.params.id, farmerId: req.user.id })
        if (!listing) return res.status(404).json({ message: 'Listing not found or not yours.' })
        res.json({ message: 'Listing removed.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.purchase = async (req, res) => {
    try {
        res.json({ message: 'Purchase flow — integrate payment gateway here.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
