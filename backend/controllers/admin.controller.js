const Farmer = require('../models/Farmer.model')
const Expert = require('../models/Expert.model')
const Financier = require('../models/Financier.model')
const Query = require('../models/Query.model')
const Loan = require('../models/Loan.model')
const LoanApplication = require('../models/LoanApplication.model')
const bcrypt = require('bcryptjs')

// ── Stats ─────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
    try {
        const [farmers, experts, financiers, queries, loans] = await Promise.all([
            Farmer.countDocuments(),
            Expert.countDocuments({ status: 'approved' }),
            Financier.countDocuments(),
            Query.countDocuments(),
            Loan.countDocuments({ isActive: true }),
        ])
        res.json({ farmers, experts, financiers, queries, loans })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ── Query Stats (for dashboard chart) ─────────────────────────
exports.getQueryStats = async (req, res) => {
    try {
        const [pending, resolved] = await Promise.all([
            Query.countDocuments({ status: 'pending' }),
            Query.countDocuments({ status: 'resolved' }),
        ])
        res.json({ pending, resolved })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ── Farmers ───────────────────────────────────────────────────
exports.getFarmers = async (req, res) => {
    try {
        const farmers = await Farmer.find().select('-password').sort({ createdAt: -1 })
        res.json(farmers)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.addFarmer = async (req, res) => {
    try {
        const { name, email, phone, password, district, state, farmSize, primaryCrops, preferredLanguage } = req.body
        if (!name || !phone || !password) return res.status(400).json({ message: 'Name, phone and password are required.' })
        const exists = await Farmer.findOne({ phone })
        if (exists) return res.status(400).json({ message: 'Phone already registered.' })
        const hashed = await bcrypt.hash(password, 10)
        const location = [district, state].filter(Boolean).join(', ')
        const farmer = await Farmer.create({ name, email, phone, password: hashed, district, state, location, farmSize, primaryCrops, preferredLanguage })
        res.status(201).json({ message: 'Farmer added successfully.', farmer })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteFarmer = async (req, res) => {
    try {
        const farmer = await Farmer.findByIdAndDelete(req.params.id)
        if (!farmer) return res.status(404).json({ message: 'Farmer not found.' })
        res.json({ message: 'Farmer deleted successfully.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ── Experts ───────────────────────────────────────────────────
exports.getExperts = async (req, res) => {
    try {
        const experts = await Expert.find().select('-password').sort({ createdAt: -1 })
        res.json(experts)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.addExpert = async (req, res) => {
    try {
        const { name, email, password, phone, experience, specialization, qualification, languagesSpoken, certifications } = req.body
        if (!name || !email || !password || !specialization) return res.status(400).json({ message: 'Name, email, password and specialization are required.' })
        const exists = await Expert.findOne({ email })
        if (exists) return res.status(400).json({ message: 'Email already registered.' })
        const hashed = await bcrypt.hash(password, 10)
        const expert = await Expert.create({
            name, email, password: hashed, phone, experience: Number(experience) || 0,
            specialization, qualification, languagesSpoken, certifications,
            status: 'approved', isVerified: true,
        })
        res.status(201).json({ message: 'Expert added and approved successfully.', expert })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateExpertStatus = async (req, res) => {
    try {
        const { status } = req.body
        const expert = await Expert.findByIdAndUpdate(req.params.id, { status }, { new: true })
        res.json(expert)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.approveExpert = async (req, res) => {
    try {
        const expert = await Expert.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true }).select('-password')
        if (!expert) return res.status(404).json({ message: 'Expert not found.' })
        res.json({ message: 'Expert approved.', expert })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.rejectExpert = async (req, res) => {
    try {
        const expert = await Expert.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true }).select('-password')
        if (!expert) return res.status(404).json({ message: 'Expert not found.' })
        res.json({ message: 'Expert rejected.', expert })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteExpert = async (req, res) => {
    try {
        await Expert.findByIdAndDelete(req.params.id)
        res.json({ message: 'Expert removed.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ── Financiers ────────────────────────────────────────────────
exports.getFinanciers = async (req, res) => {
    try {
        const financiers = await Financier.find().select('-password').populate('loanTypes').sort({ createdAt: -1 })
        res.json(financiers)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.addFinancier = async (req, res) => {
    try {
        const { name, orgName, email, password, contact, location } = req.body
        if (!orgName || !email || !password) return res.status(400).json({ message: 'Org name, email and password are required.' })
        const exists = await Financier.findOne({ email })
        if (exists) return res.status(400).json({ message: 'Email already registered.' })
        const hashed = await bcrypt.hash(password, 10)
        const financier = await Financier.create({ name, orgName, email, password: hashed, contact, location, status: 'approved' })
        res.status(201).json({ message: 'Financier added successfully.', financier })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.approveFinancier = async (req, res) => {
    try {
        const financier = await Financier.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true }).select('-password')
        if (!financier) return res.status(404).json({ message: 'Financier not found.' })
        res.json({ message: 'Financier approved.', financier })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.rejectFinancier = async (req, res) => {
    try {
        const financier = await Financier.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true }).select('-password')
        if (!financier) return res.status(404).json({ message: 'Financier not found.' })
        res.json({ message: 'Financier rejected.', financier })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteFinancier = async (req, res) => {
    try {
        await Financier.findByIdAndDelete(req.params.id)
        res.json({ message: 'Financier removed.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ── Sectors ───────────────────────────────────────────────────
const Sector = require('../models/Sector.model')

exports.getSectors = async (req, res) => {
    try {
        const sectors = await Sector.find().sort({ createdAt: -1 })
        res.json(sectors)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.addSector = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) return res.status(400).json({ message: 'Sector name is required.' })
        const exists = await Sector.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
        if (exists) return res.status(400).json({ message: 'Sector already exists.' })
        const sector = await Sector.create({ name })
        res.status(201).json({ message: 'Sector added successfully.', sector })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteSector = async (req, res) => {
    try {
        await Sector.findByIdAndDelete(req.params.id)
        res.json({ message: 'Sector removed.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
