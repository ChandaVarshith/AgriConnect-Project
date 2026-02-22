/**
 * seed-admin.js  –  Run once to create the admin account
 * Usage: node seed-admin.js
 */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Admin = require('./models/Admin.model')

const ADMIN_NAME = 'Varshith Chanda'
const ADMIN_EMAIL = 'varshithchanda91@gmail.com'
const ADMIN_PASS = '1234567890'

    ; (async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI)
            console.log('✅ Connected to MongoDB')

            // Remove any existing admin with same email first
            await Admin.deleteOne({ email: ADMIN_EMAIL })

            const hashed = await bcrypt.hash(ADMIN_PASS, 10)
            const admin = await Admin.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: hashed,
            })

            console.log('🎉 Admin created successfully!')
            console.log('   Email   :', admin.email)
            console.log('   Password: 1234567890  (stored hashed)')
            console.log('   ID      :', admin._id)
        } catch (err) {
            console.error('❌ Error:', err.message)
        } finally {
            await mongoose.disconnect()
            console.log('🔌 Disconnected.')
        }
    })()
