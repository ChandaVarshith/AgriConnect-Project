/**
 * seed-public.js  –  Run once to create the public user account
 * Usage: node seed-public.js
 */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const PublicUser = require('./models/PublicUser.model')

const PUBLIC_NAME = 'Public User'
const PUBLIC_EMAIL = 'public@gmail.com'
const PUBLIC_PASS = 'public'

    ; (async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI)
            console.log('✅ Connected to MongoDB')

            // Remove any existing public user with same email first
            await PublicUser.deleteOne({ email: PUBLIC_EMAIL })

            const hashed = await bcrypt.hash(PUBLIC_PASS, 10)
            const user = await PublicUser.create({
                name: PUBLIC_NAME,
                email: PUBLIC_EMAIL,
                password: hashed,
            })

            console.log('🎉 Public user created successfully!')
            console.log('   Email   :', user.email)
            console.log('   Password: public  (stored hashed)')
            console.log('   Name    :', user.name)
            console.log('   ID      :', user._id)
        } catch (err) {
            console.error('❌ Error:', err.message)
        } finally {
            await mongoose.disconnect()
            console.log('🔌 Disconnected.')
        }
    })()
