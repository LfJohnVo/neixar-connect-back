'use strict'

const Area = require('../models/area');
const mongoosePagination = require('mongoose-pagination');

/* 
 * Obtiene las áreas paginadas.
 */

function getAreas(req, res) {
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Area.find({})
        .sort('name')
        .populate({
            path: 'responsible',
            select: `p_information.name 
                             p_information.firstSurname 
                             p_information.secondSurname -_id`
        })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, areas) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando áreas." });
                } else {
                    if (!areas) {
                        res.status(404).send({ message: "No existen áreas registrados." })
                    } else {
                        Area.count({}, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando las áreas." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: areas,
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
}
/*
 * Obtiene el área requerida.
 */
var getArea = (req, res) => {
    let areaID = req.params.id;
    // TODO: Implement populate method and pagination
    Area.findById(areaID)
        .populate({
            path: 'responsible',
            select: `p_information.name 
                             p_information.firstSurname 
                             p_information.secondSurname _id`
        })
        .exec((err, area) => {
            if (err) {
                res.status(500).send({ message: "Error cargando el área." });
            } else {
                if (!area) {
                    res.status(404).send({ message: "Área no encontrada." });
                } else {
                    res.status(200).send({ data: area });
                }
            }
        });
};

/*
 * Actualizar información del área.
 */
var updateInformation = (req, res) => {
    let areaId = req.params.id;
    let update = req.body;

    Area.findByIdAndUpdate(areaId, update, { new: true }, (err, areaUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!areaUpdated) {
                res.status(404).send({ message: 'El área no pudo ser actualizada.' });
            } else {
                res.status(200).send({ data: areaUpdated });
            }
        }
    });
};
/*
 * Crea un área.
 */
var store = (req, res) => {
    let params = req.body;
    let area = new Area(params);

    area.save((err, areaStored) => {
        if (err)
            res.status(400).send({
                message: 'Error al crear el área.',
                errors: err
            });
        else
            res.status(201).send({ data: areaStored });
    })
};

module.exports = {
    getAreas,
    getArea,
    updateInformation,
    store
};