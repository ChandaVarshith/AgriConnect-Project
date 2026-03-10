const mongoose = require('mongoose')
const { Schema } = mongoose

const OTPSchema = new Schema({
    email: { type: String, required: true, lowercase: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('OTP', OTPSchema)
