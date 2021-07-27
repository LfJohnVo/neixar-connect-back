'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const certification = Schema({
    name: { type: String, required: true },
    active: { type: Boolean, required: true } 
});

const course = Schema({
    name: { type: String, required: true },
    studies_proof: { type: String, enum: ['Ninguno', 'Constancia', 'Diploma'], required: true } 
});

const language = Schema({
    name: { type: String, required: true },
    level: { type: String, enum: ['Básico', 'Intermedio', 'Avanzado'], required: true }
});

const job = Schema({
    job_name: { type: String, required: true },
    job_position: {type: String, required: true },
    period: { type: String, required: true },
    activities: [
        { activity:{type: String, required: true } }
    ]
});

const CurriculumSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    name: { type: String, uppercase: true, required: true },
    position: { type: String, uppercase: true, required: true },
    overview: {type: String, required: true },
    education:{
        career: { type: String, required: true },   
        school: { type: String, required: true },
        certified: { type: Boolean, required: true },
        professional_license: { type: String }
    },
    certifications: [certification],
    courses: [course],
    soft_skills: [
        { ability: { type: String, required: true } }
    ],
    technical_abilities: [
        { ability: { type: String, required: true } }
    ],
    languages: [language],
    working_experience: [job],
    creation_date: Date,
    last_modification: Date
});

module.exports = mongoose.model('Curriculum', CurriculumSchema);