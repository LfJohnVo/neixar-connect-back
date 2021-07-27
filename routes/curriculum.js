'use strict'

const express = require('express');
const curriculumCtrl = require('../controllers/curriculum');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.post('/curriculum', md_auth, curriculumCtrl.storeCurriculum);
api.put('/updateCurriculum/:id', md_auth, curriculumCtrl.updateCreateCurriculum);
api.get('/getCurriculum/:id', md_auth, curriculumCtrl.getCurriculum);
api.get('/searchKnowledge/:term/:page?', md_auth, curriculumCtrl.searchKnowledge);

module.exports = api;