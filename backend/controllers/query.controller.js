const Query = require('../models/Query.model')

exports.createQuery = async (req, res) => {
    try {
        const { cropType, location, description } = req.body
        const query = await Query.create({ farmerId: req.user.id, cropType, location, description })
        res.status(201).json(query)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getMyQueries = async (req, res) => {
    try {
        const queries = await Query.find({ farmerId: req.user.id })
            .populate('expertId', 'name')
            .sort({ createdAt: -1 })
        res.json(queries)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getAllQueries = async (req, res) => {
    try {
        const queries = await Query.find()
            .populate('farmerId', 'name phone location')
            .populate('expertId', 'name')
            .sort({ createdAt: -1 })
        res.json(queries)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getQueryById = async (req, res) => {
    try {
        const query = await Query.findById(req.params.id)
            .populate('farmerId', 'name phone location language')
            .populate('expertId', 'name')
        if (!query) return res.status(404).json({ message: 'Query not found.' })
        res.json(query)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.markResolved = async (req, res) => {
    try {
        const query = await Query.findByIdAndUpdate(req.params.id, { status: 'resolved' }, { new: true })
        res.json(query)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
