'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');

exports.createToken = function(user) {
    let currentUser = {
        name: user.p_information.name,
        surname: user.p_information.firstSurname,
        id_saf: user.id_saf,
        role: user.role
    }
    const payload = {
        sub: currentUser,
        iat: moment().unix(),
        exp: moment().add(4, 'hours').unix()
    }

    return jwt.encode(payload, config.SECRET_TOKEN);
};

exports.createPassToken = (user) => {
    const payload = {
        _id: user._id,
        iat: moment().unix(),
        exp: moment().add(10, 'minutes').unix()
    }

    return jwt.encode(payload, config.PASS_TOKEN);
};
