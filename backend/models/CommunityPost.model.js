const mongoose = require('mongoose')
const { Schema } = mongoose

const CommunityPostSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    userType: { type: String, enum: ['farmer', 'expert', 'public'] },
    content: { type: String, required: true },
    type: { type: String, default: 'tip' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
}, { timestamps: true })

module.exports = mongoose.model('CommunityPost', CommunityPostSchema)
