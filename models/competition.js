'ue strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const definition = Schema({
    question: String,
    level: { type: String, enum: ['Básico', 'Medio', 'Avanzado', 'Experto']}
});

const CompetencySchema = Schema({
    competency: String,
    questions: [definition],
    description: String,
    type: { type: String, enum: ['Organizacionales', 'Específicas']},
    typePosition: [{ type: String, enum: ['Estratégico', 'Táctico', 'Operativo']}]
});

module.exports = mongoose.model('Competency', CompetencySchema);