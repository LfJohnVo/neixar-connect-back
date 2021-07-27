'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receiver = Schema({
    receiver: {type: Schema.ObjectId, ref: 'User'},
    receiverEmail: String
})

const ConfigurationSchema = Schema({
    performanceEvaluation: {
        evaluationStartDate: String,
        evaluationEndDate: String,
        firstPEstartDate: String, //PE Performance Evaluation
        firstPEendDate: String,
        secondPEstartDate: String, //PE Performance Evaluation
        secondPEendDate: String,
        shortSecondPEstartDate: String,
        shortSecondPEendDate: String,
        ROstartDate: String, //RO Registration of Objectives
        ROendDate: String
    },
    jobDescription: {
        rhValidation: {type: Schema.ObjectId, ref: 'User'}
    },
    requisition: {
        rhValidation: {type: Schema.ObjectId, ref: 'User'},
        doValidation: {type: Schema.ObjectId, ref: 'User'},
        dfValidation: {type: Schema.ObjectId, ref: 'User'},
        allocators: [{allocatorId: {type: Schema.ObjectId, ref: 'User'}}],
        recruiters: [{recruiterId: {type: Schema.ObjectId, ref: 'User'}}]
    },
    receivers: [receiver]
})

module.exports = mongoose.model('Configuration', ConfigurationSchema);