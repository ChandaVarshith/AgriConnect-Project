const mongoose = require('mongoose')
const { Schema } = mongoose

const FarmerSchema = new Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    password: { type: String, required: true },
    language: { type: String, default: 'en' },
    preferredLanguage: { type: String, default: 'en' },
    location: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    farmSize: { type: String, trim: true },
    primaryCrops: { type: String, trim: true },
}, { timestamps: true })

module.exports = mongoose.model('Farmer', FarmerSchema)
