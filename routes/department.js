'use strict'

const express = require('express');
const deptoCtrl = require('../controllers/department');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.get('/deptos/:page?', md_auth, deptoCtrl.getDepartments);
api.get('/deptosByArea/:area/:page?', md_auth, deptoCtrl.getDepartmentsByArea);
api.get('/depto/:id', md_auth, deptoCtrl.getDepartment);
api.put('/depto/:id', md_auth, deptoCtrl.updateInformation);
api.post('/depto', md_auth, deptoCtrl.store);

module.exports = api;