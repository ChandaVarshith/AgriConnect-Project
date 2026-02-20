const Loan = require('../models/Loan.model')

exports.getLoans = async (req, res) => {
    try {
        const { search, type } = req.query
        const filter = { isActive: true }
        if (type) filter.type = type
        if (search) filter.title = { $regex: search, $options: 'i' }
        const loans = await Loan.find(filter).populate('financierId', 'orgName').sort({ createdAt: -1 })
        res.json(loans)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id).populate('financierId', 'orgName contact')
        if (!loan) return res.status(404).json({ message: 'Loan not found.' })
        res.json(loan)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.addLoan = async (req, res) => {
    try {
        const loan = await Loan.create({ ...req.body, financierId: req.user.id })
        res.status(201).json(loan)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateLoan = async (req, res) => {
    try {
        const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(loan)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteLoan = async (req, res) => {
    try {
        await Loan.findByIdAndUpdate(req.params.id, { isActive: false })
        res.json({ message: 'Loan deactivated.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
