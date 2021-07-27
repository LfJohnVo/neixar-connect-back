'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CandidateSchema = Schema({
    candidate_date: {type: Date, default: Date.now},
    name: {type: String, uppercase: true, required: [true, 'El nombre es necesario.']},
    firstSurname: { type: String, uppercase: true, required: [true, 'Los apellidos son necesarios.'] },
    secondSurname: { type: String, uppercase: true, required: [true, 'Los apellidos son necesarios.'] },
    birthdate: {type: Date, required: [true, 'La fecha de cumpleaños es necesaria']},
    phone_number: {type: String, required: [true, 'El número telefónico es necesario']},
    email: {type: String, required: [true, 'El correo electrónico es necesario']},
    address: {type: String, required: [true, 'La dirección es necesaria']},
    marital_status: {type: String, enum: ['SOLTERO', 'CASADO', 'DIVORCIADO', 'UNIÓN LIBRE', 'VIUDO'], required: [true, 'El estado civil es necesario']},
    scholarship: {type: String, required: [true, 'La escolaridad es necesaria']},
    courses: {type: String, required: [true, 'Los cursos son necesarios']},
    english_level: {type: String, required: [true, 'El nivel de ingles es necesario']},
    certification: {type: Boolean, default: false},
    economic_claims: {type: String, required: [true, 'La pretensión económica es necesaria']},
    source: {type: String, required: [true, 'La fuente es necesaria']},
    gender: { type: String, enum: ['FEMENINO', 'MASCULINO'], required: [true, 'El género es necesario.'] },
    status: {type: String, enum: ['En proceso', 'Nuevo', 'Cartera', 'Rechazado', 'Contratado'], default: 'Nuevo'}
});

module.exports = mongoose.model('Candidate', CandidateSchema);