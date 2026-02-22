const mongoose = require('mongoose')
const { Schema } = mongoose

const LoanSchema = new Schema({
    financierId: { type: Schema.Types.ObjectId, ref: 'Financier', required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['crop', 'equipment', 'kisan', 'agri'], default: 'crop' },
    amount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    tenure: { type: Number, required: true },   // months
    eligibility: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Loan', LoanSchema)
