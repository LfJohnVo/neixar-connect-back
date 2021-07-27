'use strict'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const illness_alergy = Schema({
    name: { type: String, uppercase: true },
    treatment: { type: String, uppercase: true },
});

const promotion = Schema({
    prev_position: { type: Schema.ObjectId, ref: 'Position' },
    new_position: { type: Schema.ObjectId, ref: 'Position' },
    prev_salary: Number,
    new_salary: Number,
    date: Date
});

const UserSchema = Schema({
    p_information: { // Información personal
        name: { type: String, uppercase: true, required: [true, 'El nombre es necesario.'] },
        firstSurname: { type: String, uppercase: true, required: [true, 'Los apellidos son necesarios.'] },
        secondSurname: { type: String, uppercase: true, required: [true, 'Los apellidos son necesarios.'] },
        ssn: { type: String, uppercase: true },
        marital_status: { type: String, enum: ['SOLTERO', 'CASADO', 'DIVORCIADO', 'UNIÓN LIBRE', 'VIUDO'] },
        gender: { type: String, enum: ['FEMENINO', 'MASCULINO'], required: [true, 'El género es necesario.'] },
        birthdate: Date,
        birthplace: { type: String, uppercase: true },
        nationality: { type: String, uppercase: true },
        rfc: { type: String, uppercase: true },
        curp: { type: String, uppercase: true },
        phone_number: String,
        address: { type: String, uppercase: true },
        illnesses: [illness_alergy],
        emergency_contact: {
            name: { type: String, uppercase: true, default: '' },
            phone_number: { type: String, default: '' }
        }
    },
    w_information: { // Información laboral        
        cost_center: String,
        position: { type: Schema.ObjectId, ref: 'Position' },
        area: { type: Schema.ObjectId, ref: 'Department' },
        status: { type: String, enum: ['ACTIVO', 'BAJA'], required: true, default: 'ACTIVO' },
        payroll_periodicity: { type: String, enum: ['QUINCENAL', 'MENSUAL'], required: true, default: 'QUINCENAL' },
        recruitment_scheme: { type: String, enum: ['MIXTO', 'SOLO IAS'], required: true, default: 'MIXTO' },
        admission_date: { type: Date, required: [true, 'La fecha de ingreso es necesaria.'] },
        contract_termination_date: Date,
        leaving_date: Date,
        contract_type: { type: String, enum: ['DETERMINADO', 'INDETERMINADO'], required: true },
        contract_renewal: { type: String, enum: ['S', 'N'] },
        leaving_cause: { type: String, enum: ['TERMINACIÓN DE CONTRATO', 'VOLUNTARIA', 'INDUCIDA'] },
        leaving_description: { type: String, enum: ['VOLUNTARIA', 'OTRO EMPLEO', 'BAJO DESEMPEÑO Y LIDERAZGO'] },
        immediate_boss: { type: Schema.ObjectId, ref: 'User' },
        hasPerformanceBonus: { type: Boolean, default: true },
        bonusRate: { type: Number, enum: [0.5, 1, 1.5, 2, 2.5, 3] } // 0.5-1 quincena, 1-1 mes, 1.5-3quincenas
    },
    f_information: { // Información financiera
        monthly_salary_saf: Number,
        daily_salary_saf: Number,
        amount_sdi_saf: Number,
        current_payer: { type: String, enum: ['NXR-COLMENARES', 'SEG. PRIVADA SAF - COLMENARES'] },
        total_settlement: Number,
        infonavit_num_credit: { type: String, uppercase: true },
        amount_descount_infonavit: Number, // Importe descuento INFONAVIT quincenal
        fonacot_num_credit: { type: String, uppercase: true },
        amount_descount_fonacot: Number, // Importe descuento FONACOT quincenal
        bank: { type: String, uppercase: true },
        bank_account: { type: String, uppercase: true },
        interbank_clabe: { type: String, uppercase: true },
        last_gross_salary: Number
    },
    promotions: [promotion],
    id_saf: { type: String, unique: true, uppercase: true, required: [true, 'El ID SAF es necesario.'] },
    id_neixar: { type: String, unique: true, uppercase: true, required: [true, 'El ID NEIXAR es necesario.'] },
    role: { type: String, enum: ['Admin', 'User'], required: true, default: 'User' },
    email: { type: String, unique: true, required: [true, 'El correo electrónico es necesario.'] },
    pass: { type: String, required: [true, 'La contraseña es necesaria.'] },
    passChanged: { type: Boolean, default: false },
    policiesAccepted: { type: Boolean, default: false },
    img: String
});

UserSchema.plugin(uniqueValidator, { message: 'El {PATH} ya está registrado.' });

module.exports = mongoose.model('User', UserSchema);