const mongoose = require('mongoose')
const { Schema } = mongoose

const LoanApplicationSchema = new Schema({
    farmerId: { type: Schema.Types.ObjectId, ref: 'Farmer', required: true },
    loanId: { type: Schema.Types.ObjectId, ref: 'Loan', required: true },
    purpose: { type: String },
    landArea: { type: Number },
    income: { type: Number },
    documents: [{ filename: String, path: String }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('LoanApplication', LoanApplicationSchema)
