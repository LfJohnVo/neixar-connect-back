'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const objective = Schema({
    description: String,
    acceptance_criteria: String,
    expected_result: String,
    commitment_date: Date,
    weighing: Number,
    progress: Number, // Almacena el valor del progreso actual del objetivo
    progress1: Number, // Almacena el valor de la evaluación 1 para tener un respaldo de ese valor
    progress_description: String,
    progress_description2: String,
    validated: { type: Boolean, required: true, default: false },
    validated2: { type: Boolean, default: false },
    registered: { type: Boolean, default: false },
    registered2: { type: Boolean, default: false }
});

const NXRObjectiveSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    year: { type: String, required: [true, 'El año de validez es necesario.'] },
    status: { type: String, enum: ['ACTIVO', 'BAJA'], required: true, default: 'ACTIVO' },
    objectives: [objective],
    validated: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('NXRObjective', NXRObjectiveSchema);