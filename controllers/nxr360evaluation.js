'use strict'

const NXR360Evaluation = require('../models/nxr360evaluation');
const mongoose = require('mongoose');

function assignmentOfCollaboratorsToEvaluate(req, res){
    let params = req.body;
    let nxr360evaluation = new NXR360Evaluation(params);

    nxr360evaluation.save((err, evaluation360Stored) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            res.status(200).send({
                ok: true,
                data: evaluation360Stored,
                message: 'Evaluaciones asignadas al colaborador'
            });
        }
    });
};

function getCollaboratorsToEvaluate(req, res){
    let userId = mongoose.Types.ObjectId(req.params.userId);
    let year = req.params.year;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;
    let query;

    if(items){
        query = [
            {$match: {'year': year, 'evaluator': userId}},
            {
                $project:
                {
                    'toEvaluated': 1
                }
            },
            {$unwind: '$toEvaluated'},
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'toEvaluated.evaluatedId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {$unwind: '$user'},
            {
                $project:
                {
                    'toEvaluated': 1,
                    'user.p_information.name': 1,
                    'user.p_information.firstSurname': 1,
                    'user.p_information.secondSurname': 1
                }
            },
            {$match: {'toEvaluated.evaluated': false}},
            {$sort: {'toEvaluated.relationship': 1, 'user.p_information.firstSurname': 1}},
            {$skip: page * 10},
            {$limit: items}
        ];
    } else {
        query = [
            {$match: {'year': year, 'evaluator': userId}},
            {
                $project:
                {
                    'toEvaluated': 1
                }
            },
            {$unwind: '$toEvaluated'},
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'toEvaluated.evaluatedId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {$unwind: '$user'},
            {
                $project:
                {
                    'toEvaluated': 1,
                    'user.p_information.name': 1,
                    'user.p_information.firstSurname': 1,
                    'user.p_information.secondSurname': 1
                }
            },
            {$match: {'toEvaluated.evaluated': false}},
            {$sort: {'toEvaluated.relationship': 1, 'user.p_information.firstSurname': 1}}
        ];
    }

    NXR360Evaluation.aggregate(query, (err, getCollaborators) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else if(!getCollaborators){
            res.status(404).send({
                ok: false,
                message: 'No tiene colaboradores asignados',
                error: err
            });
        } else {
            NXR360Evaluation.aggregate([
                {$match: {'year': year, 'evaluator': userId}},
                {
                    $project:
                    {
                        'toEvaluated': 1
                    }
                },
                {$unwind: '$toEvaluated'},
                {$match: {'toEvaluated.evaluated': false}},
                {$count: "results"},
                {$unwind: "$results"}
            ], (err, counter) => {
                if(err){
                    res.status(500).send({
                        ok: false,
                        message: 'Error al contar los colaboradores',
                        error: err
                    });
                } else if(counter.length < 1){
                    res.status(200).send({
                        ok: true,
                        data: getCollaborators,
                        total: 0
                    });
                } else {
                    let totalpages = Math.ceil(counter[0].results / 10);
                    res.status(200).send({
                        ok: true,
                        data: getCollaborators,
                        total: counter[0].results,
                        currentPage: page + 1,
                        totalPages: totalpages
                    });
                }
            });
        }
    });
};

function getCollaboratorsWhoWillEvaluateMe(req, res){
    let userId = mongoose.Types.ObjectId(req.params.userId);
    let year = req.params.year;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;
    let query;

    if(items){
        query = [
            {$match: {'year': year, 'toEvaluated.evaluatedId': userId}},
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'evaluator',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {$unwind: '$user'},
            {
                $project:
                {
                    'user.p_information.name': 1,
                    'user.p_information.firstSurname': 1,
                    'user.p_information.secondSurname': 1
                }
            },
            {$sort: {'user.p_information.firstSurname': 1}},
            {$skip: page * 10},
            {$limit: items}
        ];
    } else {
        query = [
            {$match: {'year': year, 'toEvaluated.evaluatedId': userId}},
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'evaluator',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {$unwind: '$user'},
            {
                $project:
                {
                    'user.p_information.name': 1,
                    'user.p_information.firstSurname': 1,
                    'user.p_information.secondSurname': 1
                }
            },
            {$sort: {'user.p_information.firstSurname': 1}}
        ];
    }

    NXR360Evaluation.aggregate(query, (err, getCollaborators) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else if(!getCollaborators){
            res.status(404).send({
                ok: false,
                message: 'Este colaborador no será evaluado',
                error: err
            });
        } else {
            NXR360Evaluation.aggregate([
                {$match: {'year': year, 'toEvaluated.evaluatedId': userId}},
                {
                    $lookup:
                    {
                        from: 'users',
                        localField: 'evaluator',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {$unwind: '$user'},
                {
                    $project:
                    {
                        'user.p_information.name': 1,
                        'user.p_information.firstSurname': 1,
                        'user.p_information.secondSurname': 1
                    }
                },
                {$count: "results"},
                {$unwind: "$results"}
            ], (err, counter) => {
                if(err){
                    res.status(500).send({
                        ok: false,
                        message: 'Error al contar lso colaboradores',
                        error: err
                    });
                } else if(counter.length > 1){
                    res.status(200).send({
                        ok: true,
                        data: getCollaborators,
                        total: 0
                    });
                } else {
                    let totalpages = Math.ceil(counter[0].results / 10);
                    res.status(200).send({
                        ok: true,
                        data: getCollaborators,
                        total: counter[0].results,
                        currentPage: page + 1,
                        totalPages: totalpages
                    });
                }
            });
        }
    });
};

module.exports = {
    assignmentOfCollaboratorsToEvaluate,
    getCollaboratorsToEvaluate,
    getCollaboratorsWhoWillEvaluateMe
};