const mongoose = require('mongoose')
const { Schema } = mongoose

const ProduceSchema = new Schema({
    farmerId: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    category: { type: String, default: 'other' },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    price: { type: Number, required: true },
    images: [String],
    // Expert approval status
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    available: { type: Boolean, default: false },
    // Rejection reason from expert
    rejectionReason: { type: String, default: '' },
    rejectedByEmail: { type: String, default: '' },
    // Cached farmer contact for public reveal on purchase
    farmerName: { type: String, default: '' },
    farmerPhone: { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('Produce', ProduceSchema)
