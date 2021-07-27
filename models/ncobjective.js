'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NCObjectiveSchema = Schema({
    objective: { type: String, required: [true, 'El objetivo es necesario'] },
    process: { type: String, required: false },
    standard: { type: String, required: false },
    type: { type: String, required: [true, 'El tipo de objetivo es necesario'], enum: ['SGI', 'PROCESOS'] },
    status: { type: String, enum: ['ACTIVO', 'BAJA'], required: true, default: 'ACTIVO' }
});

module.exports = mongoose.model('NCObjective', NCObjectiveSchema);