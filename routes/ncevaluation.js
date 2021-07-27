'use strict'

const express = require('express');
const evaluationCtrl = require('../controllers/ncevaluation');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.post('/ncEvaluation', md_auth, evaluationCtrl.store);
api.get('/ncEvaluation/:year/:id?', md_auth, evaluationCtrl.getEvaluation);
api.put('/ncEvaluationProgress/:month', md_auth, evaluationCtrl.putProgressEvaluation);
api.put('/ncEvaluationValidated/:month/:indicator', md_auth, evaluationCtrl.putValidatedProgress);
// api.get('/ncEvaluationsByTypeResponsable/:type/:responsable/:page?', md_auth, evaluationCtrl.getIndicatorsByTypeAndResponsible);
// api.put('/ncEvaluation/:id', md_auth, evaluationCtrl.updateIndicator);
// api.put('/ncEvaluationDelete/:id', md_auth, evaluationCtrl.deleteIndicator);

module.exports = api;