const mongoose = require('mongoose')
const { Schema } = mongoose

const ProduceSchema = new Schema({
    farmerId: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true },
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    price: { type: Number, required: true },
    images: [String],
    available: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Produce', ProduceSchema)
