'use strict'

const express = require('express');
const competencyCtrl = require('../controllers/competition');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.post('/competency', md_auth, competencyCtrl.storeCompetencies);
api.get('/getCompetency/:id', md_auth, competencyCtrl.getCompetency);
api.get('/getCompetencies/:page?', md_auth, competencyCtrl.getCompetencies);
api.get('/getCompetenciesByTypePosition/:position', md_auth, competencyCtrl.getCompetenciesByTypePosition);
api.put('/updateCompetencies/:id', md_auth, competencyCtrl.updateCompetencies);

module.exports = api;