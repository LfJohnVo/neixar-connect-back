'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const description = Schema({
    immediate_boss: { type: Schema.ObjectId, ref: 'Position' },
    subordinates: [{ position: { type: Schema.ObjectId, ref: 'Position' } }],
    mission: { type: String, required: [true, 'La misión del puesto es necesaria'] },
    responsabilities: [{
        responsability: String,
        weighing: String,
        kpi: String,
        functionsDescription: [{
            function: String,
            authority: String,
            interaction: String
        }]
    }],
    desirableEducation: String,
    minimumEducation: String,
    minimumEnglish: String,
    desirableEnglish: String,
    experience: [{
        minimumRequire: String,
        timeRequire: String,
        desirable: String,
        timeDesirable: String
    }],
    softwareAndTools: [{
        minimumKnowledge: String,
        levelOfKnowledge: { type: String, enum: ['Sin experiencia', 'Básico', 'Medio', 'Avanzado', 'Experto'] },
        desirableKnowledge: String,
        levelDesirable: { type: String, enum: ['Sin experiencia', 'Básico', 'Medio', 'Avanzado', 'Experto'] }
    }],
    organizationalCompetencies: [{
        competition: {type: Schema.ObjectId, ref: 'Competency'},
        level: { type: String, enum: ['N/A', 'Básico', 'Medio', 'Avanzado', 'Experto'] }
    }],
    specificCompetencies: [{
        competition: {type: Schema.ObjectId, ref: 'Competency'},
        level: { type: String, enum: ['N/A', 'Básico', 'Medio', 'Avanzado', 'Experto'] }
    }],
    elaboratedBy: { type: Schema.ObjectId, ref: 'User' },
    elaborationDate: { type: Date, default: Date.now },
    type: { type: String, enum: ['Nueva versión', 'Nueva creación'] },
    status: { type: String, enum: ['En revisión', 'Rechazada', 'Cambios', 'Vigente', 'No vigente'], default: 'En revisión' },
    version: { type: String, required: [true, 'La versión es necesaria'] },
    validatedRH: { type: Boolean, default: false },
    validationDate: Date,
    validator: String,
    rejectionDate: Date,
    rejectionComments: String
});

const PositionSchema = Schema({
    name: { type: String, uppercase: true, required: [true, 'El nombre es necesario.'] },
    department: { type: Schema.ObjectId, ref: 'Department', required: [true, 'El departamento es necesario.'] },
    level: String,
    type: { type: String, enum: ['Estratégico', 'Táctico', 'Operativo'] },
    career_key: String,
    job_key: String,
    specialty: String,
    mintzberg: String,
    salary: String,
    jobDescription: [description]
});

module.exports = mongoose.model('Position', PositionSchema);