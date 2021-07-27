'use strict'

const express = require('express');
const recruitmentCtrl = require('../controllers/recruitment');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.post('/recruitment', md_auth, recruitmentCtrl.store);
api.put('/validatedRecruitment/:id/:validator', md_auth, recruitmentCtrl.validated);
api.put('/statusUpdate/:id', md_auth, recruitmentCtrl.statusUpdate);
api.get('/recruitments/:id?', md_auth, recruitmentCtrl.getRecruitments);
api.put('/assignRecruiter/:id', md_auth, recruitmentCtrl.assignRecruiter);
api.put('/reassignRecruiter/:id', md_auth, recruitmentCtrl.reassignRecruiter);
api.get('/recruitmentsByRecruiter/:recruiter/:page?', md_auth, recruitmentCtrl.getRecruitmentsByRecruiter);
api.get('/recruitmentsByPetitioner/:petitioner/:page?', md_auth, recruitmentCtrl.getRecruitmentsByPetitioner);
api.post('/assignCandidate/:id', md_auth, recruitmentCtrl.assignCandidate);
api.post('/storeEvaluationsOfCandidate/:candidate', md_auth, recruitmentCtrl.storeEvaluationsOfCandidate);
api.post('/interviews/:id/:candidate', md_auth, recruitmentCtrl.storeInterview);
api.get('/candidateInfo/:id', md_auth, recruitmentCtrl.getCandidateInfo);
api.get('/getRecruitmentsToValidate/:validator/:id/:page?/', md_auth, recruitmentCtrl.recruitmentsToValidate);
api.put('/updateRecruitment/:id', md_auth, recruitmentCtrl.updateRecruitment);
api.get('/getRecruitmentsToBeAssigned/:page?', md_auth, recruitmentCtrl.recruitmentsToBeAssigned);
api.put('/refuseRequisition/:id/:validator', md_auth, recruitmentCtrl.refuseRequisition);
api.get('/validatedLeaderOrValidator/:validatorId', md_auth, recruitmentCtrl.validatedLeaderOrValidator);
api.get('/currentRecruitments/:variable/:page?', md_auth, recruitmentCtrl.currentRecruitments);
api.get('/expiredRecruitments/:variable/:page?', md_auth, recruitmentCtrl.expiredRecruitments);
api.get('/recruitmentCovered/:variable/:page?', md_auth, recruitmentCtrl.recruitmentsCovered);
api.get('/recruitmentClosed/:page?', md_auth, recruitmentCtrl.recruitmentsClosed);
api.get('/recrutmentsStatus/:page?', md_auth, recruitmentCtrl.getRecruitmentsStatus);
api.get('/dashboardRecruitments/:id?', md_auth, recruitmentCtrl.recruitmentInfo);
api.get('/validatedInterviewer/:interviewerId', md_auth, recruitmentCtrl.validatedInterviewer);
api.get('/getCandidatesToInterview/:interviewerId', md_auth, recruitmentCtrl.getCandidatesToInterview);
api.put('/refuseCandidate/:recruitmentId/:candidateId', md_auth, recruitmentCtrl.refuseCandidate);
api.put('/approveCandidate/:recruitmentId/:candidateId', md_auth, recruitmentCtrl.approveCandidate);
api.put('/vacantCover/:recruitmentId', md_auth, recruitmentCtrl.vacantCover);
api.put('/closedRecruitment/:recruitmentId', md_auth, recruitmentCtrl.closedRecruitment);
api.put('/resetRecruitment/:recruitmentId', md_auth, recruitmentCtrl.resetRecruitment);

module.exports = api;