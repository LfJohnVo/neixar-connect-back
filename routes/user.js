'use strict'

const express = require('express');
const userCtrl = require('../controllers/user');
const api = express.Router();

var md_auth = require('../middlewares/auth').ensureAuth;
var md_admin = require('../middlewares/auth').ensureAdmin;
var md_pass = require('../middlewares/auth').passToken;

api.post('/login', userCtrl.login);
api.get('/token', md_auth, userCtrl.renewToken);
api.get('/users/:page?', md_auth, userCtrl.getUsers);
api.get('/user/:id', md_auth, userCtrl.getUser);
api.get('/userByStatus/:status/:page?', md_auth, userCtrl.getUsersByStatus);
// api.get('/userByArea/:area', userCtrl.getUsersByArea);
api.get('/getTeam/:user/:year/:period', md_auth, userCtrl.getTeam);
api.get('/userByDepartment/:area/:page?', md_auth, userCtrl.getUsersByDepartment);
api.get('/userByPosition/:id/:page?', md_auth, userCtrl.getUsersByPosition);
api.get('/userByLeader/:id/:page?', md_auth, userCtrl.getUsersByLeader);
api.get('/userByGender/:gender/:page?', md_auth, userCtrl.getUsersByGender);
api.get('/userByMStatus/:status/:page?', md_auth, userCtrl.getUsersByMaritalStatus)
api.get('/userByRScheme/:scheme/:page?', md_auth, userCtrl.getUsersByRecruitmentScheme);
api.get('/userByContract/:type/:page?', md_auth, userCtrl.getUsersByContractType);
api.get('/userByBirthday/:month', md_auth, userCtrl.getUsersByBirthday);
api.get('/userByAdmission/:month', md_auth, userCtrl.getUsersByAdmission);
api.put('/userStatus/:id', [md_auth, md_admin], userCtrl.updateStatus);
api.put('/user/:id', md_auth, userCtrl.updateInformation);
api.put('/promotion/:id/:year', md_auth, userCtrl.addPromotion);
api.put('/pass/:id', md_auth, userCtrl.updatePassword);
api.put('/resetPass/:id', md_auth, userCtrl.resetPassword);
api.put('/resetPassFromEmp', md_pass, userCtrl.resetPasswordFromEmp);
api.post('/user', userCtrl.store);
api.get('/search/all/:term/:page?', userCtrl.search);
api.get('/usersByArea', userCtrl.usersByArea);

module.exports = api;