'use strict'

const Evaluation = require('../models/ncevaluation');

/*
 * Crea un registro de evaluaciones
 */
var store = (req, res) => {
    var body = req.body;
    var evaluation = new Evaluation(body);
    evaluation.save((err, evaluationSave) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la evaluación',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            data: evaluationSave
        });
    });
}

/*
 * Obtener el registro de un año y un indicador en particular 
 */
var getEvaluation = (req, res) => {
    let year = req.params.year;
    let id = req.params.id;

    if (!id) {
        var find = Evaluation.find({ "year": year }).sort('indicator');
    } else {
        var find = Evaluation.find({ $and: [{ "year": year }, { "indicator": id }] });
    }

    find.populate({
            path: 'indicator',
            select: `indicator
                        frecuency
                        objective
                        goal
                        formula
                        trafficLight
                        type
                        year
                        months`
        })
        .exec(
            (err, evaluations) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en el get de evaluaciones',
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
 * Registrar calificación por mes
 */
var putProgressEvaluation = (req, res) => {
    let month = req.params.month;
    let update = req.body;

    Evaluation.update({ "evaluations._id": month }, {
        $set: {
            "evaluations.$.progress": update.progress,
            "evaluations.$.evidence": update.evidence,
            "evaluations.$.responsable": update.responsable,
            "evaluations.$.action": update.action,
            "evaluations.$.commitmentDate": update.commitmentDate,
            "evaluations.$.evaluationDate": update.evaluationDate,
            "evaluations.$.color": update.color,
            "evaluations.$.registered": update.registered
        }
    }, { new: true }, (err, evaluationUpdate) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                errors: err
            });
        } else {
            if (!evaluationUpdate) {
                res.status(404).send({
                    ok: false,
                    message: 'El indicador no pudo ser actualizado',
                    errors: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: evaluationUpdate
                });
            }
        }
    })
}

/*
 * Validar calificación por mes
 */
var putValidatedProgress = (req, res) => {
    let month = req.params.month;
    let indicator = req.params.indicator;
    let update = req.body;

    Evaluation.update({ "evaluations._id": month }, {
        $set: {
            "evaluations.$.progress": update.progress,
            "evaluations.$.evidence": update.evidence,
            "evaluations.$.action": update.action,
            "evaluations.$.commitmentDate": update.commitmentDate,
            "evaluations.$.color": update.color,
            "evaluations.$.registered": true,
            "evaluations.$.validated": true
        }
    }, { new: true }, (err, evaluationUpdate) => {
        if (err) {
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                errors: err
            });
        } else {
            if (!evaluationUpdate) {
                res.status(404).send({
                    ok: false,
                    message: 'El indicador no pudo ser actualizado',
                    errors: err
                });
            } else {
                Evaluation.update({ "indicator": indicator }, {
                    $set: {
                        "average": update.average
                    }
                }, { new: true }, (err, averageUpdated) => {
                    if (err) {
                        res.status(500).send({
                            ok: false,
                            message: 'Error en la petición',
                            errors: err
                        });
                    } else {
                        if (!averageUpdated) {
                            res.status(404).send({
                                ok: false,
                                message: 'El indicador no pudo ser actualizado',
                                errors: err
                            });
                        } else {
                            res.status(200).send({
                                ok: true,
                                data: averageUpdated
                            });
                        }
                    }
                })
            }
        }
    })
}


module.exports = {
    store,
    getEvaluation,
    putProgressEvaluation,
    putValidatedProgress
};