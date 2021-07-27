'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var evaluation = Schema({
    month: { type: String, required: [true, 'El mes es necesario'], enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
    progress: Number,
    color: String,
    evidence: String,
    action: { type: String, required: false },
    commitmentDate: { type: Date, required: false },
    validated: { type: Boolean, required: true, default: false },
    responsable: { type: Schema.ObjectId, ref: 'User' },
    evaluationDate: Date,
    registered: { type: Boolean, required: true, default: false }
});

const NCEvaluationSchema = Schema({
    indicator: { type: Schema.ObjectId, ref: 'NCIndicator', required: [true, 'El indicador es necesario'] },
    year: { type: Number, required: [true, 'El año es necesario'] },
    evaluations: [evaluation],
    average: { type: Number, required: false }
});

module.exports = mongoose.model('NCEvaluation', NCEvaluationSchema);