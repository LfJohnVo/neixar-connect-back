'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const monthly_eva = Schema({
    month: String,
    percentage: Number,
    description: String, // Sirve para poner la descripción del avance de los objetivos
});

const ObjectiveSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['ESTRATÉGICO', 'TÁCTICO', 'OPERATIVO'], required: [true, 'Definir el tipo de objetivo es necesario.'] }, // Est-Organizacional, Tác-Área, Ope-Personal
    description: { type: String, required: [true, 'La descripción es necesaria.'] },
    evidence: String,
    acceptance_criteria: { type: String, required: [true, 'Definir el criterio de aceptación es necesario.'] },
    commitment_date: { type: Date, required: [true, 'La fecha compromiso es necesaria.'] }, // Fecha compromiso
    period: { type: String, required: [true, 'El periodo es necesario.'] },
    level_reached: { type: String, enum: ['INACEPTABLE', 'MÍNIMO ACEPTABLE', 'ACEPTABLE', 'SOBRESALIENTE', 'EXCEPCIONAL'] },
    evaluation: [monthly_eva],
    validated: { type: Boolean, required: true, default: false },
    total: Number
});

module.exports = mongoose.model('Objective', ObjectiveSchema);