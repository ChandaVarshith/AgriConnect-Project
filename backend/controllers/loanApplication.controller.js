const LoanApplication = require('../models/LoanApplication.model')
const Farmer = require('../models/Farmer.model')

exports.apply = async (req, res) => {
    try {
        const { loanId, purpose, landArea, income } = req.body
        const documents = req.files?.map(f => ({ filename: f.originalname, path: f.path })) || []
        const app = await LoanApplication.create({ farmerId: req.user.id, loanId, purpose, landArea, income, documents })
        res.status(201).json(app)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getApplications = async (req, res) => {
    try {
        const apps = await LoanApplication.find()
            .populate('farmerId', 'name phone email')
            .populate('loanId', 'title type interestRate amount')
            .sort({ createdAt: -1 })
        res.json(apps)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getMyApplications = async (req, res) => {
    try {
        const apps = await LoanApplication.find({ farmerId: req.user.id })
            .populate('loanId', 'title type amount interestRate tenure').sort({ createdAt: -1 })
        res.json(apps)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const app = await LoanApplication.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
            .populate('farmerId', 'name phone')
            .populate('loanId', 'title')
        res.json(app)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.acceptApplication = async (req, res) => {
    try {
        const app = await LoanApplication.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true })
            .populate('farmerId', 'name phone')
            .populate('loanId', 'title')
        if (!app) return res.status(404).json({ message: 'Application not found.' })
        res.json({ message: 'Application approved.', app })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.rejectApplication = async (req, res) => {
    try {
        const app = await LoanApplication.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true })
            .populate('farmerId', 'name phone')
            .populate('loanId', 'title')
        if (!app) return res.status(404).json({ message: 'Application not found.' })
        res.json({ message: 'Application rejected.', app })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Financier: view all applications grouped by farmer
exports.getFarmerLoans = async (req, res) => {
    try {
        const apps = await LoanApplication.find()
            .populate('farmerId', 'name phone email location')
            .populate('loanId', 'title type amount interestRate tenure')
            .sort({ createdAt: -1 })
        // Group by farmer
        const grouped = {}
        apps.forEach(app => {
            const fid = app.farmerId?._id?.toString() || 'unknown'
            if (!grouped[fid]) {
                grouped[fid] = { farmer: app.farmerId, applications: [] }
            }
            grouped[fid].applications.push(app)
        })
        res.json(Object.values(grouped))
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
