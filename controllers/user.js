'use strict'

const User = require('../models/user');
const NxrObjective = require('../models/nxrobjective');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');

/*
 * Realiza el inicio de sesión del usuario
 */

function login(req, res) {
    var params = req.body;
    var user = params.user;
    var pass = params.pass;

    User.findOne({
            $and: [
                { $or: [{ 'id_saf': user }, { 'email': user }] },
                { 'w_information.status': 'ACTIVO' }
            ]
        }, `_id 
        p_information.name 
        p_information.firstSurname 
        p_information.secondSurname 
        p_information.gender
        id_saf 
        pass
        passChanged
        policiesAccepted
        role
        w_information.immediate_boss
        w_information.position
        w_information.area
        w_information.admission_date
        img`)
        .populate({ path: 'w_information.position', select: `name career_key -_id` })
        .populate({ path: 'w_information.immediate_boss', select: `email -_id` })
        .populate({ path: 'w_information.area', select: `name _id`})
        .exec((err, user) => {
            if (err)
                res.status(500).send({ message: 'Error al buscar usuario.' });
            else {
                if (!user)
                    res.status(400).send({ message: 'Usuario y/o contraseña incorrecta.' });
                else {
                    if (!bcrypt.compareSync(pass, user.pass))
                        res.status(400).send({ message: 'Usuario y/o contraseña incorrecta.' });

                    else {
                        let token = jwt.createToken(user)
                        user.pass = "";
                        res.status(200).send({
                            data: user,
                            token: token,
                            menu: getMenu(user.role)
                        });
                    }
                }
            }
        });
}

/*
 * Renovar token 
 */

function renewToken(req, res) {
    let user = {
        p_information: {
            name: req.user.sub.name,
            firstSurname: req.user.sub.surname
        },
        id_saf: req.user.sub.id_saf,
        role: req.user.sub.role
    }
    let token = jwt.createToken(user)

    res.status(200).send({
        token: token
    });
}

/*
 * Obtiene el menú según el rol
 */

function getMenu(role) {
    var menu = [
        { title: 'Inicio', url: '/inicio' },
        { title: 'Mi Perfil', url: '/perfil' },
        { title: 'NEIXAR', url: '/neixar' }
    ];

    if (role === 'Admin') {
        menu.push({ title: 'Capital Humano', url: '/capital-humano' });
        menu.push({ title: 'SGI', url: '/sgi' });
        menu.push({ title: 'Administrador', url: '/administrador' });
    } else if (role === 'NorCum' || role === 'DG') {
        menu.push({ title: 'SGI', url: '/sgi' });
    } else if (role == 'CH1' || role == 'CH2' || role == 'CH3' || role == 'CH4' || role == 'CHI') {
        menu.push({ title: 'Capital Humano', url: '/capital-humano' });
    }
    return menu;
}

/* 
 * Obtiene los colaboradores paginados solamente con los datos
 * a mostrar en la tabla (ID SAF, NOMBRE, ÁREA, STATUS).
 */

function getUsers(req, res) {
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    User.find({},
            `_id 
        p_information.name 
        p_information.firstSurname 
        p_information.secondSurname 
        id_saf 
        w_information.status`)
        .sort('p_information.firstSurname')
        .populate({ path: 'w_information.position', select: `name -_id` })
        .populate({ path: 'w_information.area', select: `name -_id` })
        .populate({
            path: 'w_information.immediate_boss',
            select: `p_information.name 
                             p_information.firstSurname 
                             p_information.secondSurname -_id`
        })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, users) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando usuarios." });
                } else {
                    if (!users) {
                        res.status(404).send({ message: "No existen usuarios registrados." })
                    } else {
                        User.count({}, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando usuarios." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: users,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        });
                    }
                }
            }
        );
}
/*
 * Obtiene el colaborador requerido.
 */
