'use strict'

const Department = require('../models/department');
const mongoosePagination = require('mongoose-pagination');

/* 
 * Obtiene los departamentos paginados.
 */
function getDepartments(req, res) {
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Department.find({})
        .sort({ "area": 1, "name": 1 })
        .populate({ path: 'area', select: 'name -_id' })
        .populate({
            path: 'responsible',
            select: `p_information.name 
                     p_information.firstSurname 
                     p_information.secondSurname 
                     -_id`
        })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, departments) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando departamentos." });
                } else {
                    if (!departments) {
                        res.status(404).send({ message: "No existen departamentos registrados." })
                    } else {
                        Department.count({}, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando los departamentos." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: departments,
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
 * Obtiene los departamentos paginados por área.
 */
function getDepartmentsByArea(req, res) {
    let areaID = req.params.area;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Department.find({ area: areaID }, `_id name responsible`)
        .sort('area')
        .populate({
            path: 'responsible',
            select: `p_information.name 
                     p_information.firstSurname 
                     p_information.secondSurname 
                     -_id`
        })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, departments) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando departamentos." });
                } else {
                    if (!departments) {
                        res.status(404).send({ message: "No existen departamentos registrados." })
                    } else {
                        Department.count({ area: areaID }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando los departamentos." });
                            else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    data: departments,
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
 * Obtiene el departamento requerido.
 */
var getDepartment = (req, res) => {
    let deptoID = req.params.id;
    // TODO: Implement populate method and pagination
    Department.findById(deptoID)
        .populate({ path: 'area', select: 'name _id' })
        .populate({
            path: 'responsible',
            select: `p_information.name 
                     p_information.firstSurname 
                     p_information.secondSurname 
                     _id`
        })
        .exec((err, depto) => {
            if (err) {
                res.status(500).send({ message: "Error cargando el departamento." });
            } else {
                if (!depto) {
                    res.status(404).send({ message: "Departamento no encontrado." });
                } else {
                    res.status(200).send({ data: depto });
                }
            }
        });
};

/*
 * Actualizar información del departamento.
 */
var updateInformation = (req, res) => {
    let deptoId = req.params.id;
    let update = req.body;
    let query;

    if (req.body.responsible) {
        query = { $set: update };
    } else {
        query = { $unset: { 'responsible': 1 }, $set: update };
    }

    Department.findByIdAndUpdate(deptoId, query, { new: true }, (err, deptoUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!deptoUpdated) {
                res.status(404).send({ message: 'El departamento no pudo ser actualizado.' });
            } else {
                res.status(200).send({ data: deptoUpdated });
            }
        }
    });
};
/*
 * Crea un departamento.
 */
var store = (req, res) => {
    let params = req.body;
    let depto = new Department(params);

    depto.save((err, deptoStored) => {
        if (err)
            res.status(400).send({
                message: 'Error al crear el departamento.',
                errors: err
            });
        else
            res.status(201).send({ data: deptoStored });
    })
};

module.exports = {
    getDepartments,
    getDepartmentsByArea,
    getDepartment,
    updateInformation,
    store
};