const Query = require('../models/Query.model')

exports.createQuery = async (req, res) => {
    try {
        const { cropType, location, description, imageUrl } = req.body
        const query = await Query.create({ farmerId: req.user.id, cropType, location, description, imageUrl: imageUrl || null })
        res.status(201).json(query)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getMyQueries = async (req, res) => {
    try {
        const queries = await Query.find({ farmerId: req.user.id })
            .populate('expertId', 'name email')
            .sort({ createdAt: -1 })

        // Attach responseText from Response collection for resolved queries
        const Response = require('../models/Response.model')
        const Expert = require('../models/Expert.model')
        const queryIds = queries.map(q => q._id)
        const responses = await Response.find({ queryId: { $in: queryIds } })
            .populate('expertId', 'name email')

        // Map queryId -> response
        const responseMap = {}
        responses.forEach(r => { responseMap[r.queryId.toString()] = r })

        const enriched = queries.map(q => {
            const resp = responseMap[q._id.toString()]
            return {
                ...q.toObject(),
                responseText: resp?.responseText || null,
                expertEmail: resp?.expertId?.email || q.expertId?.email || null,
            }
        })

        res.json(enriched)
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
