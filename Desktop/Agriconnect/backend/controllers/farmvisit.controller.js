const FarmVisit = require('../models/FarmVisit.model')

exports.getVisits = async (req, res) => {
    try {
        const visits = await FarmVisit.find().sort({ date: 1 })
        res.json(visits)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.createVisit = async (req, res) => {
    try {
        const visit = await FarmVisit.create(req.body)
        res.status(201).json(visit)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const visit = await FarmVisit.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
        res.json(visit)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
