'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var values = Schema({
    value: { type: String, required: true, enum: ['red', 'yellow', 'green'] },
    min: { type: Number, required: [true, 'Debe de existir un valor mínimo del rango'] },
    max: { type: Number, required: [true, 'Debe de existir un valor máximo del rango'] },
});

const NCIndicatorSchema = Schema({
    objective: {
        objective: { type: String, required: [true, 'El objetivo es necesario'] },
        process: { type: String, required: false },
        standard: { type: String, required: false }
    },
    type: { type: String, required: [true, 'El tipo de objetivo es necesario'], enum: ['SGI', 'PROCESOS'] },
    indicator: { type: String, required: [true, 'El indicador es necesario'] },
    year: { type: String, required: [true, 'El responsable es necesario'] },
    responsable: { type: Schema.ObjectId, ref: 'User', required: [true, 'El responsable es necesario'] },
    frecuency: { type: String, required: [true, 'La frecuancia es necesaria'], enum: ['Mensual', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'] },
    formula: { type: String, required: false },
    goal: { type: String, required: [true, 'La meta es necesaria'] },
    trafficLight: [values],
    months: [Number],
    status: { type: String, required: true, default: 'ACTIVO', enum: ['ACTIVO', 'BAJA'] }
});

module.exports = mongoose.model('NCIndicator', NCIndicatorSchema);