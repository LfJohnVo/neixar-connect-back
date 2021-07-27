'use strict'

const express = require('express');
const indicatorCtrl = require('../controllers/ncindicator');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.post('/ncindicators', md_auth, indicatorCtrl.store);
api.get('/ncindicator/:id', md_auth, indicatorCtrl.getIndicator);
api.get('/ncindicatorsByType/:type/:year/:page?', md_auth, indicatorCtrl.getIndicatorsByType);
api.get('/ncindicatorsByTypeResponsable/:type/:responsable/:year/:page?', md_auth, indicatorCtrl.getIndicatorsByTypeAndResponsible);
api.get('/ncindicatorsYears', md_auth, indicatorCtrl.getYears);
api.put('/ncindicator/:id', md_auth, indicatorCtrl.updateIndicator);
api.put('/ncindicatorDelete/:id', md_auth, indicatorCtrl.deleteIndicator);
api.get('/ncresponsables/:year?', md_auth, indicatorCtrl.getResponsables);
api.get('/ncprocesses/:year', md_auth, indicatorCtrl.getProcesses);
api.get('/ncEvaluationsByResponsable/:year/:type/:id?', md_auth, indicatorCtrl.getEvaluationByResponsable);
api.get('/ncEvaluationsByProcess/:year/:process', md_auth, indicatorCtrl.getEvaluationByProcess);
api.get('/ncAverageByProcess/:year', md_auth, indicatorCtrl.getAverageByProcess);

module.exports = api;