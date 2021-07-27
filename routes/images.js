'use strict'

const express = require('express');
const imagesCtrl = require('../controllers/images');
const api = express.Router();

api.get('/image/:img', imagesCtrl.getImage);

module.exports = api;