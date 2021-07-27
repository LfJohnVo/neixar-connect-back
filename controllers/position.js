'use strict'

const Position = require('../models/position');
const User = require('../models/user');
const mongoosePagination = require('mongoose-pagination');
const mongoose = require('mongoose');

/* 
 * Obtiene las posiciones paginadas.
 */
function getPositions(req, res) {
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Position.find({})
        .sort('name')
        .populate({
            path: 'department',
            select: `name -_id`
        })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, positions) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando las posiciones." });
                } else {
                    if (!positions) {
                        res.status(404).send({ message: "No existen posiciones registradas." })
                    } else {
                        Position.count({}, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando las posiciones." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: positions,
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
 * Obtiene las posiciones paginados por departamento.
 */
function getPositionsByDepto(req, res) {
    let deptoID = req.params.depto;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Position.find({ department: deptoID }, `_id name salary_range`)
        .sort('name')
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, positions) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando posiciones." });
                } else {
                    if (!positions) {
                        res.status(404).send({ message: "No existen posiciones registradas." })
                    } else {
                        Position.count({ department: deptoID }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando las posiciones." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: positions,
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
 * Obtiene la posición requerida.
 */
var getPosition = (req, res) => {
    let positionID = req.params.id;

    Position.findById(positionID)
        .populate({
            path: 'department',
            select: `name _id`
        })
        .populate({
            path: 'jobDescription.immediate_boss',
            select: ` name _id`
        })
        .populate({
            path: 'jobDescription.subordinates.position',
            select: `name _id`
        })
        .populate({
            path: 'jobDescription.elaboratedBy',
            select: `p_information.name p_information.firstSurname p_information.secondSurname`
        })
        .populate({
            path: 'jobDescription.organizationalCompetencies.competition',
            select: `competency _id`
        })
        .populate({
            path: 'jobDescription.specificCompetencies.competition',
            select: `competency`
        })
        .exec((err, position) => {
            if (err) {
                res.status(500).send({ message: "Error cargando la posición." });
            } else {
                if (!position) {
                    res.status(404).send({ message: "Posición no encontrado." });
                } else {
                    res.status(200).send({ data: position });
                }
            }
        });
};

/*
 * Actualizar información de la posición.
 */
var updateInformation = (req, res) => {
    let positionId = req.params.id;
    let update = req.body;

    Position.findByIdAndUpdate(positionId, update, { new: true }, (err, positionUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!positionUpdated) {
                res.status(404).send({ message: 'La posición no pudo ser actualizada.' });
            } else {
                res.status(200).send({ data: positionUpdated });
            }
        }
    });
};
/*
 * Crea una posición.
 */
var store = (req, res) => {
    let params = req.body;
    let position = new Position(params);

    position.save((err, positionStored) => {
        if (err)
            res.status(400).send({
                message: 'Error al crear la posición.',
                errors: err
            });
        else
            res.status(201).send({ data: positionStored });
    })
};

/*
 * Crea una descripción de puesto
 */
var storeDP = (req, res) => {
    let positionID = req.params.id;
    let DP = req.body;

    Position.update({ _id: positionID }, {
        $addToSet: {
            jobDescription: DP
        }
    }, { new: true }, (err, storeDp) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición.'
            });
        } else {
            if (!storeDp) {
                res.status(400).send({
                    ok: false,
                    message: 'La descripción de puesto no pudo ser generada.'
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: storeDp
                });
            }
        }
    });
};

/*
 * Actualiza una descripción de puesto
 */
var updateDP = (req, res) => {
    let dpId = req.params.id;

    if (req.body.description) {
        Position.update({ 'jobDescription._id': dpId }, {
            $set: {
                'jobDescription.$': req.body.description
            }
        }, { new: true }, (err, updateDp) => {
            if (err) {
                res.status(500).send({ message: 'Error en la petición.' });
            } else {
                res.status(201).send({
                    ok: true,
                    data: updateDp
                });
            }
        });
    } else {
        res.status(400).send({
            ok: false,
            message: 'La descripción de puesto no pudo ser actualizada.'
        });
    }
};

/*
 * Obtener una descripción de puesto
 */
