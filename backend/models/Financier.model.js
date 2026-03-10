const mongoose = require('mongoose')
const { Schema } = mongoose

const FinancierSchema = new Schema({
    name: { type: String, trim: true, default: '' },
    orgName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    contact: { type: String },
    location: { type: String, trim: true, default: '' },
    loanTypes: [{ type: Schema.Types.ObjectId, ref: 'Loan' }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true })

module.exports = mongoose.model('Financier', FinancierSchema)