var getUser = (req, res) => {
    let userID = req.params.id;

    User.findById(userID)
        .populate({ path: 'w_information.position', select: `name _id` })
        .populate({ path: 'w_information.area', select: `name area _id`, populate: {
            path: 'area',
            select: `name
                     responsible
                     _id`,
                     populate: {
                        path: 'responsible',
                        select: `p_information.name
                        p_information.firstSurname
                        p_information.secondSurname
                        w_information.position
                        email
                        _id`,
                        populate: { path: 'w_information.position', select: `career_key name`}
                     }
        }})
        .populate({ path: 'w_information.immediate_boss', select: `  p_information.name 
        p_information.firstSurname 
        p_information.secondSurname
        w_information.position
        email
        _id`, populate: {path: 'w_information.position', select: 'career_key name'} })
        .populate({ path: 'promotions.new_position', select: `name _id` })
        .populate({ path: 'promotions.prev_position', select: `name _id` })
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: "Error cargando el usuario." });
            } else {
                if (!user) {
                    res.status(404).send({ message: "Usuario no encontrado." });
                } else {
                    user.pass = '*********';
                    res.status(200).send({ data: user });
                }
            }
        });
};
/*
 * Obtiene los colaboradores paginados filtrados por estatus.
 */
var getUsersByStatus = (req, res) => {
    let status = req.params.status;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    User.find({ 'w_information.status': status },
            `_id 
            p_information.name 
            p_information.firstSurname 
            p_information.secondSurname 
            id_saf 
            img
            email
            w_information.status`)
        .sort('p_information.firstSurname')
        .populate({ path: 'w_information.position', select: `name -_id` })
        .populate({ path: 'w_information.area', select: `name -_id` })
        .populate({
            path: 'w_information.immediate_boss',
            select: `p_information.name 
                             p_information.firstSurname 
                             p_information.secondSurname -_id`
        })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, users) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando usuarios." });
                } else {
                    if (!users) {
                        res.status(404).send({ message: "No existen usuarios registrados con ese estatus." })
                    } else {
                        User.count({ 'w_information.status': status }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando usuarios." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: users,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        });
                    }
                }
            }
        );
};
/*
 * Obtiene los colaboradores paginados filtrados por área.
 */
/*var getUsersByArea = (req, res) => {
    let areaID = req.params.area;
    // TODO: Buscar por área no por departamento 
    User.find({ 'w_information.area': areaID },
            `_id 
            p_information.name 
            p_information.firstSurname 
            p_information.secondSurname 
            w_information.id_saf 
            w_information.status`)
        .exec(
            (err, users) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando usuarios." });
                } else {
                    if (!users) {
                        res.status(404).send({ message: "No existen usuarios registrados." })
                    } else {
                        res.status(200).send({ data: users });
                    }
                }
            }
        );
};*/
/*
 * Obtiene los colaboradores paginados filtrados por departamento.
 */
var getUsersByDepartment = (req, res) => {
    let departID = req.params.area;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    User.find({
                $and: [
                    { 'w_information.area': departID },
                    { 'w_information.status': 'ACTIVO' }
                ]
            },
            `_id 
            p_information.name 
            p_information.firstSurname 
            p_information.secondSurname 
            id_saf 
            email
            w_information.status
            img`)
        .sort('p_information.firstSurname')
        .populate({ path: 'w_information.position', select: `name -_id` })
        .populate({ path: 'w_information.area', select: `name -_id` })
        .populate({
            path: 'w_information.immediate_boss',
            select: `p_information.name 
                             p_information.firstSurname 
                             p_information.secondSurname -_id`
        })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, users) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando usuarios." });
                } else {
                    if (!users) {
                        res.status(404).send({ message: "No existen usuarios activos registrados pertenecientes a ese departamento." })
                    } else {
                        User.count({
                            $and: [
                                { 'w_information.area': departID },
                                { 'w_information.status': 'ACTIVO' }
                            ]
                        }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando usuarios." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: users,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        });
                    }
                }
            }
        );
};
/*
 * Obtiene los colaboradores paginados filtrados por posición.
 */
var getUsersByPosition = (req, res) => {
    let positionID = req.params.id;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    User.find({
                $and: [
                    { 'w_information.position': positionID },
                    { 'w_information.status': 'ACTIVO' }
                ]
            },
            `_id 
            p_information.name 
            p_information.firstSurname 
            p_information.secondSurname 
            id_saf 
            w_information.status`)
        .sort('p_information.firstSurname')
        .populate({ path: 'w_information.position', select: `name -_id` })
        .populate({ path: 'w_information.area', select: `name -_id` })
        .populate({ path: 'w_information.immediate_boss', select: `    p_information.name 
                                               p_information.firstSurname 
                                               p_information.secondSurname -_id` })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, users) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando usuarios." });
                } else {
                    if (!users) {
                        res.status(404).send({ message: "No existen usuarios activos registrados con esa posición." })
                    } else {
                        User.count({
                            $and: [
                                { 'w_information.position': positionID },
                                { 'w_information.status': 'ACTIVO' }
                            ]
                        }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando usuarios." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: users,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        });
                    }
                }
            }
        );
};

