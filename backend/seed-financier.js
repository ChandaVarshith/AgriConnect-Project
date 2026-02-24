/**
 * seed-financier.js  –  Run once to create the financier account
 * Usage: node seed-financier.js
 */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Financier = require('./models/Financier.model')

const FINANCIER_EMAIL = 'financier@gmail.com'
const FINANCIER_PASS = 'financier'
const FINANCIER_ORG = 'AgriFinance Corp'

    ; (async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI)
            console.log('✅ Connected to MongoDB')

            // Remove any existing financier with same email first
            await Financier.deleteOne({ email: FINANCIER_EMAIL })

            const hashed = await bcrypt.hash(FINANCIER_PASS, 10)
            const financier = await Financier.create({
                orgName: FINANCIER_ORG,
                email: FINANCIER_EMAIL,
                password: hashed,
            })

            console.log('🎉 Financier created successfully!')
            console.log('   Email   :', financier.email)
            console.log('   Password: financier  (stored hashed)')
            console.log('   OrgName :', financier.orgName)
            console.log('   ID      :', financier._id)
        } catch (err) {
            console.error('❌ Error:', err.message)
        } finally {
            await mongoose.disconnect()
            console.log('🔌 Disconnected.')
        }
    })()
