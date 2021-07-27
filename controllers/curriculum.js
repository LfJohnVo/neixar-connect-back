'use strict'

const Curriculum = require('../models/curriculum');
const mongoose = require('mongoose');
const moment = require('moment');

var storeCurriculum = (req, res) => {
    let params = req.body;
    let cv = new Curriculum(params);

    cv.creation_date = moment().toISOString();
    cv.last_modification = moment().toISOString();
    console.log(cv);

    cv.save((err, cvStored) => {
        if (err)
            res.status(400).send({
                message: 'Error al guardar el curriculum.',
                errors: err
            });
        else
            res.status(200).send({ data: cvStored });
    })
};

var updateCreateCurriculum = (req, res) => {
    let curriculumId = req.params.id;
    let data = req.body;
    data.last_modification = moment().toISOString();

    Curriculum.findByIdAndUpdate(curriculumId, { $set: data }, { new: true }, (err, cvUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.', error: err });
        } else {
            if (!cvUpdated) {
                res.status(404).send({ message: 'El curriculum no pudo ser actualizado.' });
            } else {
                res.status(200).send({ data: cvUpdated });
            }
        }
    });
};

var getCurriculum = (req, res) => {
    let employeeId = req.params.id;
    let filter = { user: employeeId }
    
    Curriculum.findOne(filter)
        .populate({
            path: 'user',
            select: `p_information.name 
                     p_information.firstSurname 
                     p_information.secondSurname 
                     img
                     _id`
        })
        .exec((err, curriculum) => {
            if (err) {
                res.status(500).send({ message: "Error obteniendo el curriculum.", error: err });
            } else {
                if (!curriculum) {
                    res.status(404).send({ message: "Curriculum no encontrado." });
                } else {
                    res.status(200).send({ data: curriculum });
                }
            }
        });
};

// PARA USAR ESTE ENDPOINT SE DEBE HACER UN INDICE EN BD db.getCollection('curriculums').createIndex( { "$**": "text" } )
var searchKnowledge = (req, res) => {
    let term = req.params.term;
    let filter = { $text: { $search: term } }
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;
    
    Curriculum.find(filter)
        .populate({
            path: 'user',
            select: `p_information.name 
                     p_information.firstSurname 
                     p_information.secondSurname 
                     _id`
        })
        .skip(page * 10)
        .limit(items)
        .exec((err, curriculums) => {
            if (err) {
                res.status(500).send({ message: "Error obteniendo curriculums." });
            } else {
                if (!curriculums) {
                    res.status(404).send({ message: "Información no encontrada." });
                } else {
                    let names = curriculums.map(cv => {  
                        let employee = { "cv_id": cv._id, "user": cv.user, "position": cv.position };
                        return employee;
                    });

                    Curriculum.count(filter, (err, counter) => {
                        if (err)
                            res.status(500).send({ message: "Error contando resultados." });
                        else {
                            let totalpages = Math.ceil(counter / 10);
                            res.status(200).send({
                                data: names,
                                total: counter,
                                currentPage: page + 1,
                                totalPages: totalpages
                            });
                        }
                    });

                }
            }
        });
};

module.exports = {
    storeCurriculum,
    updateCreateCurriculum,
    getCurriculum,
    searchKnowledge
}