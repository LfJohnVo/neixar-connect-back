'use strict'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const DepartmentSchema = Schema({
    name: { type: String, unique: true, uppercase: true, required: [true, 'El nombre es necesario.'] },
    //cost_center: { type: String, required: [true, 'El centro de costo es necesario.'], unique: true },
    responsible: { type: Schema.ObjectId, ref: 'User' },
    area: { type: Schema.ObjectId, ref: 'Area', required: [true, 'El área es necesaria.'] }
});

DepartmentSchema.plugin(uniqueValidator, { message: 'Este departamento ya está registrado.' });

module.exports = mongoose.model('Department', DepartmentSchema);