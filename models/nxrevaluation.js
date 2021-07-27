'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NXREvaluationSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    period: { type: String, uppercase: true },
    year: String,
    total: Number,
    date: Date,
    amount: Number,
    trafficLight: String,
    color: String
});

module.exports = mongoose.model('NXREvaluation', NXREvaluationSchema);