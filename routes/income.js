'use strict'

const express = require('express');
const incomeCtrl = require('../controllers/income');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.get('/income/:id/:page?', md_auth, incomeCtrl.getIncome);
api.get('/deposit/:id', md_auth, incomeCtrl.getDeposit);
api.put('/deposit/:id', md_auth, incomeCtrl.updateInformation);
api.post('/deposit', md_auth, incomeCtrl.store);

module.exports = api;