/* 
 * Obtiene el por según jefe directo concatenando su evaluación por periodo.
 */

function getTeam(req, res) {
    let userID = mongoose.Types.ObjectId(req.params.user)
    let year = req.params.year;
    let period = req.params.period;

    User.aggregate([{
            $match: {
                'w_information.immediate_boss': userID,
                'w_information.status': 'ACTIVO'
            },
        },
        {
            $project: {
                "_id": 1,
                "p_information.name": 1,
                "p_information.firstSurname": 1,
                "p_information.secondSurname": 1,
                "w_information.position": 1,
                "img": 1
            }
        },
        {
            $lookup: {
                from: "nxrevaluations",
                let: { id_user: "$_id" },
                pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$user", "$$id_user"] },
                                    { $eq: ["$year", year] },
                                    { $eq: ["$period", period] }
                                ]
                            }
                        }
                    },
                    { $project: { year: 0, _id: 0, period: 0, user: 0 } }
                ],
                as: 'evaluation'
            }
        },
        {
            $lookup: {
                from: "positions",
                localField: "w_information.position",
                foreignField: "_id",
                as: "position"
            }
        },
        {
            $project: {
                "w_information": 0,
                "position._id": 0,
                "position.department": 0,
                "position.salary_range": 0
            }
        }
    ], (err, objectives) => {
        if (err) {
            res.status(500).send({ message: "Error cargando objetivos." });
        } else {
            if (!objectives) {
                res.status(404).send({ message: "No existen objetivos registrados." })
            } else {
                res.status(200).send({
                    data: objectives
                });
            }
        }
    });
}

/*
 * Obtiene los colaboradores paginados filtrados por jefe inmediato.
 */
var getUsersByLeader = (req, res) => {
    let leaderID = req.params.id;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    User.find({
                $and: [
                    { 'w_information.immediate_boss': leaderID },
                    { 'w_information.status': 'ACTIVO' }
                ]
            },
            `_id 
            p_information.name 
            p_information.firstSurname 
            p_information.secondSurname 
            id_saf 
            w_information.status`)
        .sort('p_information.firstSurname')
        .populate({ path: 'w_information.position', select: `name -_id` })
        .populate({ path: 'w_information.area', select: `name -_id` })
        .populate({ path: 'w_information.immediate_boss', select: `    p_information.name 
                                               p_information.firstSurname 
                                               p_information.secondSurname -_id` })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, users) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando usuarios." });
                } else {
                    if (!users) {
                        res.status(404).send({ message: "No existen usuarios activos registrados." })
                    } else {
                        User.count({
                            $and: [
                                { 'w_information.immediate_boss': leaderID },
                                { 'w_information.status': 'ACTIVO' }
                            ]
                        }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando usuarios." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: users,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        });
                    }
                }
            }
        );
};
/*
 * Obtiene los colaboradores paginados filtrados por género.
 */
var getUsersByGender = (req, res) => {
    let gender = req.params.gender;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    User.find({
                $and: [
                    { 'p_information.gender': gender },
                    { 'w_information.status': 'ACTIVO' }
                ]
            },
            `_id 
            p_information.name 
            p_information.firstSurname 
            p_information.secondSurname 
            id_saf 
            w_information.status`)
        .sort('p_information.firstSurname')
        .populate({ path: 'w_information.position', select: `name -_id` })
        .populate({ path: 'w_information.area', select: `name -_id` })
        .populate({ path: 'w_information.immediate_boss', select: `    p_information.name 
                                               p_information.firstSurname 
                                               p_information.secondSurname -_id` })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, users) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando usuarios." });
                } else {
                    if (!users) {
                        res.status(404).send({ message: "No existen usuarios activos registrados de este género." })
                    } else {
                        User.count({
                            $and: [
                                { 'p_information.gender': gender },
                                { 'w_information.status': 'ACTIVO' }
                            ]
                        }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando usuarios." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: users,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        });
                    }
                }
            }
        );
};
/*
 * Obtiene los colaboradores paginados filtrados por estado civil.
 */
