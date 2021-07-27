'use strict'

const express = require('express');
const evaluationCtrl = require('../controllers/nxrevaluation');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.get('/nxrevals/:year/:period/:page?', md_auth, evaluationCtrl.getEvaluations);
api.get('/nxreval/:id/:year/:period', md_auth, evaluationCtrl.getEvaluation); //Obtener la evaluación
api.get('/nxrevalHist/:page?', md_auth, evaluationCtrl.getEvalHistory);
api.get('/nxremployEval/:year/:period', md_auth, evaluationCtrl.getEmployeesEval);
api.get('/nxrEvalByEmp/:id/:year', md_auth, evaluationCtrl.getEvaluationsByEmpAndYear);
api.post('/nxreval', md_auth, evaluationCtrl.store); // Guardar evaluación

module.exports = api;