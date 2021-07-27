'use strict'

const Evaluation = require('../models/nxrevaluation');
const User = require('../models/user')
const mongoose = require('mongoose');

// /* 
//  * Obtiene los objetivos por usuario y por periodo.
//  */

// function getObjectives(req, res) {
//     let userID = req.params.user;
//     let period = req.params.period;

//     Objective.find({
//         'user': userID,
//         'year': period
//     }, `objectives _id`)

//     .exec(
//         (err, objectives) => {
//             if (err) {
//                 res.status(500).send({ message: "Error cargando objetivos." });
//             } else {
//                 if (!objectives) {
//                     res.status(404).send({ message: "No existen objetivos registrados." })
//                 } else {
//                     res.status(200).send({
//                         data: objectives
//                     });
//                 }
//             }
//         }
//     );
// }

/*
 * Obtiene la evaluacion requerida.
 */
var getEvaluation = (req, res) => {
    let userID = req.params.id;
    let year = req.params.year;
    let period = req.params.period

    Evaluation.find({
            user: userID,
            year: year,
            period: period
        })
        .exec((err, evalFound) => {
            if (err) {
                res.status(500).send({ message: "Error cargando la evaluación." });
            } else {
                if (!evalFound) {
                    res.status(404).send({ message: "Evaluación no encontrado." });
                } else {
                    res.status(200).send({ data: evalFound });
                }
            }
        });
};

/*
 * Crea una evaluación.
 */
var store = (req, res) => {
    let params = req.body;
    let evaluation = new Evaluation(params);

    Evaluation.findOne({
        user: params.user,
        year: params.year,
        period: params.period
    }, (err, evalFound) => {
        if (err) res.status(500).send(err);
        if (evalFound) res.status(409).send({ message: 'El colaborador ya fue evaluado.' });
        else {
            evaluation.save((err, evalStored) => {
                if (err)
                    res.status(400).send({
                        message: 'Error al guardar la evaluación.',
                        errors: err
                    });
                else
                    res.status(201).send({ data: evalStored });
            })
        }
    })
};

/*
 * Obtiene el histórico de evaluaciones
 */

var getEvalHistory = (req, res) => {
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 4 : 0;
    let query;

    if (items) {
        query = [{
                $group: {
                    _id: {
                        year: "$year",
                        period: "$period"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": -1, "_id.period": 1 } },
            { $skip: page * 4 },
            { $limit: items }
        ]
    } else {
        query = [{
                $group: {
                    _id: {
                        year: "$year",
                        period: "$period"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": -1, "_id.period": 1 } }
        ]
    }

    Evaluation.aggregate(
        query, (err, evaluations) => {
            if (err) {
                res.status(500).send({ message: "Error cargando los datos." });
            } else {
                if (!evaluations) {
                    res.status(404).send({ message: "No existen evaluaciones registradas." })
                } else {
                    Evaluation.aggregate(
                        [{
                                $group: {
                                    _id: {
                                        year: "$year",
                                        period: "$period"
                                    },
                                    count: { $sum: 1 }
                                }
                            },
                            { $sort: { "_id.year": 1, "_id.period": 1 } },
                            {
                                $count: "results"
                            },
                            { $unwind: "$results" }
                        ], (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando evaluaciones." });
                            else {
                                let totalpages = Math.ceil(counter[0].results / 4);
                                res.status(200).send({
                                    data: evaluations,
                                    total: counter[0].results,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        });
                }
            }
        }
    )
};

/* 
 * Obtiene el número total de colaboradores a evaluar y evaluados por periodo y año
 */
var getEmployeesEval = (req, res) => {
    let year = req.params.year;
    let period = req.params.period

    Evaluation.aggregate(
        [{
                $match: {
                    $and: [{ "year": year }, { "period": period }]
                }
            },
            {
                $group: {
                    _id: {
                        year: "$year",
                        period: "$period"
                    },
                    "data": { "$push": "$$ROOT" },
                    evaluated: { $sum: 1 }
                }
            },
            { "$unwind": "$data" },
            { $project: { _id: "$data._id", userId: "$data.userId", date: "$data.date", evaluated: 1 } },
            { $sort: { date: 1 } },
            { $limit: 1 },
            { $project: { _id: 0, date: 1, evaluated: 1 } },
            {
                $lookup: {
                    from: "users",
                    let: { date: "$date" },
                    pipeline: [
                        { $match: { "w_information.status": "ACTIVO" } },
                        {
                            $match: {
                                $expr: { $lte: ["$w_information.admission_date", "$$date"] }
                            }
                        },
                        { $count: "total" }
                    ],
                    as: "employees"
                }
            },
            { $unwind: "$employees" }
        ], (err, results) => {
            if (err) {
                res.status(500).send({ message: "Error cargando los datos." });
            } else {
                if (!results || results.length == 0) {
                    res.status(404).send({ message: "No existen evaluaciones registradas." })
                } else {
                    User.count({
                        $and: [
                            { "w_information.admission_date": { $lte: new Date(results[0].date) } },
                            { "w_information.leaving_date": { $gt: new Date(results[0].date) } }
                        ]
                    }, (err, counter) => {
                        if (err)
                            res.status(500).send({ message: "Error contando evaluaciones." });
                        else {
                            res.status(200).send({
                                data: results,
                                counter: counter
                            });
                        }
                    });
                }
            }
        }
    )
};

/*
 * Obtiene las evaluaciones paginadas.
 */
var getEvaluations = (req, res) => {
    let year = req.params.year;
    let period = req.params.period;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Evaluation.find({
            $and: [
                { year: year },
                { period: period }
            ]
        })
        .populate({
            path: 'user',
            select: `p_information.name 
                     p_information.firstSurname 
                     p_information.secondSurname 
                     w_information.admission_date
                     f_information.daily_salary_saf
                     id_saf
                     passChanged
                     policiesAccepted
                     -_id`
        })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, evaluations) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando las evaluaciones." });
                } else {
                    if (!evaluations) {
                        res.status(404).send({ message: "No existen evaluaciones registradas." })
                    } else {
                        Evaluation.count({
                            $and: [
                                { year: year },
                                { period: period }
                            ]
                        }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando evaluaciones." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: evaluations,
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
 * Obtiene las evaluaciones paginadas.
 */
var getEvaluationsByEmpAndYear = (req, res) => {
    let year = req.params.year;
    let id = req.params.id;

    Evaluation.find({
            $and: [
                { user: id },
                { year: year }
            ]
        }, `_id 
        user
        total
        date`)
        .exec(
            (err, evaluations) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando las evaluaciones." });
                } else {
                    if (!evaluations) {
                        res.status(404).send({ message: "No existen evaluaciones registradas." })
                    } else {
                        Evaluation.count({
                            $and: [
                                { user: id },
                                { year: year }
                            ]
                        }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando evaluaciones." });
                            else {
                                res.status(200).send({
                                    data: evaluations,
                                    total: counter,
                                });
                            }
                        });
                    }
                }
            }
        );
};

module.exports = {
    getEvaluations,
    getEvaluation,
    getEvalHistory,
    getEmployeesEval,
    getEvaluationsByEmpAndYear,
    store
};