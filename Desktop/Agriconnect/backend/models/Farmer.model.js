const mongoose = require('mongoose')
const { Schema } = mongoose

const FarmerSchema = new Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    language: { type: String, default: 'en' },
    location: { type: String, trim: true },
}, { timestamps: true })

module.exports = mongoose.model('Farmer', FarmerSchema)
