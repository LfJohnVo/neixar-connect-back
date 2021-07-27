'use strict'

const express = require('express');
const objectiveCtrl = require('../controllers/ncobjective');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.post('/ncobjectives', md_auth, objectiveCtrl.store); //Crear objetivos
api.get('/ncobjectives/:type?/:page?', md_auth, objectiveCtrl.getObjectivesByType); //Obtener objetivos por typo

module.exports = api;