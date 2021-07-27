'use strict'

const express = require('express');
const objectiveCtrl = require('../controllers/objective');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.get('/objectives/:user/:period/:page?', md_auth, objectiveCtrl.getObjectives); //Obtener objetivos por usuario y periodo
api.get('/objective/:id', md_auth, objectiveCtrl.getObjective); //Obtener el objetivo
api.put('/objective/:id', md_auth, objectiveCtrl.updateInformation); //Editar objetivos
api.post('/objective', md_auth, objectiveCtrl.store); //Crear objetivos
api.put('/validate/:id', md_auth, objectiveCtrl.validate); //Valida el jefe inmediato
api.put('/progress/:id', md_auth, objectiveCtrl.updateProgress); // Actualiza avance mensual
api.get('/qualify/:user/:period', objectiveCtrl.qualify);
// api.put('/levelGranted/:id', objectiveCtrl.qualifyByUser); //Calcular el nivel alcanzado

module.exports = api;