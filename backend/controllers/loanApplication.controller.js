const LoanApplication = require('../models/LoanApplication.model')

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
            .populate('farmerId', 'name phone')
            .populate('loanId', 'title type')
            .sort({ createdAt: -1 })
        res.json(apps)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getMyApplications = async (req, res) => {
    try {
        const apps = await LoanApplication.find({ farmerId: req.user.id })
            .populate('loanId', 'title type amount').sort({ createdAt: -1 })
        res.json(apps)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const app = await LoanApplication.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
        res.json(app)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
