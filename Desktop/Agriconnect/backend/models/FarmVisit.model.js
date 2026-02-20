const mongoose = require('mongoose')
const { Schema } = mongoose

const FarmVisitSchema = new Schema({
    visitorName: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, required: true },
    message: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('FarmVisit', FarmVisitSchema)
