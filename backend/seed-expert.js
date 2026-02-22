/**
 * seed-expert.js  –  Run once to create an approved expert account
 * Usage: node seed-expert.js
 */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Expert = require('./models/Expert.model')

const EXPERT_NAME = 'Expert User'
const EXPERT_EMAIL = 'expert@gmail.com'
const EXPERT_PASS = 'expert'
const EXPERT_SPECIALIZATION = 'Agronomy'

    ; (async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI)
            console.log('✅ Connected to MongoDB')

            await Expert.deleteOne({ email: EXPERT_EMAIL })

            const hashed = await bcrypt.hash(EXPERT_PASS, 10)
            const expert = await Expert.create({
                name: EXPERT_NAME,
                email: EXPERT_EMAIL,
                password: hashed,
                specialization: EXPERT_SPECIALIZATION,
                status: 'approved',   // pre-approved so login works immediately
            })

            console.log('🎉 Expert created successfully!')
            console.log('   Email         :', expert.email)
            console.log('   Password      : expert  (stored hashed)')
            console.log('   Specialization:', expert.specialization)
            console.log('   Status        :', expert.status)
            console.log('   ID            :', expert._id)
        } catch (err) {
            console.error('❌ Error:', err.message)
        } finally {
            await mongoose.disconnect()
            console.log('🔌 Disconnected.')
        }
    })()
