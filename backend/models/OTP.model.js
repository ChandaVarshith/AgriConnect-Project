const mongoose = require('mongoose')
const { Schema } = mongoose

const OTPSchema = new Schema({
    email: { type: String, required: true, lowercase: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true })

module.exports = mongoose.model('OTP', OTPSchema)
