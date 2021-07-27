'use strict'

const Objective = require('../models/nxrobjective');
const mongoosePagination = require('mongoose-pagination');
const mongoose = require('mongoose');

/* 
 * Obtiene los objetivos por usuario y por periodo.
 */

function getObjectives(req, res) {
    let userID = req.params.user;
    let period = req.params.period;

    Objective.find({
            'user': userID,
            'year': period,
            'status': 'ACTIVO'
        }, `objectives validated _id`)
        .populate({
            path: 'user',
            select: `p_information.name 
                 p_information.firstSurname 
                 p_information.secondSurname 
                 w_information.admission_date
                 f_information.monthly_salary_saf
                 promotions
                 email
                 _id`
        })
        .exec(
            (err, objectives) => {
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
            }
        );
}

/* 
 * Obtiene el número de objetivos validados y no validados
 */

function getStatus(req, res) {
    let userID = mongoose.Types.ObjectId(req.params.user)
    let period = req.params.period;

    Objective.aggregate([{
            $match: {
                "user": userID,
                "year": period,
                'status': 'ACTIVO'
            }
        },
        {
            $project: {
                "objectives.validated": 1
            }
        },
        {
            $unwind: "$objectives"
        },
        {
            $group: {
                _id: "$objectives.validated",
                total: { $sum: 1 }
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
 * Obtiene el objetivo seleccionado.
 */

var getObjective = (req, res) => {
    let objID = req.params.id;

    Objective.find({
            "objectives._id": objID
        }, {
            objectives: {
                $elemMatch: {
                    _id: objID
                }
            }
        })
        .exec(
            (err, objective) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando el objetivo." });
                } else {
                    if (!objective) {
                        res.status(404).send({ message: "No existe el objetivo solicitado." })
                    } else {
                        res.status(200).send({
                            data: objective
                        });
                    }
                }
            }
        );
}

/*
 * Actualizar el objetivo.
 */
var updateObj = (req, res) => {
    let objectiveID = req.params.id;
    let update = req.body;

    Objective.update({
        "objectives._id": objectiveID
    }, {
        $set: {
            //"objectives.$.validated": update.validated,
            "objectives.$.description": update.description,
            "objectives.$.acceptance_criteria": update.acceptance_criteria,
            "objectives.$.expected_result": update.expected_result,
            "objectives.$.commitment_date": update.commitment_date
                //"objectives.$.weighing": update.weighing,
                //"objectives.$.progress" : update.progress
        }
    }, { new: true }, (err, objUpdated) => {
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
 * Actualizar avance del objetivo.
 */
var updateProgress = (req, res) => {
    let objectiveID = req.params.id;
    let progress = req.body.progress;
    let query;
    let periodValidated;

    if (req.body.registered) {
        query = {
            "objectives.$.progress": progress,
            "objectives.$.progress_description": req.body.progress_description,
            "objectives.$.registered": true
        };
    } else {
        query = {
            "objectives.$.progress": progress,
            "objectives.$.progress_description2": req.body.progress_description2,
            "objectives.$.registered2": true,
            "objectives.$.progress1": req.body.progress1
        };
    }

    Objective.find({
            "objectives._id": objectiveID
        }, {
            objectives: {
                $elemMatch: {
                    _id: objectiveID
                }
            }
        })
        .exec(
            (err, objective) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando el objetivo." });
                } else {
                    if (!objective) {
                        res.status(404).send({ message: "No existe el objetivo solicitado." })
                    } else {
                        // Si está validado no permite modificar el objetivo (dependiendo el periodo de evaluación)
                        req.body.registered ? periodValidated = objective[0].objectives[0].validated : periodValidated = objective[0].objectives[0].validated2
                        if (periodValidated) {
                            res.status(403).send({ message: 'El objetivo ya ha sido validado, no es posible modificarlo.' });
                        } else {
                            // Si no está validado, se puede modificar el objetivo
                            Objective.update({
                                "objectives._id": objectiveID
                            }, {
                                $set: query
                            }, { new: true }, (err, objUpdated) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error en la petición.' });
                                } else {
                                    if (!objUpdated) {
                                        res.status(404).send({ message: 'El avance del objetivo no pudo ser actualizado.' });
                                    } else {
                                        res.status(200).send({ data: objUpdated });
                                    }
                                }
                            });
                        }
                    }
                }
            }
        );

    // Objective.update({
    //     "objectives._id": objectiveID
    // }, {
    //     $set: {
    //         "objectives.$.progress": progress,
    //         "objectives.$.progress_description": description
    //     }
    // }, { new: true }, (err, objUpdated) => {
    //     if (err) {
    //         res.status(500).send({ message: 'Error en la petición.' });
    //     } else {
    //         if (!objUpdated) {
    //             res.status(404).send({ message: 'El avance del objetivo no pudo ser actualizado.' });
    //         } else {
    //             res.status(200).send({ data: objUpdated });
    //         }
    //     }
    // });
};

/*
 * El jefe directo valida que los objetivos ingresados por los colaboradores sean correctos.
 */
var validateObjs = (req, res) => {
    let objectiveID = req.params.id;

    Objective.update({
        "_id": objectiveID
    }, {
        $set: {
            "validated": true
        }
    }, { new: true }, (err, objValidated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!objValidated) {
                res.status(404).send({ message: 'Los objetivos no pudieron ser validados.' });
            } else {
                res.status(200).send({ data: objValidated });
            }
        }
    });
};

/*
 * Validar avance del objetivo.
 */
var validate = (req, res) => {
    let objectiveID = req.params.id;
    let progress = req.body.progress;
    let query;

    if (req.body.validated) {
        query = {
            "objectives.$.progress": progress,
            "objectives.$.progress_description": req.body.progress_description,
            "objectives.$.validated": true
        }
    } else {
        query = {
            "objectives.$.progress": progress,
            "objectives.$.progress_description2": req.body.progress_description2,
            "objectives.$.validated2": true,
            "objectives.$.progress1": req.body.progress1
        }
    }
    Objective.update({
        "objectives._id": objectiveID
    }, {
        $set: query
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
 * Elimina los objetivos.
 */
var deleteObjs = (req, res) => {
    let roomId = req.params.id;

    Objective.findByIdAndRemove(roomId, (err, objsRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al borrar los objetivos.' });
        } else {
            if (!objsRemoved) {
                res.status(400).send({ message: 'Los objetivos no pudieron ser eliminados.' });
            } else {
                res.status(200).send({ room: objsRemoved });
            }
        }
    });
}

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
    getStatus,
    updateObj,
    updateProgress,
    validateObjs,
    validate,
    deleteObjs,
    store
};