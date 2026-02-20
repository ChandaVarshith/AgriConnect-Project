const Farmer = require('../models/Farmer.model')
const Expert = require('../models/Expert.model')
const Financier = require('../models/Financier.model')
const Query = require('../models/Query.model')
const Loan = require('../models/Loan.model')

exports.getStats = async (req, res) => {
    try {
        const [farmers, experts, queries, loans] = await Promise.all([
            Farmer.countDocuments(),
            Expert.countDocuments({ status: 'approved' }),
            Query.countDocuments(),
            Loan.countDocuments({ isActive: true }),
        ])
        res.json({ farmers, experts, queries, loans })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getFarmers = async (req, res) => {
    try {
        const farmers = await Farmer.find().select('-password').sort({ createdAt: -1 })
        res.json(farmers)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getExperts = async (req, res) => {
    try {
        const experts = await Expert.find().select('-password').sort({ createdAt: -1 })
        res.json(experts)
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

exports.getFinanciers = async (req, res) => {
    try {
        const financiers = await Financier.find().select('-password').populate('loanTypes').sort({ createdAt: -1 })
        res.json(financiers)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
