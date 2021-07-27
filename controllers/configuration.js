'use strict'

const Configuration = require('../models/configuration');
const mongoose = require('mongoose');

/*
 * Actualiza la información
 */
var storeConfig = (req, res) =>{
    let params = req.body;
    let confEval = new Configuration(params);

    confEval.save((err, storeConfEval) =>{
        if(err){
            res.status(400).send({
                ok: false,
                message: 'Error al crear la configuración',
                error: err
            });
        } else {
            res.status(201).send({
                ok: true,
                data: storeConfEval
            });
        }
    });
};

/*
 * Actualiza la información
 */
var updateConfig = (req, res) =>{
    const confId = mongoose.Types.ObjectId(req.params.id);

    Configuration.update({'_id': confId},
    {$set:  req.body},{new: true}, (err, pEval) =>{
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            }) ;
        } else {
            if(!pEval){
                res.status(400).send({
                    ok: false,
                    message: 'No se pudo hacer la actualización de los datos',
                    error: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: pEval
                });
            }
        }
    });
};

/*
 * Obtiene la información de las configuraciones
 */
var getConfig = (req, res) =>{
    Configuration.find({})
    .populate({
        path: 'jobDescription.rhValidation',
        select: `email`
    })
    .populate({
        path: 'requisition.rhValidation',
        select: `email w_information.position`
    })
    .populate({
        path: 'requisition.doValidation',
        select: `email w_information.position`
    })
    .populate({
        path: 'requisition.dfValidation',
        select: `email w_information.position`
    })
    .populate({
        path: 'requisition.allocators.allocatorId',
        select: `email`
    })
    .populate({
        path: 'requisition.recruiters.recruiterId',
        select: `email
                p_information.name
                p_information.firstSurname
                w_information.area`,
                populate: {
                    path: 'w_information.area',
                    select: 'name'
                }
    })
    .exec((err, config) =>{
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            if(!config){
                res.status(404).send({
                    ok: false,
                    message: 'No se tiene ninguna configuración',
                    error: err
                });
            } else {
                res.status(200).send({
                    data: config
                });
            }
        }
    })
};

module.exports = {
    storeConfig,
    updateConfig,
    getConfig
}