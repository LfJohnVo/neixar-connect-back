'use strict'

const Indicator = require('../models/ncindicator');
const mongoose = require('mongoose');

/*
 * Crea un indicador.
 */
var store = (req, res) => {
    let params = req.body;
    let indicador = new Indicator(params);

    indicador.save((err, indicatorStored) => {
        if (err)
            res.status(400).send({
                message: 'Error al crear el indicador.',
                errors: err
            });
        else
            res.status(201).send({ data: indicatorStored });
    })
};

/*
 * Obtener el indicador requerido
 */
var getIndicator = (req, res) => {
    var id = req.params.id;

    Indicator.findById(id)
        .populate({
            path: 'responsable',
            select: `p_information.name 
                       p_information.firstSurname 
                       p_information.secondSurname 
                       _id`
        })
        .exec((err, indicator) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en el get de indicadores',
                    errors: err
                });
            } else {
                if (!indicator) {
                    res.status(404).send({
                        ok: false,
                        message: "No existen indicadores con ese ID",
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        data: indicator
                    });
                }
            }
        });
}

var getIndicatorsByType = (req, res) => {
    let page = req.params.page || 0; // Si no envía una página en especial se pone 0
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;
    let type = req.params.type;
    let year = req.params.year;
    var find = Indicator.find({ $and: [{ "type": type }, { 'status': 'ACTIVO' }, { 'year': year }] }).sort('responsable')
    find.populate({
            path: 'responsable',
            select: `p_information.name 
             p_information.firstSurname 
             p_information.secondSurname 
             _id`
        })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, indicators) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en el get de indicadores',
                        errors: err
                    });
                } else {
                    if (!indicators) {
                        res.status(404).send({
                            ok: false,
                            message: "No existen indicadores registrados.",
                            errors: err
                        });
                    } else {
                        Indicator.count({ $and: [{ "type": type }, { 'status': 'ACTIVO' }, { 'year': year }] }, (err, counter) => {
                            if (err) {
                                return res.status(500).json({
                                    ok: false,
                                    mensaje: 'Error contando los indicadores',
                                    errors: err
                                });
                            } else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).json({
                                    ok: true,
                                    data: indicators,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        });
                    }
                }
            });
};

var getIndicatorsByTypeAndResponsible = (req, res) => {
    let page = req.params.page || 0; // Si no envía una página en especial se pone 0
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;
    let type = req.params.type;
    let responsable = req.params.responsable;
    let year = req.params.year;
    let query;

    if (!responsable) {
        //Obtiene todos los objetivos ACTIVOS
        query = { $and: [{ "type": type }, { 'status': 'ACTIVO' }, { year: year }] }
    } else {
        //Obtiene todos los objetivos ACTIVOS del tipo especificado
        query = {
            $and: [
                { "type": type },
                { 'responsable': responsable },
                { 'status': 'ACTIVO' },
                { year: year }
            ]
        };
    }

    Indicator.find(query)
        .populate({
            path: 'user',
            select: `p_information.name 
             p_information.firstSurname 
             p_information.secondSurname 
             _id`
        })
        .sort('responsable')
        .sort('objective.process')
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, indicators) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en el get de indicadores',
                        errors: err
                    });
                } else {
                    if (!indicators) {
                        res.status(404).send({
                            ok: false,
                            message: "No existen indicadores registrados.",
                            errors: err
                        });
                    } else {
                        Indicator.count(query, (err, counter) => {
                            if (err) {
                                return res.status(500).json({
                                    ok: false,
                                    mensaje: 'Error contando los indicadores',
                                    errors: err
                                });
                            } else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).json({
                                    ok: true,
                                    data: indicators,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        });
                    }
                }
            });
}

var getYears = (req, res) => {

    Indicator.aggregate([{
                $match: { "status": 'ACTIVO' }
            },
            {
                $group: {
                    _id: '$year'
                }
            }
        ],
        (err, years) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en la petición',
                    errors: err
                });
            } else {
                if (!years) {
                    res.status(404).send({
                        ok: false,
                        message: "No existen indicadores registrados",
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        data: years
                    });
                }
            }
        })
}

var updateIndicator = (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Indicator.findByIdAndUpdate(id, { $set: body }, { new: true }, (err, indicatorUpdate) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                errors: err
            });
        } else {
            if (!indicatorUpdate) {
                res.status(404).send({
                    ok: false,
                    message: 'El indicador no pudo ser actualizado',
                    errors: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: indicatorUpdate
                });
            }
        }
    });
}

var deleteIndicator = (req, res) => {
    var id = req.params.id;

    Indicator.findByIdAndUpdate(id, { $set: { 'status': 'BAJA' } }, { new: true }, (err, indicatorUpdate) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                errors: err
            });
        } else {
            if (!indicatorUpdate) {
                res.status(404).send({
                    ok: false,
                    message: 'El indicador no pudo ser actualizado',
                    errors: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: indicatorUpdate
                });
            }
        }
    });
}

var getResponsables = (req, res) => {
    var year = req.params.year;
    let query;

    if (year) {
        query = { $and: [{ status: "ACTIVO" }, { year: year }] }
    } else {
        query = {}
    }

    Indicator.aggregate(
        [
            { $match: query },
            {
                $group: {
                    _id: '$responsable'
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "info"
                }
            },
            { $unwind: "$info" },
            {
                $project: {
                    _id: 1,
                    "name": "$info.p_information.name",
                    "firstSurname": "$info.p_information.firstSurname",
                    "secondSurname": "$info.p_information.secondSurname"
                }
            }
        ],
        (err, responsables) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en el get de responsables',
                    errors: err
                });
            } else {
                if (!responsables) {
                    res.status(404).send({
                        ok: false,
                        message: "No existen responsables con indicadores asignados",
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        data: responsables
                    });
                }
            }
        })
}