var getDP = (req, res) => {
    let dpId = req.params.id;

    Position.find({ 'jobDescription._id': dpId }, {
            'jobDescription.$': 1,
            'name': 1,
            'department': 1,
            'type': 1,
            'level': 1,
            'job_key': 1,
            'specialty': 1,
            'career_key': 1
        })
        .populate({ path: 'department', select: `name -_id` })
        .populate({ path: 'jobDescription.immediate_boss', select: `name _id` })
        .populate({
            path: 'jobDescription.elaboratedBy',
            select: ` p_information.name 
                        p_information.firstSurname 
                        p_information.secondSurname 
                        _id
                        email`
        })
        .populate({
            path: 'jobDescription.subordinates.position',
            select: `name _id`
        })
        .populate({
            path: 'jobDescription.organizationalCompetencies.competition',
            select: `competency`
        })
        .populate({
            path: 'jobDescription.specificCompetencies.competition',
            select: `competency`
        })
        .exec((err, getDp) => {
            if (err) {
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición'
                });
            } else {
                if (!getDp) {
                    res.status(400).send({
                        ok: false,
                        message: 'No existe la descripción de puesto'
                    });
                } else {
                    res.status(200).send({
                        ok: true,
                        data: getDp
                    });
                }
            }
        });
};

/*
 * Eliminar una descripción de puesto
 */
var deleteDP = (req, res) => {
    let dpId = req.params.id;

    Position.update({ 'jobDescription._id': dpId }, { $set: { 'jobDescription.$.status': 'No vigente' } }, (err, deleteDp) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición'
            });
        } else {
            if (!deleteDp) {
                res.status(400).send({
                    ok: false,
                    message: 'La descripción de puesto que quiere eliminar no existe'
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: deleteDp
                });
            }
        }
    });
};

/*
 * Validar una descripción de puesto
 */
var validatedDP = (req, res) => {
    let dpId = req.params.id;
    let body = req.body

    Position.update({ 'jobDescription._id': dpId }, {
        $set: {
            'name': body.name,
            'career_key': body.career_key,
            'job_key': body.job_key,
            'specialty': body.specialty,
            'salary': body.salary,
            'jobDescription.$.validatedRH': true,
            'jobDescription.$.validationDate': new Date(),
            'jobDescription.$.validator': body.validator,
            'jobDescription.$.status': 'Vigente'
        }
    }, { new: true }, (err, updateDP) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                err: err
            });
        } else {
            if (!updateDP) {
                res.status(404).send({
                    ok: false,
                    message: 'No existe la descripción de puesto'
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: updateDP
                });
            }
        }
    });
};

/*
 * Actualiza el estatus de una descripción de puesto
 */
var statusDP = (req, res) => {
    let dpId = req.params.id;
    let status = req.body.status;

    Position.update({ 'jobDescription._id': dpId }, { $set: { 'jobDescription.$.status': status } }, { new: true }, (err, updateDP) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición'
            });
        } else {
            if (!updateDP) {
                res.status(404).send({
                    ok: false,
                    message: 'No existe la descripción de puesto'
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: updateDP
                });
            }
        }
    });
};

/*
 * Actualiza el estatus de una descripción de puesto a rechazada
 */
var statusDPrejected = (req, res) => {
    let dpId = req.params.id;

    Position.update({ 'jobDescription._id': dpId }, {
        $set: {
            'jobDescription.$.status': 'Rechazada',
            'jobDescription.$.validatedRH': false,
            'jobDescription.$.rejectionDate': new Date(),
            'jobDescription.$.validator': req.body.validator,
            'jobDescription.$.rejectionComments': req.body.rejectionComments
        }
    }, { new: true }, (err, updateDP) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición'
            });
        } else {
            if (!updateDP) {
                res.status(404).send({
                    ok: false,
                    message: 'No existe la descripción de puesto'
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: updateDP
                });
            }
        }
    });
};

/*
 * Obtiene las descripciones de puesto creadas por un colaborador
 */
var getDpByCreator = (req, res) => {
    let creatorId = mongoose.Types.ObjectId(req.params.id);
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 4 : 0;
    let query;

    if (items) {
        query = [
            { $unwind: "$jobDescription" },
            { $match: { "jobDescription.elaboratedBy": creatorId } },
            {
                $project: {
                    "name": 1,
                    "jobDescription._id": 1,
                    "jobDescription.status": 1,
                    "jobDescription.version": 1,
                    "jobDescription.elaborationDate": 1
                }
            },
            { $sort: { "jobDescription.elaborationDate": -1 } },
            { $skip: page * 4 },
            { $limit: items }
        ]
    } else {
        query = [
            { $unwind: "$jobDescription" },
            { $match: { "jobDescription.elaboratedBy": creatorId } },
            {
                $project: {
                    "name": 1,
                    "jobDescription._id": 1,
                    "jobDescription.status": 1,
                    "jobDescription.version": 1,
                    "jobDescription.elaborationDate": 1
                }
            },
            { $sort: { "jobDescription.elaborationDate": -1 } }
        ]
    }

    Position.aggregate(query, (err, getDPs) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                err: err
            });
        } else {
            if (!getDPs) {
                res.status(404).send({
                    ok: false,
                    message: 'No existen DPs generadas por este colaborador'
                });
            } else {
                Position.aggregate([
                    { $unwind: "$jobDescription" },
                    { $match: { "jobDescription.elaboratedBy": creatorId } },
                    {
                        $project: {
                            "name": 1,
                            "jobDescription.status": 1,
                            "jobDescription.version": 1
                        }
                    },
                    { $count: "results" },
                    { $unwind: "$results" }
                ], (err, counter) => {
                    if (err) {
                        res.status(500).send({
                            ok: false,
                            message: 'Error al contar las DPs'
                        });
                    } else {
                        if (!counter[0]) {
                            res.status(200).send({
                                ok: true,
                                data: getDPs,
                                total: 1,
                                currentPage: 1
                            });
                        } else {
                            let totalpages = Math.ceil(counter[0].results / 4);
                            res.status(200).send({
                                ok: true,
                                data: getDPs,
                                total: counter[0].results,
                                currentPage: page + 1,
                                totalPages: totalpages
                            });
                        }
                    }
                });
            }
        }
    });
};

