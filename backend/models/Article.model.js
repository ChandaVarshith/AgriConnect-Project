const mongoose = require('mongoose')
const { Schema } = mongoose

const ArticleSchema = new Schema({
    expertId: { type: Schema.Types.ObjectId, ref: 'Expert', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: [String],
    category: { type: String, default: 'General' },
    imageUrl: { type: String },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('Article', ArticleSchema)
