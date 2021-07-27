'use strict'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const AreaSchema = Schema({
    name: { type: String, unique: true, uppercase: true, required: [true, 'El nombre es necesario.'] },
    responsible: { type: Schema.ObjectId, ref: 'User' }
});

AreaSchema.plugin(uniqueValidator, { message: 'Esta área ya está registrada.' });

module.exports = mongoose.model('Area', AreaSchema);