var toValidate = (req, res) => {
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;
    let query;

    if (items) {
        query = [
            { $unwind: "$jobDescription" },
            {
                $match: {
                    $and: [
                        { "jobDescription.validatedRH": false },
                        { "jobDescription.status": "En revisión" }
                    ]
                }
            },
            { $sort: { "jobDescription.elaborationDate": -1 } },
            {
                $project: {
                    "name": 1,
                    "jobDescription._id": 1,
                    "jobDescription.version": 1
                }
            },
            { $skip: page * 10 },
            { $limit: items }
        ]
    } else {
        query = [
            { $unwind: "$jobDescription" },
            {
                $match: {
                    $and: [
                        { "jobDescription.validatedRH": false },
                        { "jobDescription.status": "En revisión" }
                    ]
                }
            },
            { $sort: { "jobDescription.elaborationDate": -1 } },
            {
                $project: {
                    "name": 1,
                    "jobDescription._id": 1,
                    "jobDescription.version": 1
                }
            }
        ]
    }

    Position.aggregate(query, (err, getDPs) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                err: err
            });
        } else {
            if (!getDPs) {
                res.status(404).send({
                    ok: false,
                    message: 'No existen descripciones de puesto por validar'
                });
            } else {
                Position.aggregate([
                    { $unwind: "$jobDescription" },
                    {
                        $match: {
                            $and: [
                                { "jobDescription.validatedRH": false },
                                { "jobDescription.status": "En revisión" }
                            ]
                        }
                    },
                    { $count: "results" },
                    { $unwind: "$results" }
                ], (err, counter) => {
                    if (err) {
                        res.status(500).send({
                            ok: false,
                            message: 'Error al contar las descripciones de puesto'
                        });
                    } else {
                        if (!counter[0]) {
                            res.status(200).send({
                                ok: true,
                                data: getDPs,
                                total: 1,
                                currentPage: 1
                            });
                        } else {
                            let totalpages = Math.ceil(counter[0].results / 10);
                            res.status(200).send({
                                ok: true,
                                data: getDPs,
                                total: counter[0].results,
                                currentPage: page + 1,
                                totalPages: totalpages
                            });
                        }
                    }
                });
            }
        }
    });
};

function getPositionsDpValidated(req, res){
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Position.find({'jobDescription.status': 'Vigente'},
    {'name':1, 'jobDescription._id': 1, 'jobDescription.status': 1, 'jobDescription.version': 1, 'salary': 1, 'type': 1})
    .populate({path: 'department', select: `name`})
    .sort('name')
    .skip(page * 10)
    .limit(items)
    .exec(
        (err, getPositions) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                if(!getPositions){
                    res.status(404).send({
                        ok: false,
                        message: 'No hay DPs validadas',
                        error: err
                    });
                } else {
                    Position.count({'jobDescription.status': 'Vigente'}, (err, counter) => {
                        if(err){
                            res.status(500).send({
                                ok: false,
                                message: 'Error en la petición',
                                error: err
                            });
                        } else {
                            if(!counter){
                                res.status(200).send({
                                    ok: true,
                                    data: getPositions,
                                    message: 'No hay DPs validadas',
                                    total: 1,
                                    currentPage: 1
                                });
                            } else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    ok: true,
                                    data: getPositions,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        }
                    });
                }
            }
        }
    );
};

module.exports = {
    getPositions,
    getPositionsByDepto,
    getPosition,
    updateInformation,
    store,
    storeDP,
    updateDP,
    getDP,
    deleteDP,
    validatedDP,
    statusDP,
    statusDPrejected,
    getDpByCreator,
    toValidate,
    getPositionsDpValidated
};