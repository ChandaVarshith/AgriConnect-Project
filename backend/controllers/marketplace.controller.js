const Produce = require('../models/Produce.model')
const Farmer = require('../models/Farmer.model')

// Public: get all approved listings
exports.getListings = async (req, res) => {
    try {
        const { search } = req.query
        const filter = { available: true, status: 'approved' }
        if (search) filter.name = { $regex: search, $options: 'i' }
        const listings = await Produce.find(filter).populate('farmerId', 'name phone location').sort({ createdAt: -1 })
        res.json(listings)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Expert: get pending listings (awaiting approval)
exports.getPendingListings = async (req, res) => {
    try {
        const listings = await Produce.find({ status: 'pending', available: true })
            .populate('farmerId', 'name phone location email')
            .sort({ createdAt: -1 })
        res.json(listings)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Farmer: get ONLY own listings
exports.getMyListings = async (req, res) => {
    try {
        const listings = await Produce.find({ farmerId: req.user.id }).sort({ createdAt: -1 })
        res.json(listings)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Farmer: get ALL approved listings + own pending/rejected (so farmers see everything)
exports.getAllForFarmer = async (req, res) => {
    try {
        // All approved listings from any farmer
        const approved = await Produce.find({ available: true, status: 'approved' })
            .populate('farmerId', 'name phone location')
            .sort({ createdAt: -1 })
        // Own non-approved listings (pending/rejected) so farmer can see their queue
        const ownOther = await Produce.find({ farmerId: req.user.id, status: { $ne: 'approved' }, available: true })
            .sort({ createdAt: -1 })
        // Merge: own non-approved first, then all approved (deduplicated)
        const approvedIds = new Set(approved.map(a => a._id.toString()))
        const ownNotInApproved = ownOther.filter(o => !approvedIds.has(o._id.toString()))
        const all = [...ownNotInApproved, ...approved]
        res.json(all)
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

// Farmer: create listing — auto-approved so it shows immediately
exports.createListing = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.user.id)
        if (!farmer) return res.status(404).json({ message: 'Farmer profile not found.' })
        const listing = await Produce.create({
            ...req.body,
            farmerId: req.user.id,
            status: 'approved',
            farmerName: farmer.name || '',
            farmerPhone: farmer.phone || '',
        })
        res.status(201).json(listing)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateListing = async (req, res) => {
    try {
        const listing = await Produce.findOneAndUpdate(
            { _id: req.params.id, farmerId: req.user.id },
            req.body, { new: true }
        )
        if (!listing) return res.status(404).json({ message: 'Listing not found or not yours.' })
        res.json(listing)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Farmer: delete own listing ONLY
exports.deleteListing = async (req, res) => {
    try {
        const listing = await Produce.findOneAndDelete({ _id: req.params.id, farmerId: req.user.id })
        if (!listing) return res.status(404).json({ message: 'Listing not found or not yours.' })
        res.json({ message: 'Listing removed.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Expert: approve listing
exports.approveListing = async (req, res) => {
    try {
        const listing = await Produce.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true })
        if (!listing) return res.status(404).json({ message: 'Listing not found.' })
        res.json({ message: 'Listing approved.', listing })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Expert: reject listing (mark unavailable)
exports.rejectListing = async (req, res) => {
    try {
        const listing = await Produce.findByIdAndUpdate(req.params.id, { status: 'rejected', available: false }, { new: true })
        if (!listing) return res.status(404).json({ message: 'Listing not found.' })
        res.json({ message: 'Listing rejected.', listing })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Expert: remove an approved listing
exports.expertRemoveListing = async (req, res) => {
    try {
        const listing = await Produce.findByIdAndUpdate(req.params.id, { available: false, status: 'rejected' }, { new: true })
        if (!listing) return res.status(404).json({ message: 'Listing not found.' })
        res.json({ message: 'Listing removed from marketplace.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Public: purchase inquiry (reveal farmer contact)
exports.purchase = async (req, res) => {
    try {
        const listing = await Produce.findById(req.params.id).populate('farmerId', 'name phone')
        if (!listing) return res.status(404).json({ message: 'Listing not found.' })
        res.json({
            message: 'Inquiry submitted. Contact farmer directly.',
            farmerName: listing.farmerId?.name || listing.farmerName,
            farmerPhone: listing.farmerId?.phone || listing.farmerPhone,
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
