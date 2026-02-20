const mongoose = require('mongoose')
const { Schema } = mongoose

const FinancierSchema = new Schema({
    orgName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    contact: { type: String },
    loanTypes: [{ type: Schema.Types.ObjectId, ref: 'Loan' }],
}, { timestamps: true })

module.exports = mongoose.model('Financier', FinancierSchema)
