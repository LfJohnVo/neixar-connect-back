'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interview = Schema({
    interviewer: {type: Schema.ObjectId, ref: 'User'},
    interviewerName: String,
    interviewDate: Date,
    technical_Knowledge: String,
    strengths: [{type: String}],
    areasOfOpportunity: [{type: String}],
    competencies:[{
        timeManagement: Number,
        teamwork: Number,
        analysisAndSynthesis: Number,
        communicationAndInfluence: Number,
        decisionMaking: Number
    }],
    evaluationResult: String,
    approvedEvaluation: { type: String, enum: ['Sí', 'No'] },
    acceptedCandidate: { type: String, enum: ['Sí', 'No'] },
    justification: String

})

const candidate = Schema({
    candidate: {type: Schema.ObjectId, ref: 'Candidate'},
    date_assignment: { type: Date, default: Date.now},
    initialInterview: String,
    initialInterview_date: Date,
    technicalTest: String,
    technicalTest_date: Date,
    interviews: [interview],
    interviews_date: Date,
    psychometricTest: String,
    psychometricTest_date: Date,
    economicProposal: String,
    economicProposal_date: Date,
    admission_date: Date,
    id_neixar: Number,
    status: { type: String, enum: ['Declinado', 'Rechazado', 'En proceso', 'Aprobado'], default: 'En proceso'},
    justification: String,
    candidateRejection_date: Date,
    stage: { type: String, enum: ['Entrevista Inicial', 'Prueba Técnica', 'Entrevista Líder', 'Prueba Psicométrica', 'Propuesta Económica', 'Firma de Contrato'], default: 'Entrevista Inicial' }
})

const RecruitmentSchema = Schema({
    date_recruitment : { type: Date, default: Date.now},
    deadline: Date,
    position: {
        positionId: {type: Schema.ObjectId, ref: 'Position', required: [true, 'La posición es necesaria']},
        positionName: {type: String, required: [true, 'El nombre de la posición es necesario']},
        positionType: { type: String, enum: ['Estratégico', 'Táctico', 'Operativo'] }
    },
    job_description: {
        job_descriptionId: { type: Schema.ObjectId, ref: 'Position', required: [true, 'El ID de la DP es necesaria']},
        job_descriptionName: { type: String, required: [true, 'La versión de la DP es necesaria']}
    },
    petitioner: {
        petitionerId: {type: Schema.ObjectId, ref: 'User', required: [true, 'El solicitante es necesario.']},
        petitionerName: {type: String, required: [true, 'El nombre es necesario']},
        petitionerPosition: {type: String, required: [true, 'La posición es necesaria.']},
        petitionerDepartment: {type: String, required: [true, 'El departamento es necesario.']}
    },
    contract:{
        type: {type: String, enum: ['Indeterminado', 'Determinado', 'Proyecto'], required: [true, 'El tipo de contrato es necesario.']},
        period: Number
    },
    work_shift: {type: String, enum: ['Completa', 'Rolar'], required: [true, 'El turno es necesario.']},
    technical_test: {type: Boolean, default: true},
    vacancies: {type:Number, required: [true, 'El número de plazas es necesario.']},
    salary: {type: String, required: [true, 'El salario es necesario.']},
    causes: {type: String, enum: ['Reemplazo', 'Proyecto', 'Puesto nuevo', 'Otras'], required: [true, 'Las causas son necesarias.']},
    specific_cause: String,
    gender: {type: String, enum: ['Masculino', 'Femenino', 'Indistinto'], required: [true, 'El género es necesario']},
    passport: {type: Boolean, default: false},
    age: {type: String, required: [true, 'El rango de edad es necesario.']},
    travel: {type: Boolean, default: false},
    change_home: {type: Boolean, default: false},
    equipment: { type: String, enum: ['Nivel 1', 'Nivel 2', 'Nivel 3'], required: [true, 'El nivel del equipo es necesario']},
    software: {type: String, required: [true, 'El software es necesario']},
    email: {type: String, enum: ['com', 'mx'], required: [true, 'La extención del correo es necesaria']},
    mobile: {type: Boolean, default: false},
    phone_service: {type: String, enum: ['Básico', 'Intermedio']},
    access_card: {type: Boolean, default: false},
    systems_to_use: String,
    access_type: String,
    comments: String,
    status: { type: String, enum: ['Pendiente', 'Aprobada', 'En proceso', 'Rechazada', 'Cubierta', 'Vencida', 'Cerrada'], default: 'Pendiente' },
    vacancyCover_date: Date,
    approvals: {
        do: { type: Boolean, default: false },
        date_do: Date,
        do_name: String,
        daf: { type: Boolean, default: false },
        date_daf: Date,
        daf_name: String,
        dt: { type: Boolean, default: false },
        date_dt: Date,
        dt_name: String
    },
    rejectionComments: String,
    vacancyRejected_date: Date,
    closingReasons: String,
    vacancyClosing_date: Date,
    resetComments: String,
    resetVacancy_date: Date,
    area_leader: {
        areaLeaderId: {type: Schema.ObjectId, ref: 'User'},
        areaLeaderName: String,
        areaLeaderEmail: String,
        areaLeaderPosition: String
    },
    recruiter: {type: Schema.ObjectId, ref: 'User'},
    receptionDate: Date,
    deadline: Date,
    allocator: String,
    interviewers: [{
        interviewer: {type: Schema.ObjectId, ref: 'User'},
        interviewerName: String,
        interviewerPosition: String,
    }],
    candidates: [candidate]
});

module.exports = mongoose.model('Recruitment', RecruitmentSchema);