const mongoose = require('mongoose')
const { Schema } = mongoose

const ExpertSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Expert', ExpertSchema)
