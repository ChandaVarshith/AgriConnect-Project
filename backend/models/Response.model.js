const mongoose = require('mongoose')
const { Schema } = mongoose

const ResponseSchema = new Schema({
    queryId: { type: Schema.Types.ObjectId, ref: 'Query', required: true },
    expertId: { type: Schema.Types.ObjectId, ref: 'Expert', required: true },
    responseText: { type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model('Response', ResponseSchema)
