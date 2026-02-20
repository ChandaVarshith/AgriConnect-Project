const mongoose = require('mongoose')
const { Schema } = mongoose

const QuerySchema = new Schema({
    farmerId: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true },
    expertId: { type: Schema.Types.ObjectId, ref: 'Expert', default: null },
    cropType: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('Query', QuerySchema)
