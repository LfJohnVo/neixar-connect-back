'use strict'

const express = require('express');
const objectiveCtrl = require('../controllers/nxrobjective');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.get('/nxrobjectives/:user/:period/:page?', md_auth, objectiveCtrl.getObjectives); //Obtener objetivos por usuario y periodo
api.get('/nxrstatus/:user/:period', md_auth, objectiveCtrl.getStatus); // Por estatus (validated: true o false)
api.get('/nxrobjective/:id', md_auth, objectiveCtrl.getObjective); //Obtener el objetivo
api.put('/nxrobjective/:id', md_auth, objectiveCtrl.updateObj); //Editar objetivos
api.post('/objectives', md_auth, objectiveCtrl.store); //Crear objetivos
api.delete('/objectives/:id', md_auth, objectiveCtrl.deleteObjs); //Eliminar objetivos
api.put('/nxrvalidateObjs/:id', md_auth, objectiveCtrl.validateObjs); //Valida el jefe inmediato que los objs estén correctos
api.put('/nxrvalidate/:id', md_auth, objectiveCtrl.validate); //Valida el jefe inmediato
api.put('/nxrprogress/:id', md_auth, objectiveCtrl.updateProgress); // Actualiza avance mensual

module.exports = api;