const mongoose = require('mongoose')
const { Schema } = mongoose

const ExpertSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    phone: { type: String, trim: true, default: '' },
    experience: { type: Number, default: 0 },       // years
    qualification: { type: String, trim: true, default: '' },
    languagesSpoken: { type: String, trim: true, default: '' },
    certifications: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Expert', ExpertSchema)
