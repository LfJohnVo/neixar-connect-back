'use strict'

const express = require('express');
const positionCtrl = require('../controllers/position');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.get('/positions/:page?', md_auth, positionCtrl.getPositions);
api.get('/positionByDepto/:depto/:page?', md_auth, positionCtrl.getPositionsByDepto);
api.get('/position/:id', md_auth, positionCtrl.getPosition);
api.put('/position/:id', md_auth, positionCtrl.updateInformation);
api.post('/position', md_auth, positionCtrl.store);
api.post('/updateDP/:id', md_auth, positionCtrl.updateDP);
api.post('/storeDP/:id', md_auth, positionCtrl.storeDP);
api.get('/getDP/:id', md_auth, positionCtrl.getDP);
api.post('/deleteDP/:id', md_auth, positionCtrl.deleteDP);
api.put('/validatedDP/:id', md_auth, positionCtrl.validatedDP);
api.put('/statusDP/:id', md_auth, positionCtrl.statusDP);
api.put('/rejectedDP/:id', md_auth, positionCtrl.statusDPrejected);
api.get('/getDPByCreator/:id/:page?', md_auth, positionCtrl.getDpByCreator);
api.get('/toValidate/:page?', md_auth, positionCtrl.toValidate);
api.get('/getPositionsDpValidated/:page?', md_auth, positionCtrl.getPositionsDpValidated);

module.exports = api;