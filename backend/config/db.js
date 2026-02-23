const mongoose = require('mongoose')

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.warn('⚠️  MONGO_URI not set — skipping MongoDB connection (development).')
        return
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`✅ MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`)
        // Don't abruptly exit in non-production environments so dev server can still run.
        if (process.env.NODE_ENV === 'production') {
            process.exit(1)
        }
    }
}

module.exports = connectDB
