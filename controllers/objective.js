'use strict'

const Objective = require('../models/objective');
const mongoosePagination = require('mongoose-pagination');

/* 
 * Obtiene los objetivos paginados por usuario y por periodo.
 */

function getObjectives(req, res) {
    let userID = req.params.user;
    let period = req.params.period;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Objective.find({
            $and: [
                { 'user': userID },
                { 'period': period }
            ]
        })
        .sort('type')
        .populate({ path: 'user', select: `p_information.name 
                                          p_information.firstSurname 
                                          p_information.secondSurname -_id` })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, objective) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando objetivos." });
                } else {
                    if (!objective) {
                        res.status(404).send({ message: "No existen objetivos registrados." })
                    } else {
                        Objective.count({
                            $and: [
                                { 'user': userID },
                                { 'period': period }
                            ]
                        }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando los objetivos." });
                            else {
                                res.status(200).send({
                                    data: objective,
                                    total: counter
                                });
                            }
                        });
                    }
                }
            }
        );
}
/*
 * Obtiene el objetivo requerido.
 */
var getObjective = (req, res) => {
    let objectiveID = req.params.id;

    Objective.findById(objectiveID)
        .populate({ path: 'user', select: `p_information.name 
                                          p_information.firstSurname 
                                          p_information.secondSurname -_id` })
        .exec((err, objective) => {
            if (err) {
                res.status(500).send({ message: "Error cargando el objetivo." });
            } else {
                if (!objective) {
                    res.status(404).send({ message: "Objetivo no encontrado." });
                } else {
                    res.status(200).send({ data: objective });
                }
            }
        });
};

/*
 * Actualizar información del objetivo.
 */
var updateInformation = (req, res) => {
    let objectiveID = req.params.id;
    let update = req.body;

    Objective.findByIdAndUpdate(objectiveID, update, { new: true }, (err, objUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!objUpdated) {
                res.status(404).send({ message: 'El objetivo no pudo ser actualizado.' });
            } else {
                res.status(200).send({ data: objUpdated });
            }
        }
    });
};

/*
 * Validar que el objetivo está bien definido
 */
var validate = (req, res) => {
    let objectiveID = req.params.id;

    Objective.findByIdAndUpdate(objectiveID, {
        $set: { 'validated': 'true' }
    }, { new: true }, (err, objValidated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!objValidated) {
                res.status(404).send({ message: 'El objetivo no pudo ser validado.' });
            } else {
                res.status(200).send({ data: objValidated });
            }
        }
    });
};

/*
 * Actualizar avance mensual del objetivo.
 */
var updateProgress = (req, res) => {
    let objectiveID = req.params.id;
    let update = req.body;

    Objective.findByIdAndUpdate(objectiveID, {
        $push: { 'evaluation': update }
    }, { new: true }, (err, objUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!objUpdated) {
                res.status(404).send({ message: 'El progreso del objetivo no pudo ser actualizado.' });
            } else {
                res.status(200).send({ data: objUpdated });
            }
        }
    });
};
/*
 * Calificar objetivo
 */
var qualify = (req, res) => {
    let objectiveID = req.params.user;
    let period = req.params.period;

    var find = Objective.aggregate([{
            $match: {
                $and: [
                    { 'user': "5b035f9f814bcecab9f029e7" },
                    { 'period': '20181' }
                ]
            }
        },
        {
            $project: {
                evaluation: { $arrayElemAt: ["$evaluation.percentage", -1] },
                type: 1
            }
        },
        { $unwind: { path: "$evaluation", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: "$type",
                objsCount: { $sum: 1 },
                count: { $sum: "$evaluation" }
            }
        },
        { $project: { total: { $divide: ["$count", "$objsCount"] } } }
    ], (err, objectives) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!objectives) {
                res.status(404).send({ message: 'La sala no existe.' });
            } else {
                res.status(200).send({ data: objectives });
            }
        }
    });
    console.log(find);
};

/*
 * Crea un objetivo.
 */
var store = (req, res) => {
    let params = req.body;
    let objective = new Objective(params);

    objective.save((err, objectiveStored) => {
        if (err)
            res.status(400).send({
                message: 'Error al crear el objetivo.',
                errors: err
            });
        else
            res.status(201).send({ data: objectiveStored });
    })
};

module.exports = {
    getObjectives,
    getObjective,
    updateInformation,
    updateProgress,
    qualify,
    validate,
    store
};