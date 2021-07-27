'use strict'

const express = require('express');
const nxr360evaluationCtrl = require('../controllers/nxr360evaluation');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.post('/nxr360evaluation', nxr360evaluationCtrl.assignmentOfCollaboratorsToEvaluate);
api.get('/getCollaboratorsToEvaluate/:userId/:year/:page?', nxr360evaluationCtrl.getCollaboratorsToEvaluate);
api.get('/getCollaboratorsWhoWillEvaluateMe/:userId/:year/:page?', nxr360evaluationCtrl.getCollaboratorsWhoWillEvaluateMe);

module.exports = api;