var getUsersByMaritalStatus = (req, res) => {
    let status = req.params.status;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    User.find({
                $and: [
                    { 'p_information.marital_status': status },
                    { 'w_information.status': 'ACTIVO' }
                ]
            },
            `_id 
            p_information.name 
            p_information.firstSurname 
            p_information.secondSurname 
            id_saf 
            w_information.status`)
        .sort('p_information.firstSurname')
        .populate({ path: 'w_information.position', select: `name -_id` })
        .populate({ path: 'w_information.area', select: `name -_id` })
        .populate({ path: 'w_information.immediate_boss', select: `    p_information.name 
                                               p_information.firstSurname 
                                               p_information.secondSurname -_id` })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, users) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando usuarios." });
                } else {
                    if (!users) {
                        res.status(404).send({ message: "No existen usuarios activos registrados con este estado civil." })
                    } else {
                        User.count({
                            $and: [
                                { 'p_information.marital_status': status },
                                { 'w_information.status': 'ACTIVO' }
                            ]
                        }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando usuarios." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: users,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        });
                    }
                }
            }
        );
};
/*
 * Obtiene los colaboradores paginados filtrados por esquema de contratación.
 */
var getUsersByRecruitmentScheme = (req, res) => {
    let scheme = req.params.scheme;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    User.find({
                $and: [
                    { 'w_information.recruitment_scheme': scheme },
                    { 'w_information.status': 'ACTIVO' }
                ]
            },
            `_id 
            p_information.name 
            p_information.firstSurname 
            p_information.secondSurname 
            id_saf 
            w_information.status`)
        .sort('p_information.firstSurname')
        .populate({ path: 'w_information.position', select: `name -_id` })
        .populate({ path: 'w_information.area', select: `name -_id` })
        .populate({ path: 'w_information.immediate_boss', select: `    p_information.name 
                                               p_information.firstSurname 
                                               p_information.secondSurname -_id` })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, users) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando usuarios." });
                } else {
                    if (!users) {
                        res.status(404).send({ message: "No existen usuarios activos registrados con este esquema de contratación." })
                    } else {
                        User.count({
                            $and: [
                                { 'w_information.recruitment_scheme': scheme },
                                { 'w_information.status': 'ACTIVO' }
                            ]
                        }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando usuarios." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: users,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        });
                    }
                }
            }
        );
};
/*
 * Obtiene los colaboradores paginados filtrados por tipo de contrato.
 */
var getUsersByContractType = (req, res) => {
    let type = req.params.type;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    User.find({
                $and: [
                    { 'w_information.contract_type': type },
                    { 'w_information.status': 'ACTIVO' }
                ]
            },
            `_id 
            p_information.name 
            p_information.firstSurname 
            p_information.secondSurname 
            id_saf 
            w_information.status`)
        .sort('p_information.firstSurname')
        .populate({ path: 'w_information.position', select: `name -_id` })
        .populate({ path: 'w_information.area', select: `name -_id` })
        .populate({ path: 'w_information.immediate_boss', select: `    p_information.name 
                                               p_information.firstSurname 
                                               p_information.secondSurname -_id` })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, users) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando usuarios." });
                } else {
                    if (!users) {
                        res.status(404).send({ message: "No existen usuarios activos registrados con este tipo de contrato." })
                    } else {
                        User.count({
                            $and: [
                                { 'w_information.contract_type': type },
                                { 'w_information.status': 'ACTIVO' }
                            ]
                        }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando usuarios." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: users,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                                // res.status(200).send({
                                //     data: users,
                                //     total: counter
                                // });
                            }
                        });
                    }
                }
            }
        );
};
/*
 * Obtiene los colaboradores que cumplen años en el mes.
 */
var getUsersByBirthday = (req, res) => {
    let Month = parseInt(req.params.month);

    User.aggregate([
        { $match: { "w_information.status": "ACTIVO" } },
        {
            $lookup: {
                from: "departments",
                localField: "w_information.area",
                foreignField: "_id",
                as: "area"
            }
        },
        { $unwind: "$area" },
        {
            $project: {
                _id: 1,
                "p_information.name": 1,
                "p_information.firstSurname": 1,
                "area.name": 1,
                "img": 1,
                month: { $month: "$p_information.birthdate" },
                day: { $dayOfMonth: "$p_information.birthdate" }
            }
        },
        { $match: { month: Month } },
        { $sort: { day: 1 } }
    ], (err, users) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición'
            });
        } else {
            if (!users) {
                res.status(404).send({
                    ok: false,
                    message: 'No hay usuarios registrados que cumplan años este mes'
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: users
                });
            }
        }
    });
}

