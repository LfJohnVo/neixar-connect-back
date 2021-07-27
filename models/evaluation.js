'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EvaluationSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    period: { type: String, uppercase: true },
    strategic: number,
    tactical: number,
    operational: number,
    total: number,
    level_reached: { type: String, enum: ['INACEPTABLE', 'MÍNIMO ACEPTABLE', 'ACEPTABLE', 'SOBRESALIENTE', 'EXCEPCIONAL'] }
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);