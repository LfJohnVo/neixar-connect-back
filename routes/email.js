'use strict'

const express = require('express');
const emailCtrl = require('../controllers/email');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;

api.post('/sendMailToBoss', emailCtrl.toBoss);
api.post('/sendMailToEmployee', emailCtrl.toEmployee);
api.post('/sendMailResetPass', emailCtrl.resetPass);
api.post('/sendMailApprovalObjectives', emailCtrl.approveObjectives);
api.post('/sendMailRecruitmentApproved', emailCtrl.recruitmentApproved);
api.post('/sendMailCreatedDP', emailCtrl.createDP);
api.post('/sendMailEditedDP', emailCtrl.editDP);
api.post('/sendMailRejectedDP', emailCtrl.rejectDP);
api.post('/sendMailValidatedDP', emailCtrl.validateDP);
api.post('/sendMailCreatedRecruitment', emailCtrl.createRecruitment);
api.post('/sendMailRejectionRecruitment', emailCtrl.rejectionRecruitment);
api.post('/sendMailAssignRecruitmentToRecruitment', emailCtrl.assignRecruitmentToRecruitment);
api.post('/sendMailEditRecruitment', emailCtrl.editRecruitment);
api.post('/sendMailRegisterEvaluation', emailCtrl.registerEvaluation);
api.post('/sendMailRequisitionCovered', emailCtrl.requisitionCovered);
api.post('/sendMailNewEmployee', emailCtrl.newEmployee);
api.post('/sendMailRequisitionClosed', emailCtrl.requisitionClosed);

module.exports = api;