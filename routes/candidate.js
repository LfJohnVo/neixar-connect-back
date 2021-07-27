'use strict'

const express = require('express');
const candidateCtrl = require('../controllers/candidate');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.post('/candidates', md_auth, candidateCtrl.storeCandidates);
api.get('/getAllCandidates', md_auth, candidateCtrl.getAllCandidates);
api.get('/getCandidatesByRecruitment/:id', md_auth, candidateCtrl.getCandidatesByRecruitment);
api.get('/getCandidatesInPortfolio/:page?', md_auth, candidateCtrl.getCandidatesInPortfolio);
api.get('/getCandidatesToAssign/:page?', md_auth, candidateCtrl.getCandidatesToAssign);
api.get('/getCandidates/:page?', md_auth, candidateCtrl.listOfCandidates);
api.put('/candidateStatus/:id', md_auth, candidateCtrl.updateCandidateStatus);
api.get('/getCandidateInformation/:id', md_auth, candidateCtrl.getCandidateInfo);
api.put('/updateCandidateInfo/:id', md_auth, candidateCtrl.updateCandidate);

module.exports = api;