/*
 * Obtener los colaboraderes que cumplan su aniversario
 */
var getUsersByAdmission = (req, res) => {
    let month = parseInt(req.params.month);

    User.aggregate([
        { $match: { "w_information.status": "ACTIVO" } },
        {
            $lookup: {
                from: "departments",
                localField: "w_information.area",
                foreignField: "_id",
                as: "area"
            }
        },
        { $unwind: "$area" },
        {
            $project: {
                _id: 1,
                "p_information.name": 1,
                "p_information.firstSurname": 1,
                "area.name": 1,
                "w_information.admission_date": 1,
                "img": 1,
                admission: { $month: "$w_information.admission_date" }
            }
        },
        { $match: { admission: month } },
        { $sort: { "w_information.admission_date": 1 } }
    ], (err, users) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición'
            });
        } else {
            if (!users) {
                res.status(404).send({
                    ok: false,
                    message: 'No hay usuarios registrados que cumplan aniversario este mes'
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: users
                });
            }
        }
    });
}

/*
 * Dar de baja a colaborador.
 */
var updateStatus = (req, res) => {
    let userId = req.params.id;

    User.findByIdAndUpdate(userId, {
        $set: { 'w_information.status': 'BAJA' }
    }, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'El usuario no pudo ser actualizado.' });
            } else {
                res.status(200).send({ data: userUpdated });
            }
        }
    });
};
/*
 * Actualizar información del colaborador.
 */
var updateInformation = (req, res) => {
    let userId = req.params.id;
    let update = req.body;

    User.findByIdAndUpdate(userId, { $set: update }, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'El usuario no pudo ser actualizado.' });
            } else {
                res.status(200).send({ data: userUpdated });
            }
        }
    });
};

/*
 * Actualizar información del colaborador.
 */
var addPromotion = (req, res) => {
    let userId = req.params.id;
    let year = req.params.year;
    let update = req.body;

    User.update({ _id: userId }, {
        $push: {
            promotions: {
                $each: [update.promotion],
                $position: 0
            },
        },
        $set: {
            "w_information.area": update.newData.area,
            "w_information.position": update.newData.position,
            "w_information.contract_type": update.newData.contract_type,
            "w_information.contract_termination_date": update.newData.contract_termination_date,
            "f_information.monthly_salary_saf": update.newData.monthly_salary_saf,
            "f_information.daily_salary_saf": update.newData.daily_salary_saf,
            "f_information.amount_sdi_saf": update.newData.amount_sdi_saf,
            "f_information.last_gross_salary": update.newData.last_gross_salary
        }
    }, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'El usuario no pudo ser actualizado.' });
            } else {
                NxrObjective.update({
                    'user': userId,
                    'year': year,
                    'status': 'ACTIVO'
                }, {
                    $set: { 'status': 'BAJA' }
                }, { new: true }, (err, objUpdated) => {
                    if (err) {
                        res.status(500).send({ message: 'Error en la petición.' });
                    } else {
                        if (!objUpdated) {
                            res.status(404).send({ message: 'El registro de objetivos no pudo ser actualizado.' });
                        } else {
                            res.status(200).send({ data: userUpdated });
                        }
                    }
                });
            }
        }
    });
};

/*
 * Cambiar password.
 */
var updatePassword = (req, res) => {
    let userId = req.params.id;
    let pass = req.body.pass;

    pass = bcrypt.hashSync(pass, 10);

    User.findByIdAndUpdate(userId, {
        $set: {
            'pass': pass,
            'passChanged': true
        }
    }, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'La contraseña no pudo ser actualizada.' });
            } else {
                res.status(200).send({ data: userUpdated });
            }
        }
    });
};

/*
 * Restablecimiento de contraseña por el colaborador.
 */
var resetPasswordFromEmp = (req, res) => {

    let pass = req.body.pass
    pass = bcrypt.hashSync(pass, 10);

    User.findByIdAndUpdate(req.user._id, {
        $set: {
            'pass': pass
        }
    }, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: "Error en la petición",
                errors: err
            });
        } else {
            if (!userUpdated) {
                res.status(404).send({
                    ok: false,
                    message: "No pudo restablecerse la contraseña.",
                    errors: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: userUpdated
                });
            }
        }
    });
}

