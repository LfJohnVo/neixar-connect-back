// Controller that is responsible for authenticationing and registering
'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');

exports.ensureAuth = function(req, res, next) {

        if (!req.headers.authorization) {
            return res.status(401).send({ message: 'Acceso denegado, no tiene autorización para acceder.' });
        }

        var token = req.headers.authorization.replace(/['"]+/g, '');

        try {
            var payload = jwt.decode(token, config.SECRET_TOKEN);

            if (payload.exp <= moment().unix()) {
                return res.status(401).send({ message: 'El token ha expirado.' });
            }
        } catch (ex) {
            return res.status(401).send({ message: 'Token Inválido' });
        }

        req.user = payload;
        next();
    }
    /*********************************
     *** VERIFICA ROL ADMINISTRADOR **
     *********************************/
exports.ensureAdmin = function(req, res, next) {

    let user = req.user;

    if (user.role === 'Admin') {
        next();
        return;
    } else {
        return res.status(401).send({ message: 'Usuario sin permisos para esta petición.' });
    }
}

/***************************************************
 *** VERIFICA TOKEN PARA RESTABLECER CONTRASEÑA  ***
 ***************************************************/
exports.passToken = function(req, res, next) {

    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Acceso denegado, no tiene autorización para acceder.' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, config.PASS_TOKEN);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'El tiempo para restablecer la contraseña ha expirado.' });
        }
    } catch (ex) {
        return res.status(401).send({ message: 'El tiempo para restablecer la contraseña ha expirado.' });
    }

    req.user = payload;
    next();
}