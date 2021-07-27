'use strict'

const Competency = require('../models/competition');
const mongoose = require('mongoose');

function storeCompetencies(req, res){
    let params = req.body;
    let competency = new Competency(params);

    competency.save((err, competencyStored) =>{
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            res.status(201).send({
                ok: true,
                data: competencyStored
            });
        }
    });
};

function getCompetency(req, res){
    let competencyId = req.params.id;

    Competency.find({'_id': competencyId}, (err, getCompetency) =>{
        if(err){
            res.status(500).send({
                ok:false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            if(!getCompetency){
                res.status(404).send({
                    ok: false,
                    message: 'La competencia no está registrada',
                    error: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: getCompetency
                });
            }
        }
    });
};

function getCompetencies(req, res){
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Competency.find({})
    .sort('type')
    .sort('competency')
    .skip(page * 10)
    .limit(items)
    .exec(
        (err, getCompetencies) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                if(!getCompetencies){
                    res.status(404).send({
                        ok: false,
                        message: 'No hay competencias específicas',
                        error: err
                    });
                } else {
                    Competency.count({}, (err, counter) =>{
                        if(err){
                            res.status(500).send({
                                ok: false,
                                message: 'Error contando las competencias',
                                error: err
                            });
                        } else {
                            let totalpages = Math.ceil(counter / 10);
                            res.status(200).send({
                                ok: true,
                                data: getCompetencies,
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

function getCompetenciesByTypePosition(req, res){
    let position = req.params.position;

    Competency.find({$and: [
        {'typePosition': position}
    ]}, {
        'competency': 1,
        'type': 1
    })
    .sort('competency')
    .exec(
        (err, getCompetencies) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                if(!getCompetencies){
                    res.status(404).send({
                        ok: false,
                        message: 'No existen competencias específicas para esa posición',
                        error: err
                    });
                } else {
                    res.status(200).send({
                        ok: true,
                        data: getCompetencies
                    });
                }
            }
        }
    );
};

function updateCompetencies(req, res){
    let competencyId = req.params.id;
    let update = req.body;

    Competency.findByIdAndUpdate(competencyId, {$set: update}, {new: true}, (err, updateCompetency) =>{
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la peticion',
                error: err
            });
        } else {
            if(!updateCompetency){
                res.status(404).send({
                    ok: false,
                    message: 'La competencia no pudo ser actualizada',
                    error: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: updateCompetency
                });
            }
        }
    });
};

module.exports = {
    storeCompetencies,
    getCompetency,
    getCompetencies,
    getCompetenciesByTypePosition,
    updateCompetencies
}