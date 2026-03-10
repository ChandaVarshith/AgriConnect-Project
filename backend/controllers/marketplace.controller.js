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
// NOTE: pending listings have available:false until approved, so do NOT filter by available
exports.getPendingListings = async (req, res) => {
    try {
        const listings = await Produce.find({ status: 'pending' })
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
// Each listing gets an _isOwner flag so the frontend never needs to compare IDs
exports.getAllForFarmer = async (req, res) => {
    try {
        const myId = req.user.id.toString()
        const mongoose = require('mongoose')
        const myObjectId = new mongoose.Types.ObjectId(myId)

        // All approved listings from any farmer (visible to everyone once approved)
        const approved = await Produce.find({ available: true, status: 'approved' })
            .populate('farmerId', 'name phone location')
            .sort({ createdAt: -1 })

        // Own pending/rejected listings — use ObjectId for reliable MongoDB match
        const ownPending = await Produce.find({ farmerId: myObjectId, status: { $ne: 'approved' } })
            .populate('farmerId', 'name phone location')
            .sort({ createdAt: -1 })

        // Merge: own pending/rejected first, then all approved (deduplicated by _id)
        const approvedIds = new Set(approved.map(a => a._id.toString()))
        const ownNotInApproved = ownPending.filter(o => !approvedIds.has(o._id.toString()))
        const all = [...ownNotInApproved, ...approved]

        // Stamp each listing with _isOwner — single source of truth for frontend
        const result = all.map(listing => {
            const raw = listing.toObject ? listing.toObject() : { ...listing }
            const fId = (raw.farmerId && typeof raw.farmerId === 'object')
                ? (raw.farmerId._id || raw.farmerId.id || '').toString()
                : (raw.farmerId || '').toString()
            raw._isOwner = (fId === myId)
            return raw
        })

        res.json(result)
    } catch (err) {
        console.error('[getAllForFarmer] ERROR:', err.message)
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

// Farmer: create listing — starts as PENDING, expert must approve before going live
exports.createListing = async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.user.id)
        if (!farmer) return res.status(404).json({ message: 'Farmer profile not found.' })
        const listing = await Produce.create({
            ...req.body,
            farmerId: req.user.id,
            status: 'pending',
            available: false,          // not visible to public until approved
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

// Expert: approve listing — makes it publicly available
exports.approveListing = async (req, res) => {
    try {
        const listing = await Produce.findByIdAndUpdate(
            req.params.id,
            { status: 'approved', available: true, rejectionReason: '' },
            { new: true }
        )
        if (!listing) return res.status(404).json({ message: 'Listing not found.' })
        res.json({ message: 'Listing approved.', listing })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Expert: reject listing — updates status to 'rejected' so farmer sees notification
exports.rejectListing = async (req, res) => {
    try {
        const reason = req.body.rejectionReason || req.body.reason || 'Rejected by expert.'

        // Find expert email
        let expertEmail = req.user.email || 'expert@agriconnect.com'
        if (!req.user.email && req.user.id) {
            const Expert = require('../models/Expert.model')
            const expert = await Expert.findById(req.user.id)
            if (expert) expertEmail = expert.email
        }

        const listing = await Produce.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected', rejectionReason: reason, rejectedByEmail: expertEmail, available: false },
            { new: true }
        )
        if (!listing) return res.status(404).json({ message: 'Listing not found.' })

        res.json({
            message: 'Listing rejected.',
            listing,
        })
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
