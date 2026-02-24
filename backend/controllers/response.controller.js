const Response = require('../models/Response.model')
const Query = require('../models/Query.model')

exports.submitResponse = async (req, res) => {
    try {
        const { responseText } = req.body
        const response = await Response.create({
            queryId: req.params.id, expertId: req.user.id, responseText
        })
        await Query.findByIdAndUpdate(req.params.id, { status: 'resolved', expertId: req.user.id })
        res.status(201).json(response)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getQueryResponses = async (req, res) => {
    try {
        const responses = await Response.find({ queryId: req.params.id })
            .populate('expertId', 'name specialization')
            .sort({ createdAt: -1 })
        res.json(responses)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getExpertResponses = async (req, res) => {
    try {
        const responses = await Response.find({ expertId: req.user.id })
            .populate({
                path: 'queryId',
                populate: { path: 'farmerId', select: 'name phone email' }
            })
            .sort({ createdAt: -1 })
        res.json(responses)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
