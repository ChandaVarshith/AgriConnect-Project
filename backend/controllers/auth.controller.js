const Farmer = require('../models/Farmer.model')
const Expert = require('../models/Expert.model')
const Admin = require('../models/Admin.model')
const Financier = require('../models/Financier.model')
const OTP = require('../models/OTP.model')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../utils/generateToken')
const { generateOTP } = require('../utils/generateOTP')
const { sendEmail } = require('../utils/sendEmail')

// ── Farmer Registration ───
exports.registerFarmer = async (req, res) => {
    try {
        const { name, phone, password, language, location } = req.body
        const exists = await Farmer.findOne({ phone })
        if (exists) return res.status(400).json({ message: 'Phone already registered.' })
        const hashed = await bcrypt.hash(password, 10)
        const farmer = await Farmer.create({ name, phone, password: hashed, language, location })
        res.status(201).json({ message: 'Farmer registered.', farmer })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ── Expert Registration ───
exports.registerExpert = async (req, res) => {
    try {
        const { name, email, password, specialization } = req.body
        const exists = await Expert.findOne({ email })
        if (exists) return res.status(400).json({ message: 'Email already registered.' })
        const hashed = await bcrypt.hash(password, 10)
        await Expert.create({ name, email, password: hashed, specialization })
        res.status(201).json({ message: 'Expert registered. Awaiting admin approval.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ── Financier Registration ─
exports.registerFinancier = async (req, res) => {
    try {
        const { orgName, email, password, contact } = req.body
        const exists = await Financier.findOne({ email })
        if (exists) return res.status(400).json({ message: 'Email already registered.' })
        const hashed = await bcrypt.hash(password, 10)
        await Financier.create({ orgName, email, password: hashed, contact })
        res.status(201).json({ message: 'Financier registered. Awaiting admin approval.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// ── Login Helpers ─────────
const loginHelper = async (Model, identifier, identifierField, password, role, res) => {
    const user = await Model.findOne({ [identifierField]: identifier })
    if (!user) return res.status(401).json({ message: 'User not found.' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Invalid password.' })
    const token = generateToken(user._id, role)
    res.json({ token, role, user })
}

exports.loginFarmer = (req, res) => loginHelper(Farmer, req.body.identifier, 'phone', req.body.password, 'farmer', res)
exports.loginExpert = async (req, res) => {
    const expert = await Expert.findOne({ email: req.body.identifier })
    if (!expert) return res.status(401).json({ message: 'User not found.' })
    if (expert.status !== 'approved') return res.status(403).json({ message: 'Account not approved yet.' })
    const match = await bcrypt.compare(req.body.password, expert.password)
    if (!match) return res.status(401).json({ message: 'Invalid password.' })
    const token = generateToken(expert._id, 'expert')
    res.json({ token, role: 'expert', user: expert })
}
exports.loginAdmin = (req, res) => loginHelper(Admin, req.body.identifier, 'email', req.body.password, 'admin', res)
exports.loginFinancier = (req, res) => loginHelper(Financier, req.body.identifier, 'email', req.body.password, 'financier', res)

// ── OTP ───────────────────
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body
        const otpVal = generateOTP()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 min
        await OTP.findOneAndDelete({ email })
        await OTP.create({ email, otp: otpVal, expiresAt })
        await sendEmail(email, 'OTP for AgriConnect', `Your OTP is: ${otpVal}. Valid for 10 minutes.`)
        res.json({ message: 'OTP sent to email.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body
        const record = await OTP.findOne({ email, otp })
        if (!record) return res.status(400).json({ message: 'Invalid or expired OTP.' })
        if (new Date() > record.expiresAt) {
            await OTP.findByIdAndDelete(record._id)
            return res.status(400).json({ message: 'OTP has expired.' })
        }
        // OTP is valid — do NOT delete yet so registerExpert/Financier can proceed
        res.json({ message: 'OTP verified.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body
        const record = await OTP.findOne({ email, otp })
        if (!record) return res.status(400).json({ message: 'Invalid or expired OTP.' })
        const hashed = await bcrypt.hash(newPassword, 10)
        await Expert.findOneAndUpdate({ email }, { password: hashed })
        await OTP.findByIdAndDelete(record._id)
        res.json({ message: 'Password reset successfully.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
