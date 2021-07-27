'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const person = Schema({
    evaluatedId: {type: Schema.ObjectId, ref: 'User'},
    relationship: {type: String, enum: ['Auto', 'Par', 'Jefe', 'Linea']},
    scores: [Number],
    evaluated: { type: Boolean, required: false, default: false }
});

const NXR360EvaluationSchema = Schema({
    year: String,
    evaluator: {type: Schema.ObjectId, ref: 'User'},
    toEvaluated:[person]
});

module.exports = mongoose.model('NXR360Evaluation', NXR360EvaluationSchema);