'use strict'

const express = require('express');
const areaCtrl = require('../controllers/area');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.get('/areas/:page?', md_auth, areaCtrl.getAreas);
api.get('/area/:id', md_auth, areaCtrl.getArea);
api.put('/area/:id', md_auth, areaCtrl.updateInformation);
api.post('/area', md_auth, areaCtrl.store);

module.exports = api;