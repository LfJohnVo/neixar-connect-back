'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Rutas
let area_routes = require('./routes/area');
let user_routes = require('./routes/user');
let department_routes = require('./routes/department');
let position_routes = require('./routes/position');
let objective_routes = require('./routes/objective');
let nxrobjective_routes = require('./routes/nxrobjective');
let nxrevaluation_routes = require('./routes/nxrevaluation');
let income_routes = require('./routes/income');
let ncobjective_routes = require('./routes/ncobjective');
let ncindicator_routes = require('./routes/ncindicator');
let ncevaluation_routes = require('./routes/ncevaluation');
let images_routes = require('./routes/images');
let email_routes = require('./routes/email');
let upload_routes = require('./routes/upload');
let recruitment_routes = require('./routes/recruitment');
let configuration_routes = require('./routes/configuration');
let competency_routes = require('./routes/competition');
let candidate_routes = require('./routes/candidate');
let nxr360evaluation = require('./routes/nxr360evaluation');
let curriculum_routes = require('./routes/curriculum');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configurar cabeceras http 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') //Permite el acceso a la api 
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//configurar cabeceras http 
app.use('/api', area_routes);
app.use('/api', user_routes);
app.use('/api', department_routes);
app.use('/api', position_routes);
app.use('/api', objective_routes);
app.use('/api', nxrobjective_routes);
app.use('/api', nxrevaluation_routes);
app.use('/api', income_routes);
app.use('/api', ncobjective_routes);
app.use('/api', ncindicator_routes);
app.use('/api', ncevaluation_routes);
app.use('/api', images_routes);
app.use('/api', email_routes);
app.use('/api', upload_routes);
app.use('/api', recruitment_routes);
app.use('/api', configuration_routes);
app.use('/api', competency_routes);
app.use('/api', candidate_routes);
app.use('/api', nxr360evaluation);
app.use('/api', curriculum_routes)

module.exports = app;