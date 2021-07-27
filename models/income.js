'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncomeSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: [true, 'El usuario es necesario.'] },
    date: { type: Date, required: [true, 'La fecha es necesaria.'] },
    amount: { type: Number, required: [true, 'La cantidad es necesaria.'] },
    description: { type: String, required: [true, 'La descripción es necesaria.'] }
});

module.exports = mongoose.model('Income', IncomeSchema);