'use strict'

const Candidates = require('../models/candidate');
const mongoose = require('mongoose')

function storeCandidates(req, res){
    let params = req.body;
    let candidates = new Candidates(params);

    candidates.save((err, candidateStored) =>{
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            res.status(201).send({
                ok: true,
                data: candidateStored
            });
        }
    });
};

function getAllCandidates(req, res){
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Candidates.find({})
    .sort('firstSurname')
    .skip(page * 10)
    .limit(items)
    .exec(
        (err, getCandidates) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                if(!getCandidates){
                    res.status(404).send({
                        ok: false,
                        message: 'No hay candidados',
                        error: err
                    });
                } else {
                    Candidates.count({}, (err, counter) => {
                        if(err){
                            res.status(500).send({
                                ok: false,
                                message: 'Error contando los candidatos',
                                error: err
                            });
                        } else {
                            let totalpages = Math.ceil(counter / 10);
                            res.status(200).send({
                                ok: true,
                                data: getCandidates,
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

function getCandidatesByRecruitment(req, res){
    let recruitmentId = req.params.id;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Candidates.find({'recruitment': recruitmentId})
    .sort('firstSurname')
    .skip(page * 10)
    .limit(items)
    .exec(
        (err, getCandidate) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                if(!getCandidate){
                    res.status(404).send({
                        ok: false,
                        message: 'No existe el candidato',
                        error: err
                    });
                } else {
                    Candidates.count({}, (err, counter) => {
                        if(err){
                            res.status(500).send({
                                ok: false,
                                message: 'Error'
                            });
                        } else {
                            if(!counter){
                                res.status(200).send({
                                    ok: true,
                                    data: getCandidate,
                                    total: 0,
                                    currentPage: 1
                                });
                            } else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    ok: true,
                                    data: getCandidate,
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

function getCandidatesInPortfolio(req, res){
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Candidates.find({'status': 'Cartera'})
    .sort('firstSurname')
    .skip(page * 10)
    .limit(items)
    .exec(
        (err, getCandidates) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                if(!getCandidates){
                    res.status(404).send({
                        ok: false,
                        message: 'No hay candidatos en cartera',
                        error: err
                    });
                } else {
                    Candidates.count({'status': 'Cartera'}, (err, counter) => {
                        if(err){
                            res.status(500).send({
                                ok: false,
                                message: 'Error al contar los candidatos',
                                error: err
                            });
                        } else {
                            if(!counter){
                                res.status(200).send({
                                    ok: true,
                                    data: getCandidates,
                                    message: 'No hay candidatos en cartera',
                                    total: 0,
                                    currentPage: 1
                                });
                            } else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    ok: true,
                                    data: getCandidates,
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

function getCandidatesToAssign(req, res){
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Candidates.find({'status': {$in: ['Nuevo', 'Cartera']}})
    .sort({'status': 1, 'firstSurname': 1})
    .skip(page * 10)
    .limit(items)
    .exec(
        (err, getCandidates) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else if(!getCandidates){
                res.status(404).send({
                    ok: false,
                    message: 'No hay candidatos ha elegir',
                    error: err
                });
            } else{
                Candidates.count({'status': {$in: ['Nuevo', 'Cartera']}}, (err, counter) => {
                    if(err){
                        res.status(500).send({
                            ok: false,
                            message: 'Error al contar los candidatos',
                            error: err
                        });
                    } else if(!counter){
                        res.status(200).send({
                            ok: true,
                            data: getCandidates,
                            message: 'No hay candidatos para asignar',
                            total: 0,
                            currentPage: 1
                        });
                    } else {
                        let totalpages = Math.ceil(counter / 10);
                        res.status(200).send({
                            ok: true,
                            data: getCandidates,
                            total: counter,
                            currentPage: page + 1,
                            totalPages: totalpages
                        });
                    }
                });
            }
        }
    );
};

function listOfCandidates(req, res){
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Candidates.find({'status': {$in: ['En proceso', 'Nuevo']}})
    .sort({'status': 1, 'firstSurname': 1})
    .skip(page * 10)
    .limit(items)
    .exec(
        (err, getCandidates) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else if(!getCandidates){
                res.status(404).send({
                    ok: false,
                    message: 'No hay candidatos',
                    error: err
                });
            } else {
                Candidates.count({'status': {$in: ['En proceso', 'Nuevo']}}, (err, counter) => {
                    if(err){
                        res.status(500).send({
                            ok: false,
                            message: 'Error al contar los candidatos',
                            error: err
                        });
                    } else if(!counter){
                        res.status(200).send({
                            ok: true,
                            data: getCandidates,
                            message: 'No hay candidatos',
                            total: 0,
                            currentPage: 1
                        });
                    } else {
                        let totalpages = Math.ceil(counter / 10);
                        res.status(200).send({
                            ok: true,
                            data: getCandidates,
                            total: counter,
                            currentPage: page + 1,
                            totalPages: totalpages
                        });
                    }
                });
            }
        }
    )
};

function updateCandidateStatus(req,res){
    let candidateId = mongoose.Types.ObjectId(req.params.id);
    let candidateStatus = req.body.status;

    Candidates.findByIdAndUpdate(candidateId, {$set: {'status': candidateStatus}}, {new: true},
    (err, candidateUpdated) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else if(!candidateUpdated){
            res.status(404).send({
                ok: false,
                message: 'El candidato no existe',
                error: err
            });
        } else {
            res.status(200).send({
                ok: true,
                data: candidateUpdated,
                message: 'Candidato actualizado correctamente'
            });
        }
    });
};

function getCandidateInfo(req, res){
    let candidateId = mongoose.Types.ObjectId(req.params.id);

    Candidates.findOne({'_id': candidateId}, (err, getCandidate) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else if(!getCandidate){
            res.status(404).send({
                ok: false,
                message: 'El candidato no existe',
                error: err
            });
        } else {
            res.status(200).send({
                ok: true,
                data: getCandidate
            });
        }
    });
};

function updateCandidate(req, res){
    let candidateId = req.params.id;
    let update = req.body;

    Candidates.findByIdAndUpdate(candidateId, {$set: update}, {new: true}, (err, updatedCandidate) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else if(!updatedCandidate){
            res.status(404).send({
                ok: false,
                message: 'No se pudo actualizar la información',
                error: err
            });
        } else {
            res.status(200).send({
                ok: true,
                data: updatedCandidate,
                message: 'Candidato actualizado'
            });
        }
    });
};

module.exports = {
    storeCandidates,
    getAllCandidates,
    getCandidatesByRecruitment,
    getCandidatesInPortfolio,
    getCandidatesToAssign,
    listOfCandidates,
    updateCandidateStatus,
    getCandidateInfo,
    updateCandidate
}