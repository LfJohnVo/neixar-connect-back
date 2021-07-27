'use srtict'

const express = require('express');
const configurationCtrl = require('../controllers/configuration');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.post('/storeConfig', md_auth, configurationCtrl.storeConfig);
api.put('/updateConfig/:id', md_auth, configurationCtrl.updateConfig);
api.get('/getConfig', md_auth, configurationCtrl.getConfig);

module.exports = api;