/*
 * Reset de password.
 */
var resetPassword = (req, res) => {
    let userId = req.params.id;
    let pass = "123456789";

    pass = bcrypt.hashSync(pass, 10);

    User.findByIdAndUpdate(userId, {
        $set: {
            'pass': pass,
            'passChanged': false
        }
    }, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: "Error en la petición",
                errors: err
            });
        } else {
            if (!userUpdated) {
                res.status(404).send({
                    ok: false,
                    message: "El usuario no existe",
                    errors: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: userUpdated
                });
            }
        }
    });
}

/*
 * Crea un usuario con los datos mínimos requeridos para posteriormente
 * terminar de llenar el perfil. (ID SAF, NOMBRE, CORREO, CONTRASEÑA Y ROL)
 */
var store = (req, res) => {
    let params = req.body;
    let user = new User(params);

    user.pass = bcrypt.hashSync(user.pass, 10);

    user.save((err, userStored) => {
        if (err)
            res.status(400).send({
                message: 'Error al crear el usuario.',
                errors: err
            });
        else
            res.status(201).send({ data: userStored });
    })
};

/*
 * Busca a los colaboradores por nombre
 */
var search = (req, res) => {
    let term = req.params.term;
    let regex = new RegExp(term, 'i');

    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    User.find({
                $and: [{
                        $or: [
                            { 'p_information.name': regex },
                            { 'p_information.firstSurname': regex },
                            { 'p_information.secondSurname': regex },
                            { 'email': regex },
                            { 'id_saf': regex }
                        ]
                    },
                    { 'w_information.status': 'ACTIVO' }
                ]
            },
            `_id 
            p_information.name 
            p_information.firstSurname 
            p_information.secondSurname 
            id_saf
            img`)
        .sort('p_information.firstSurname')
        .populate({ path: 'w_information.position', select: `name -_id` })
        .populate({ path: 'w_information.area', select: `name -_id` })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, users) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando usuarios." });
                } else {
                    if (!users) {
                        res.status(404).send({ message: "No existen resultados para la búsqueda." })
                    } else {
                        User.count({
                            $and: [{
                                    $or: [
                                        { 'p_information.name': regex },
                                        { 'p_information.firstSurname': regex },
                                        { 'p_information.secondSurname': regex }
                                    ]
                                },
                                { 'w_information.status': 'ACTIVO' }
                            ]
                        }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando resultados." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: users,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        });
                    }
                }
            }
        );
};

/*
 * Obtiene a todos los colaboradores
 * por área
 */
function usersByArea(req, res) {
    User.aggregate([
        { $match: { "w_information.status": "ACTIVO" } },
        {
            $lookup: {
                from: "positions",
                localField: "w_information.position",
                foreignField: "_id",
                as: "position"
            }
        },
        { $unwind: "$position" },
        {
            $lookup: {
                from: "departments",
                localField: "w_information.area",
                foreignField: "_id",
                as: "area"
            }
        },
        { $unwind: "$area" },
        {
            $group: {
                _id: "$area.name",
                employees: {
                    $push: {
                        name: "$p_information.name",
                        firstSurname: "$p_information.firstSurname",
                        secondSurname: "$p_information.secondSurname",
                        position: "$position.name",
                        email: "$email",
                        img: "$img"
                    }
                }
            }
        }
    ], (err, users) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición'
            });
        } else {
            if (!users) {
                res.status(404).send({
                    ok: false,
                    message: 'No hay usuarios registrados'
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: users
                });
            }
        }
    });
}

module.exports = {
    login,
    renewToken,
    getUsers,
    getUser,
    getUsersByStatus,
    getTeam,
    // getUsersByArea,
    getUsersByDepartment,
    getUsersByPosition,
    getUsersByLeader,
    getUsersByGender,
    getUsersByMaritalStatus,
    getUsersByRecruitmentScheme,
    getUsersByContractType,
    getUsersByBirthday,
    getUsersByAdmission,
    updateStatus,
    updateInformation,
    addPromotion,
    updatePassword,
    resetPassword,
    store,
    search,
    usersByArea,
    resetPasswordFromEmp
};