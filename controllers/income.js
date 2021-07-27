'use strict'

const Income = require('../models/income');
const mongoosePagination = require('mongoose-pagination');

/* 
 * Obtiene los pagos por usuario paginados (Incrementos salariales, promociones, bonos, compensaciones)
 */
function getIncome(req, res) {
    let userID = req.params.id;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Income.find({ user: userID })
        .sort('date')
        .populate({ path: 'user', select: `p_information.name 
                                          p_information.firstSurname 
                                          p_information.secondSurname -_id` })
        .skip(page * 10)
        .limit(items)
        .exec(
            (err, income) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando los pagos." });
                } else {
                    if (!income) {
                        res.status(404).send({ message: "No existen pagos registrados." })
                    } else {
                        Income.count({ user: userID }, (err, counter) => {
                            if (err)
                                res.status(500).send({ message: "Error contando los pagos." });
                            else {
                                res.status(200).send({
                                    data: income,
                                    total: counter
                                });
                            }
                        });
                    }
                }
            }
        );
}

/* 
 * Obtiene el pago seleccionado
 */
function getDeposit(req, res) {
    let depositID = req.params.id;

    Income.findById(depositID)
        .populate({ path: 'user', select: `p_information.name 
                                          p_information.firstSurname 
                                          p_information.secondSurname -_id` })
        .exec(
            (err, deposit) => {
                if (err) {
                    res.status(500).send({ message: "Error cargando el pago." });
                } else {
                    if (!deposit) {
                        res.status(404).send({ message: "No existe el pago solicitado." })
                    } else {
                        res.status(200).send({ data: deposit });
                    }
                }
            }
        );
}

/*
 * Actualizar información de la posición.
 */
var updateInformation = (req, res) => {
    let depositID = req.params.id;
    let update = req.body;

    Income.findByIdAndUpdate(depositID, update, { new: true }, (err, depositUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición.' });
        } else {
            if (!depositUpdated) {
                res.status(404).send({ message: 'El pago no pudo ser actualizado.' });
            } else {
                res.status(200).send({ data: depositUpdated });
            }
        }
    });
};
/*
 * Crea un ingreso.
 */
var store = (req, res) => {
    let params = req.body;
    let deposit = new Income(params);
    deposit.date = new Date(params.date);

    deposit.save((err, depositStored) => {
        if (err)
            res.status(400).send({
                message: 'Error al crear el pago.',
                errors: err
            });
        else
            res.status(201).send({ data: depositStored });
    })
};

module.exports = {
    getIncome,
    getDeposit,
    updateInformation,
    store
};