var getProcesses = (req, res) => {
    var year = req.params.year;

    Indicator.aggregate(
        [
            { $match: { $and: [{ status: "ACTIVO" }, { year: year }, { "type": "PROCESOS" }] } },
            {
                $group: {
                    _id: '$objective.process'
                }
            }
        ],
        (err, procesos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en el get de procesos',
                    errors: err
                });
            } else {
                if (!procesos) {
                    res.status(404).send({
                        ok: false,
                        message: "No existen procesos con indicadores asignados",
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        data: procesos
                    });
                }
            }
        })
}

/*
 * Nos permite obtener el listrado de indicadores concatenando el registro anual de
 * evaluaciones.
 */

var getEvaluationByResponsable = (req, res) => {
    let year = req.params.year;
    let responsable = mongoose.Types.ObjectId(req.params.id)
    let type = req.params.type;
    let query;

    if (!req.params.id) {
        query = {
            $and: [
                { status: "ACTIVO" },
                { year: year },
                { type: type }
            ]
        }
    } else {
        query = {
            $and: [
                { status: "ACTIVO" },
                { year: year },
                { responsable: responsable },
                { type: type }
            ]
        }
    }

    Indicator.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: "ncevaluations",
                    localField: "_id",
                    foreignField: "indicator",
                    as: "evaluation"
                }
            },
            { $unwind: "$evaluation" },
            {
                $lookup: {
                    from: "users",
                    localField: "responsable",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    evaluation: 1,
                    formula: 1,
                    frecuency: 1,
                    goal: 1,
                    indicator: 1,
                    objective: 1,
                    status: 1,
                    trafficLight: 1,
                    type: 1,
                    year: 1,
                    months: 1,
                    "user.email": 1,
                    "user.p_information": 1,
                    "user._id": 1
                }
            }
        ],
        (err, evaluations) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error obteniendo las evaluaciones',
                    errors: err
                });
            } else {
                if (!evaluations) {
                    res.status(404).send({
                        ok: false,
                        message: "No existen evaluaciones registradas.",
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        data: evaluations
                    });
                }
            }
        });
}

/*
 * Nos permite obtener el listrado de indicadores por proceso concatenando el registro anual de
 * evaluaciones.
 */

var getEvaluationByProcess = (req, res) => {
    let year = req.params.year;
    let process = req.params.process;
    var regex = new RegExp(process, 'i');

    Indicator.aggregate([{
                $match: {
                    $and: [
                        { status: "ACTIVO" },
                        { year: year },
                        { type: 'PROCESOS' },
                        { 'objective.process': regex }
                    ]
                }
            },
            {
                $lookup: {
                    from: "ncevaluations",
                    localField: "_id",
                    foreignField: "indicator",
                    as: "evaluation"
                }
            },
            { $unwind: "$evaluation" },
            {
                $lookup: {
                    from: "users",
                    localField: "responsable",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    evaluation: 1,
                    formula: 1,
                    frecuency: 1,
                    goal: 1,
                    indicator: 1,
                    objective: 1,
                    status: 1,
                    trafficLight: 1,
                    type: 1,
                    year: 1,
                    months: 1,
                    "user.email": 1,
                    "user.p_information": 1,
                    "user._id": 1
                }
            }
        ],
        (err, evaluations) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error obteniendo las evaluaciones',
                    errors: err
                });
            } else {
                if (!evaluations) {
                    res.status(404).send({
                        ok: false,
                        message: "No existen evaluaciones registradas.",
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        data: evaluations
                    });
                }
            }
        });
}

/*
 * Obtiene el promedio por proceso
 */
var getAverageByProcess = (req, res) => {
    let year = req.params.year;

    Indicator.aggregate(
        [
            { $match: { $and: [{ status: "ACTIVO" }, { year: "2018" }]}},
            {
                $lookup:
                {
                    from: "ncevaluations",
                    localField: "_id",
                    foreignField: "indicator",
                    as: "indi"
                }
            },
            { $unwind: "$indi" },
            {
                $group:
                {
                    _id: "$objective.process",
                    indicators:
                    {
                        $push:
                        {
                            total: { $divide: [{ $sum: "$indi.evaluations.progress"}, 12]}
                        }
                    },
                    counti: { $sum: 1}
                }
            },
            {
                $project:
                {
                    _id: 1,
                    average: {$divide: [{ $sum: "$indicators.total"}, "$counti"]}
                }
            }
        ],(err, indicadores) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en el get de indicadores',
                    errors: err
                });
            } else {
                if (!indicadores) {
                    res.status(404).send({
                        ok: false,
                        message: "No existen indicadores asignados",
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        data: indicadores
                    });
                }
            }
        })
}

module.exports = {
    store,
    getIndicator,
    getIndicatorsByType,
    getIndicatorsByTypeAndResponsible,
    getYears,
    updateIndicator,
    deleteIndicator,
    getResponsables,
    getProcesses,
    getEvaluationByResponsable,
    getAverageByProcess,
    getEvaluationByProcess
};