'use strict'

const express = require('express');
const uploadCtrl = require('../controllers/upload');
const api = express.Router();
const fileUpload = require('express-fileupload');

api.use(fileUpload());

api.put('/uploadImage/:id', uploadCtrl.saveImage);

module.exports = api;