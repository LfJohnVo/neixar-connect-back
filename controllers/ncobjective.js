'use strict'

const Objective = require('../models/ncobjective');

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

/* 
 * Obtiene los objetivos paginados por tipo, sino se envía ningún tipo se recuperan todos los objs.
 */

var getObjectivesByType = (req, res) => {
    let page = req.params.page || 0; // Si no envía una página en especial se pone 0
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;
    let type = req.params.type;
    let query;

    if (!type) {
        //Obtiene todos los objetivos ACTIVOS
        query = { 'status': 'ACTIVO' };
    } else {
        //Obtiene todos los objetivos ACTIVOS del tipo especificado
        query = {
            $and: [
                { 'status': 'ACTIVO' },
                { 'type': type }
            ]
        };
    }

    Objective.find(query).sort('type')
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, objects) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en el get de objetivos',
                        errors: err
                    });
                } else {
                    if (!objects) {
                        res.status(404).send({
                            ok: false,
                            message: "No existen objetivos registrados.",
                            errors: err
                        });
                    } else {
                        Objective.count(query, (err, counter) => {
                            if (err) {
                                return res.status(500).json({
                                    ok: false,
                                    mensaje: 'Error contando los objetivos',
                                    errors: err
                                });
                            } else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).json({
                                    ok: true,
                                    data: objects,
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

module.exports = {
    store,
    getObjectivesByType
};