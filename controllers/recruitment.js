'use strict'

const Recruitment = require('../models/recruitment');
const Configuration = require('../models/configuration');
const Candidate = require('../models/candidate');
const mongoose = require('mongoose');
const moment = require('moment');

/*
 * Genera una nueva requisición de personal
 */
function store(req, res){
    let params = req.body;
    let recruitment = new Recruitment(params);

    recruitment.save((err, recruitmentStored)=>{
        if(err){
            res.status(400).send({
                ok: false,
                message: 'Error al guardar la requisición',
                errors: err
            });
        } else {
            res.status(200).send({
                ok: true,
                data: recruitmentStored
            });
        }
    });
}

/*
 * Valida la requisición
 */
function validated(req, res){
    let validator = req.params.validator;
    let recruitmentId = req.params.id;
    let query;
    let recruitmentStatus;
    let validatorName = req.body.validatorName;

    Recruitment.find({'_id': recruitmentId}, (err, getInfo)=>{
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición'
            });
        }

        //Valida cuantos VoBo tiene la requisición
        let c = getInfo[0].approvals;
        let cc = JSON.parse(JSON.stringify(c));
        let cont = 0; 
        Object.keys(cc).map( key => {
            if(cc[key] === true) cont ++;
        })

        if(validator == 'do'){
            if(getInfo[0].approvals.do == true){
                res.status(403).send({
                    ok:false,
                    message: 'La requisición ya ha sido aprobada'
                });
                return;
            } else if (cont == 2){
                query = {
                    $set: {
                        "approvals.do": true,
                        "status": "Aprobada",
                        "approvals.do_name": validatorName
                    },
                    $currentDate: {
                        "approvals.date_do": true
                    }
                };
                recruitmentStatus = 'Aprobada';
            } else {
                query = {
                    $set: {
                        "approvals.do": true,
                        "approvals.do_name": validatorName
                    },
                    $currentDate: {
                        "approvals.date_do": true
                    }
                };
                recruitmentStatus = 'Pendiente';
            }
        } else if (validator == 'daf'){
            if(getInfo[0].approvals.daf == true){
                res.status(403).send({
                    ok:false,
                    message: 'La requisición ya ha sido aprobada'
                });
                return;
            } else if (cont == 2){
                query = {
                    $set: {
                        "approvals.daf": true,
                        "status": "Aprobada",
                        "approvals.daf_name": validatorName
                    },
                    $currentDate: {
                        "approvals.date_daf": true
                    }
                };
                recruitmentStatus = 'Aprobada';
            } else {
                query = {
                    $set: {
                        "approvals.daf": true,
                        "approvals.daf_name": validatorName
                    },
                    $currentDate: {
                        "approvals.date_daf": true
                    }
                };
                recruitmentStatus = 'Pendiente';
            }
        } else if(validator == 'dt'){
            if(getInfo[0].approvals.dt == true){
                res.status(403).send({
                    ok:false,
                    message: 'La requisición ya ha sido aprobada'
                });
                return;
            } else if (cont == 2){
                query = {
                    $set: {
                        "approvals.dt": true,
                        "status": "Aprobada",
                        "approvals.dt_name": validatorName
                    },
                    $currentDate: {
                        "approvals.date_dt": true
                    }
                };
                recruitmentStatus = 'Aprobada';
            } else {
                query = {
                    $set: {
                        "approvals.dt": true,
                        "approvals.dt_name": validatorName
                    },
                    $currentDate: {
                        "approvals.date_dt": true
                    }
                };
                recruitmentStatus = 'Pendiente';
            }
        } else if(validator == 'dt2'){
            if(getInfo[0].approvals.dt == true){
                res.status(403).send({
                    ok:false,
                    message: 'La requisición ya ha sido aprobada'
                });
                return;
            } else if (cont == 1){  //Cuenta si ya está validada por DAF
                query = {
                    $set: {
                        "approvals.dt": true,
                        "approvals.do": true,
                        "status": "Aprobada",
                        "approvals.dt_name": validatorName,
                        "approvals.do_name": validatorName
                    },
                    $currentDate: {
                        "approvals.date_dt": true,
                        "approvals.date_do": true
                    }
                };
                recruitmentStatus = 'Aprobada';
            } else {
                query = {
                    $set: {
                        "approvals.dt": true,
                        "approvals.do": true,
                        "approvals.dt_name": validatorName,
                        "approvals.do_name": validatorName
                    },
                    $currentDate: {
                        "approvals.date_dt": true,
                        "approvals.date_do": true
                    }
                };
                recruitmentStatus = 'Pendiente';
            }
        } else if(validator == 'daf2'){
            if(getInfo[0].approvals.do == true){
                res.status(403).send({
                    ok:false,
                    message: 'La requisición ya ha sido aprobada'
                });
                return;
            } else if (cont == 1){  //Cuenta si ya está validada por DAF
                query = {
                    $set: {
                        "approvals.do": true,
                        "approvals.daf": true,
                        "status": "Aprobada",
                        "approvals.daf_name": validatorName,
                        "approvals.do_name": validatorName
                    },
                    $currentDate: {
                        "approvals.date_daf": true,
                        "approvals.date_do": true
                    }
                };
                recruitmentStatus = 'Aprobada';
            } else {
                query = {
                    $set: {
                        "approvals.do": true,
                        "approvals.daf": true,
                        "approvals.daf_name": validatorName,
                        "approvals.do_name": validatorName
                    },
                    $currentDate: {
                        "approvals.date_daf": true,
                        "approvals.date_do": true
                    }
                };
                recruitmentStatus = 'Pendiente';
            }
        }

        Recruitment.update({
            '_id': recruitmentId
        }, query, {new: true}, (err, validated) =>{
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición'
                });
            } else {
                if(!validated){
                    res.status(404).send({
                        ok: false,
                        message: 'La requisición no existe'
                    });
                } else {
                    res.status(200).send({
                        ok: true,
                        data: validated,
                        recruitmentStatus: recruitmentStatus
                    });
                }
            }
        });
    });
}

/*
 * Actualiza el estatus de la requisición
 */
function statusUpdate(req, res){
    let recruitmentId = req.params.id;
    let update = req.body.status;

    Recruitment.update({
        '_id': recruitmentId
    }, {
        $set: {
            'status': update
        }
    }, {new: true}, (err, statusUp)=>{
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición'
            });
        } else {
            if(!statusUp){
                res.status(404).send({
                    ok: false,
                    message: 'No existe la requisición'
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: statusUp
                });
            }
        }
    });
}

/*
 * Obtiene una o todas las requisiciones
 */
function getRecruitments(req, res){
    let id = req.params.id;
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 5 : 0;
    let condition;

    if(!id){
        condition = {};
    } else {
        condition = {'_id': mongoose.Types.ObjectId(id)};
    }

    Recruitment.find(condition)
    .populate({
        path: 'petitioner.petitionerId',
        select: `email`
    })
    .populate({
        path: 'recruiter',
        select: `p_information.name
                p_information.firstSurname
                email`
    })
    .populate({
        path: 'candidates.candidate',
        select: `name firstSurname secondSurname _id birthdate
                phone_number email address marital_status scholarship couses
                english_level certification economic_claims source gender`
    })
    .sort('date_recruitment')
    .skip(page * 5)
    .limit(items)
    .exec(
        (err, recruitments) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                if(!recruitments){
                    res.status(404).send({
                        ok: false,
                        message: 'No existen requisiciones',
                        error: err
                    });
                } else {
                    Recruitment.count(condition, (err, counter) =>{
                        if(err){
                            res.status(500).send({
                                ok: false,
                                message: 'Error contando las requisiciones',
                                error: err
                            });
                        } else {
                            if(counter.length < 1){
                                res.status(200).send({
                                    ok: true,
                                    data: recruitments
                                });
                            } else {
                                let totalpages = Math.ceil(counter / 5);
                                res.status(200).send({
                                    ok: true,
                                    data: recruitments,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        }
                    });
                }
            }
        });
}

function assignRecruiter(req, res){
    let recruitmentId = mongoose.Types.ObjectId(req.params.id);
    let recruiterId = req.body.recruiter;
    let allocatorName = req.body.allocatorName;
    let deadline = req.body.deadline;

    Recruitment.findByIdAndUpdate(recruitmentId,
        {$set: {
            'recruiter': recruiterId,
            'receptionDate': new Date(),
            'status': 'En proceso',
            'allocator': allocatorName,
            'deadline': deadline
        }}, {new: true},
    (err, recruitmrntUpdate) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            if(!recruitmrntUpdate){
                res.status(404).send({
                    ok: false,
                    message: 'No se pudo actualizar la requisición',
                    error: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: recruitmrntUpdate
                });
            }
        }
    });
};

function reassignRecruiter(req, res){
    let recruitmentId = mongoose.Types.ObjectId(req.params.id);
    let recruiterId = req.body.recruiter;
    let allocatorName = req.body.allocatorName;

    Recruitment.findByIdAndUpdate(recruitmentId,
        {$set: {
            'recruiter': recruiterId,
            'allocator': allocatorName
        }}, {new: true},
    (err, recruitmrntUpdate) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            if(!recruitmrntUpdate){
                res.status(404).send({
                    ok: false,
                    message: 'No se pudo actualizar la requisición',
                    error: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: recruitmrntUpdate
                });
            }
        }
    });
};

/*
 * Obtener las requisiciones de cada reclutador
 */
function getRecruitmentsByRecruiter(req, res){
    let recruiter = mongoose.Types.ObjectId(req.params.recruiter);
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 5 : 0;
    let query;

    if(items){
        query = [{ $match: {'recruiter': recruiter}},
                { $sort: { 'status': -1, 'date_recruitment': 1 }},
                { $skip: page * 5 },
                { $limit: items }];
    } else {
        query = [{ $match: {'recruiter': recruiter}},
                { $sort: { 'date_recruitment': 1 }}];
    }

    Recruitment.aggregate(
        query, (err, recruitments)=>{
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición'
                });
            } else {
                if(!recruitments){
                    res.status(404).send({
                        ok: false,
                        message: 'No hay requisiciones con este reclutador'
                    });
                } else {
                    Recruitment.aggregate([
                        { $match: {'recruiter': recruiter}},
                        { $sort: { 'date_recruitment': 1 }},
                        { $count: "results" },
                        { $unwind: "$results" }
                    ], (err, counter) =>{
                        if(err){
                            res.status(500).send({
                                ok: false,
                                message: 'Error al contar las requisiciones'
                            });
                        } else {
                            if(counter.length < 1){
                                res.status(200).send({
                                    ok: true,
                                    data: recruitments
                                });
                            } else {
                                let totalpages = Math.ceil(counter[0].results / 5);
                                res.status(200).send({
                                    ok: true,
                                    data: recruitments,
                                    total: counter[0].results,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        }
                    });
                }
            }
        });
}

/*
 * Obtener las requisiciones de cada solicitante
 */
function getRecruitmentsByPetitioner(req, res){
    let petitioner = mongoose.Types.ObjectId(req.params.petitioner);
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 5 : 0;

    Recruitment.find({ 'petitioner.petitionerId': petitioner })
    .populate({
        path: 'recruiter',
        select: `p_information.name
                p_information.firstSurname
                email`
    })
    .populate({
        path: 'candidates.candidate',
        select: `name firstSurname secondSurname _id birthdate
                phone_number email address marital_status scholarship couses
                english_level certification economic_claims source gender`
    })
    .sort('date_recruitment')
    .skip(page * 5)
    .limit(items)
    .exec(
        (err, recruitments) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                if(!recruitments){
                    res.status(404).send({
                        ok: false,
                        message: 'No existen requisiciones',
                        error: err
                    });
                } else {
                    Recruitment.count({ 'petitioner.petitionerId': petitioner }, (err, counter) =>{
                        if(err){
                            res.status(500).send({
                                ok: false,
                                message: 'Error contando las requisiciones',
                                error: err
                            });
                        } else {
                            if(counter.length < 1){
                                res.status(200).send({
                                    ok: true,
                                    data: recruitments
                                });
                            } else {
                                let totalpages = Math.ceil(counter / 5);
                                res.status(200).send({
                                    ok: true,
                                    data: recruitments,
                                    total: counter,
                                    currentPage: page + 1,
                                    totalPages: totalpages
                                });
                            }
                        }
                    });
                }
            }
        });
}

var assignCandidate = (req, res) => {
    let recruitmentId = mongoose.Types.ObjectId(req.params.id);
    let candidate = req.body;

    Recruitment.updateOne({_id: recruitmentId},{
        $addToSet: {
            'candidates': candidate
        }
    }, {new: true}, (err, storedCandidate) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición.',
                error: err
            });
        } else {
            if(!storedCandidate){
                res.status(400).send({
                    ok: false,
                    message: 'La descripción de puesto no pudo ser generada.',
                    error: err
                });
            } else {
                Candidate.findByIdAndUpdate(req.body.candidate,
                {$set: {'status': 'En proceso'}}, {new: true}, (err, candidateUpdated) => {
                    if(err){
                        res.status(500).send({
                            ok: false,
                            message: 'Error en la petición de actualizar estatus',
                            error: err
                        });
                    } else {
                        res.status(200).send({
                            ok: true,
                            data: storedCandidate
                        });
                    }
                });
            }
        }
    });
};

function storeEvaluationsOfCandidate(req, res){
    let candidateId = mongoose.Types.ObjectId(req.params.candidate);
    let evaluations = req.body;
    let query;

    if(evaluations.initialInterview){
        query = {
            'candidates.$.initialInterview': evaluations.initialInterview,
            'candidates.$.stage': evaluations.nextStage,
            'candidates.$.initialInterview_date': new Date()
        };
    } else if(evaluations.technicalTest){
        query = {
            'candidates.$.technicalTest': evaluations.technicalTest,
            'candidates.$.stage': 'Entrevista Líder',
            'candidates.$.technicalTest_date': new Date()
        };
    } else if (evaluations.leaderInterview) {
        query = {
            'candidates.$.stage': 'Prueba Psicométrica',
            'candidates.$.interviews_date': new Date()
        };
    } else if(evaluations.psychometricTest){
        query = {
            'candidates.$.psychometricTest': evaluations.psychometricTest,
            'candidates.$.stage': 'Propuesta Económica',
            'candidates.$.psychometricTest_date': new Date()
        };
    } else if(evaluations.economicProposal){
        query = {
            'candidates.$.economicProposal': evaluations.economicProposal,
            // 'candidates.$.status': 'Aprobado',
            // 'candidates.$.stage': 'Firma de Contrato',
            'candidates.$.economicProposal_date': new Date()
        };
    }

    Recruitment.updateOne({'candidates._id': candidateId}, {$set:
        query
    }, {new: true},(err, candidateUpdated) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            if(!candidateUpdated){
                res.status(404).send({
                    ok: false,
                    message:'No se pudo actualizar el candidato',
                    error: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: candidateUpdated
                });
            }
        }
    });
}

function storeInterview(req, res){
    let candidateId = mongoose.Types.ObjectId(req.params.candidate);
    let recruitmentId = mongoose.Types.ObjectId(req.params.id);
    let interview = req.body;

    Recruitment.updateOne({$and: [{_id: recruitmentId}, {'candidates.candidate': candidateId}]}, {
        $addToSet: {
            'candidates.$.interviews': interview
        }
    }, {new: true}, (err, storedInterview) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            if(!storedInterview){
                res.status(404).send({
                    ok: false,
                    message: 'No se pudo generar la información de la entrevista',
                    error: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: storedInterview
                });
            }
        }
    });
}

function getCandidateInfo(req, res){
    let candidateId = mongoose.Types.ObjectId(req.params.id);

    Recruitment.find({'candidates.candidate': candidateId},
    {'position.positionName': 1, 'candidates.$': 1})
    .populate({
        path: 'candidates.candidate',
        select: `name firstSurname secondSurname _id candidate_date birthdate
                phone_number email address marital_status scholarship courses
                english_level certification economic_claims source gender status`
    })
    .exec(
    (err, candidateInfo) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            if(!candidateInfo){
                res.status(404).send({
                    ok: false,
                    message: 'El candidato no existe',
                    error: err
                });
            } else if(candidateInfo.length == 0){
                Candidate.findById(candidateId, (err, getCandidateInfo) => {
                    if(err){
                        res.status(500).send({
                            ok: false,
                            message: 'Error en la petición',
                            error: err
                        });
                    } else if(!getCandidateInfo){
                        res.status(404).send({
                            ok: false,
                            message: 'El candidato no existe',
                            error: err
                        });
                    } else {
                        res.status(200).send({
                            ok: true,
                            info: getCandidateInfo
                        });
                    }
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: candidateInfo
                });
            }
        }
    });
};

function recruitmentsToValidate(req, res){
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;
    let validator = req.params.validator;
    let leaderId = req.params.id;
    let query;

    if(validator === 'do'){
        query = {$and: [{'approvals.do': false},{'status': 'Pendiente'},{'area_leader': {$exists: false}}]};
    } else if(validator === 'daf'){
        query = {$or:
            [
                {$and: [{'approvals.daf': false},{'status': 'Pendiente'}]},
                {$and: [{'approvals.daf': false},{'status': 'Pendiente'},{'area_leader.areaLeaderId': leaderId}]}
            ]};
        } else if(validator === 'dt'){
            query = {$or:
            [
                {$and: [{'approvals.dt': false},{'status': 'Pendiente'}]},
                {$and: [{'approvals.dt': false},{'status': 'Pendiente'},{'area_leader.areaLeaderId': leaderId}]}
            ]};
        } else if(validator === 'la'){
            query = {$and: [{'approvals.do': false},{'status': 'Pendiente'},{'area_leader.areaLeaderId': leaderId}]}
        }

    Recruitment.find(query)
    .populate({
        path: 'petitioner.petitionerId',
        select: `email`
    })
    .skip(page * 10)
    .limit(items)
    .exec(
        (err, getInfo) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                if(!getInfo){
                    res.status(404).send({
                        ok: false,
                        message: 'No se encontró ninguna requisición',
                        error: err
                    });
                } else {
                    Recruitment.count(query, (err, counter) => {
                        if(err){
                            res.status(500).send({
                                ok: false,
                                message: 'Error al contar requisiciones',
                                error: err
                            });
                        } else {
                            if(!counter){
                                res.status(200).send({
                                    ok: true,
                                    data:getInfo,
                                    total: 0,
                                    currentPage: 1
                                });
                            } else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    ok: true,
                                    data: getInfo,
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
}

function updateRecruitment(req, res){
    let recruitmentId = req.params.id;
    let update = req.body;
    update.approvals = {
        do: false,
        daf: false,
        dt: false
    };
    update.status = 'Pendiente';

    Recruitment.updateOne({'_id': recruitmentId}, {
        $set: update
    }, {new: true}, (err, recruitmentUpdated) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            if(!recruitmentUpdated){
                res.status(404).send({
                    ok: false,
                    message: 'La requisición no existe',
                    error: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: recruitmentUpdated
                });
            }
        }
    });
}

function recruitmentsToBeAssigned(req, res){
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 4 : 0;

    
    Recruitment.find({$and: [{'recruiter': {$exists: false}}, {'status': 'Aprobada'}]})
    .skip(page * 4)
    .limit(items)
    .exec(
        (err, getRecruitments) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                if(!getRecruitments){
                    res.status(404).send({
                        ok: false,
                        message: 'No hay requisiciones por asignar',
                        error: err
                    });
                } else {
                    Recruitment.count({$and: [{'recruiter': {$exists: false}}, {'status': 'Aprobada'}]},
                    (err, counter) => {
                        if(err){
                            res.status(500).send({
                                ok: false,
                                message: 'Error al contar las requisicones',
                                error: err
                            });
                        } else {
                            if(!counter){
                                res.status(200).send({
                                    ok: true,
                                    data: getRecruitments,
                                    total: 0,
                                    currentPage: 1
                                });
                            } else {
                                let totalpages = Math.ceil(counter / 4);
                                res.status(200).send({
                                    ok: true,
                                    data: getRecruitments,
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
}

function refuseRequisition(req, res){
    let recruitmentId = req.params.id;
    let validator = req.params.validator;
    let query;

    if(validator == 'do'){
        query = {
            $set: {
                'status': 'Rechazada',
                'approvals.do': false,
                'rejectionComments': req.body.rejectionComments
            },
            $currentDate: {
                "approvals.date_do": true
            }
        };
    } else if(validator == 'dt'){
        query = {
            $set: {
                'status': 'Rechazada',
                'approvals.dt': false,
                'rejectionComments': req.body.rejectionComments
            },
            $currentDate: {
                "approvals.date_dt": true
            }
        };
    } else if(validator == 'daf'){
        query = {
            $set: {
                'status': 'Rechazada',
                'approvals.daf': false,
                'rejectionComments': req.body.rejectionComments
            },
            $currentDate: {
                "approvals.date_daf": true
            }
        };
    }

    Recruitment.findByIdAndUpdate(recruitmentId, query, {new: true}, (err, recruitmentUpdated) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            if(!recruitmentUpdated){
                res.status(404).send({
                    ok: false,
                    message: 'La requisición no existe',
                    error: err
                });
            } else {
                res.status(200).send({
                    ok: true,
                    data: recruitmentUpdated
                });
            }
        }
    });
}

function validatedLeaderOrValidator(req, res){
    let validatorId = mongoose.Types.ObjectId(req.params.validatorId);

    Recruitment.find({'area_leader.areaLeaderId': validatorId},
    {'area_leader.$': 1}, (err, getLeader) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            if(getLeader.length >= 1){
                res.status(200).send({
                    validator: true
                });
            } else {
                Configuration.find({$or: [
                    {'requisition.rhValidation': validatorId},
                    {'requisition.doValidation': validatorId},
                    {'requisition.dfValidation': validatorId}
                ]}, {'requisition.$': 1}, (err, getConfig) => {
                    if(err){
                        res.status(500).send({
                            ok: false,
                            message: 'Error en la petición',
                            error:err
                        });
                    } else {
                        if(getConfig.length == 0){
                            res.status(200).send({
                                validator: false
                            });
                        } else {
                            res.status(200).send({
                                validator: true
                            });
                        }
                    }
                });
            }
        }
    });
}

function currentRecruitments(req, res){
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;
    let variable = req.params.variable;
    let query;

    if(variable === 'ALL'){
        query = {'status': 'En proceso'}
    } else {
        query = {$and: [{'status': 'En proceso'}, {'recruiter': variable}]}
    }

    Recruitment.find(query)
    .populate({
        path: 'recruiter',
        select: `p_information.name p_information.firstSurname`
    })
    .skip(page * 10)
    .limit(items)
    .exec(
        (err, getRecruitments) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                Recruitment.count(query, (err, counter) => {
                    if(err){
                        res.status(404).send({
                            ok: false,
                            message: 'Error al contar las requisiciones',
                            error: err
                        });
                    } else {
                        if(!counter){
                            res.status(200).send({
                                ok: true,
                                data: getRecruitments,
                                total: 0,
                                currentPage: 1
                            });
                        } else {
                            let totalpages = Math.ceil(counter / 10);
                            res.status(200).send({
                                ok: true,
                                data: getRecruitments,
                                total: counter,
                                currentPage: page + 1,
                                totalPages: totalpages
                            });
                        }
                    }
                });
            }
        }
    );
}

function expiredRecruitments(req, res){
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;
    let variable = req.params.variable;
    let query;

    if(variable === 'ALL'){
        query = {'status': 'Vencida'}
    } else {
        query = {$and: [{'status': 'Vencida'}, {'recruiter': variable}]}
    }

    Recruitment.find(query)
    .populate({
        path: 'recruiter',
        select: `p_information.name p_information.firstSurname`
    })
    .skip(page * 10)
    .limit(items)
    .exec(
        (err, getRecruitments) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                Recruitment.count(query, (err, counter) => {
                    if(err){
                        res.status(404).send({
                            ok: false,
                            message: 'Error al contar las requisiciones',
                            error: err
                        });
                    } else {
                        if(!counter){
                            res.status(200).send({
                                ok: true,
                                data: getRecruitments,
                                total: 0,
                                currentPage: 1
                            });
                        } else {
                            let totalpages = Math.ceil(counter / 10);
                            res.status(200).send({
                                ok: true,
                                data: getRecruitments,
                                total: counter,
                                currentPage: page + 1,
                                totalPages: totalpages
                            });
                        }
                    }
                });
            }
        }
    );
}

function recruitmentsCovered(req, res){
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;
    let month = parseInt(moment().month()) + 1;
    let variable = req.params.variable;
    let query;

    if(variable === 'ALL'){
        query = {$and:
            [
                {'status': 'Cubierta'},
                {"$expr": { "$eq": [{"$month": "$vacancyCover_date"}, month]}}
            ]
        }
    } else {
        query = {$and:
            [
                {'status': 'Cubierta'},
                {"$expr": { "$eq": [{"$month": "$date_recruitment"}, month]}},
                {'recruiter': variable}
            ]
        }
    }

    Recruitment.find(query)
    .populate({
        path: 'recruiter',
        select: `p_information.name p_information.firstSurname`
    })
    .skip(page * 10)
    .limit(items)
    .exec(
        (err, getRecruitments) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                Recruitment.count(query, (err, counter) => {
                    if(err){
                        res.status(404).send({
                            ok: false,
                            message: 'Error al contar las requisiciones',
                            error: err
                        });
                    } else {
                        if(!counter){
                            res.status(200).send({
                                ok: true,
                                data: getRecruitments,
                                total: 0,
                                currentPage: 1
                            });
                        } else {
                            let totalpages = Math.ceil(counter / 10);
                            res.status(200).send({
                                ok: true,
                                data: getRecruitments,
                                total: counter,
                                currentPage: page + 1,
                                totalPages: totalpages
                            });
                        }
                    }
                });
            }
        }
    );
}

function recruitmentsClosed(req, res){
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;
    let month = parseInt(moment().month()) + 1;
    let query;

    query = {$and:
        [
            {'status': 'Cerrada'},
            {"$expr": { "$eq": [{"$month": "$vacancyClosing_date"}, month]}}
        ]
    };

    Recruitment.find(query)
    .populate({
        path: 'recruiter',
        select: `p_information.name p_information.firstSurname`
    })
    .skip(page * 10)
    .limit(items)
    .exec(
        (err, getRecruitments) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                Recruitment.count(query, (err, counter) => {
                    if(err){
                        res.status(404).send({
                            ok: false,
                            message: 'Error al contar las requisiciones',
                            error: err
                        });
                    } else {
                        if(!counter){
                            res.status(200).send({
                                ok: true,
                                data: getRecruitments,
                                total: 0,
                                currentPage: 1
                            });
                        } else {
                            let totalpages = Math.ceil(counter / 10);
                            res.status(200).send({
                                ok: true,
                                data: getRecruitments,
                                total: counter,
                                currentPage: page + 1,
                                totalPages: totalpages
                            });
                        }
                    }
                });
            }
        }
    );
}

function getRecruitmentsStatus(req, res){
    let page = req.params.page || 0;
    page = req.params.page > 1 ? page - 1 : 0;
    let items = req.params.page ? 10 : 0;

    Recruitment.find({'status': {$in: ['En proceso', 'Cubierta', 'Vencida', 'Cerrada']}})
    .populate({
        path: 'recruiter',
        select: `p_information.name p_information.firstSurname`
    })
    .sort({'status': -1, 'recruiter': 1, 'position.positionName': 1})
    .skip(page * 10)
    .limit(items)
    .exec(
        (err, getRecruitments) => {
            if(err){
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    error: err
                });
            } else {
                if(!getRecruitments){
                    res.status(404).send({
                        ok: false,
                        message: 'No existen requisiciones',
                        error: err
                    });
                } else {
                    Recruitment.count({'status': {$in:
                        ['En proceso', 'Cubierta', 'Vencida', 'Cerrada']
                    }}, (err, counter) => {
                        if(err){
                            res.status(500).send({
                                ok: false,
                                message: 'Error al contar las requisiciones',
                                error: err
                            });
                        } else {
                            if(!counter){
                                res.status(200).send({
                                    ok: true,
                                    data: getRecruitments,
                                    total: 0,
                                    currentPage: 1
                                });
                            } else {
                                let totalpages = Math.ceil(counter / 10);
                                res.status(200).send({
                                    ok: true,
                                    data: getRecruitments,
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

function recruitmentInfo(req, res){
    let recruiterId = mongoose.Types.ObjectId(req.params.id);
    let month = parseInt(moment().month()) + 1;

    Recruitment.aggregate([
        {$match: {$or: [
            {'status':'En proceso'},
            {'status':'Vencida'},
            {$and: [{'status':'Cerrada'},{"$expr": { "$eq": [{"$month": "$vacancyClosing_date"}, month]}}]},
            {$and: [{'status':'Cubierta'},{"$expr": { "$eq": [{"$month": "$vacancyCover_date"}, month]}}]}
            ]}
        },
        {
            $project: {
                _id: 1,
                'status': 1,
                'date_recruitment': 1
            }
        },
        {
            $group: {
                _id: '$status',
                counter: {$sum: 1}
            }
        }
    ], (err, getAllRecruitments) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición que obtiene todas las requisiciones',
                error: err
            });
        } else {
            Recruitment.aggregate([
                {$match: {'recruiter':recruiterId}},
                {$match: {$or: [
                    {'status':'En proceso'},
                    {'status':'Vencida'},
                    {$and: [{'status':'Cubierta'},{"$expr": { "$eq": [{"$month": "$vacancyCover_date"}, month]}}]}
                    ]}
                },
                {
                    $project: {
                        _id: 1,
                        'status': 1,
                        'date_recruitment': 1
                    }
                },
                {
                    $group: {
                        _id: '$status',
                        counter: {$sum: 1}
                    }
                }
            ], (err, getRecruitmentsByRecruiter) => {
                if(err){
                    res.status(500).send({
                        ok: false,
                        message: 'Error en la petición que obtiene las requisiciones del reclutador',
                        error: err
                    });
                } else {
                    Recruitment.aggregate([
                        {$match: {$or: [
                            {'status':'En proceso'},
                            {'status':'Vencida'},
                            {$and: [{'status':'Cerrada'},{"$expr": { "$eq": [{"$month": "$vacancyClosing_date"}, month]}}]},
                            {$and: [{'status':'Cubierta'},{"$expr": { "$eq": [{"$month": "$vacancyCover_date"}, month]}}]}
                            ]}
                        },
                        {
                            $project: {
                                _id: 1,
                                'status': 1,
                                'date_recruitment': 1,
                                'recruiter': 1
                            }
                        },
                        {
                            $group: {
                                _id: '$recruiter',
                                counter: {$sum: 1}
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "_id",
                                foreignField: "_id",
                                as: "recruiter"
                            }
                        },
                        { $unwind: "$recruiter" },
                        { $project: {
                                        _id: 0,
                                        "recruiter.p_information.name": 1,
                                        "recruiter.p_information.firstSurname": 1,
                                        "counter": 1
                                  }
                        },
                    ], (err, assignments) => {
                        if(err){
                            res.status(500).send({
                                ok: false,
                                message: 'Error en la petición que obtiene las asignaciones de operaciones',
                                error: err
                            });
                        } else {
                            res.status(200).send({
                                ok: true,
                                all: getAllRecruitments,
                                recruiter: getRecruitmentsByRecruiter,
                                assignments: assignments
                            });
                            
                        }
                    });
                }
            });
        }
    });
};

function validatedInterviewer(req, res){
    let interviewerId = mongoose.Types.ObjectId(req.params.interviewerId);

    Recruitment.find({$and: [
        {'status': {$in: ['En proceso', 'Vencida']}},
        {'interviewers.interviewer': interviewerId}]}, {'recruiter': 1}, (err, getInterviewer) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else if(getInterviewer.length >= 1){
            res.status(200).send({
                interviewer: true,
            });
        } else {
            res.status(200).send({
                interviewer: false
            });
        }
    });
};

function getCandidatesToInterview(req, res){
    let interviewerId = req.params.interviewerId;

    Recruitment.find({$and: [
        {'status': {$in: ['En proceso', 'Vencida']}},
        {'interviewers.interviewer': interviewerId}]},
        {'_id': 1, 'position.positionName': 1, 'candidates': 1, 'recruiter': 1})
    .populate({
        path: 'candidates.candidate',
        select: `name firstSurname secondSurname _id`
    })
    .populate({
        path: 'recruiter',
        select: `email`
    })
    .exec(
        (err, getInterviewer) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else {
            const candidates = [];
            getInterviewer.forEach((vacancy, index, array) => {
                
                const candidatesArray = vacancy.candidates.map( candidate => {
                    if( candidate.status === 'En proceso' && candidate.stage === 'Entrevista Líder' ) {
            
                        const wasEvaluated = candidate.interviews.find( interview => interview.interviewer == interviewerId);

                        if( !wasEvaluated ) {
                            const candidateData = {
                                candidateName: `${candidate.candidate.name} ${candidate.candidate.firstSurname} ${candidate.candidate.secondSurname}` ,
                                candidateId: candidate.candidate._id,
                                positionName: vacancy.position.positionName,
                                vacancyId: vacancy._id,
                                recruiter: vacancy.recruiter.email
                            }
                            candidates.push(candidateData);
                        }
                    }
                    return candidate;
                });
            });
            res.status(200).send({
                ok: true,
                data: candidates
            });
        }
    });
};

function refuseCandidate(req, res){
    let recruitmentId = req.params.recruitmentId;
    let candidateId = req.params.candidateId;
    let justification = req.body.justification;
    let status = req.body.status;
    let query;

    if(status === 'Rechazado'){
        query = {'status': 'Rechazado'}
    } else if(status === 'Declinado'){
        query = {'status': 'Cartera'}
    }

    Recruitment.updateOne({$and: [{'_id': recruitmentId}, {'candidates.candidate': candidateId}]},
    {
        $set: {
            'candidates.$.status': status, 
            'candidates.$.justification': justification,
            'candidate.$.candidateRejection_date': new Date()
        }
    },
    {new: true}, (err, candidateRecUpdated) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else if(!candidateRecUpdated){
            res.status(404).send({
                ok: false,
                message: 'No se pudo actualizar el estatus del candidato en la requisición',
                errro: err
            });
        } else {
            Candidate.findByIdAndUpdate(candidateId, {$set: query},
            {new: true}, (err, candidateUpdated) => {
                if(err){
                    res.status(500).send({
                        ok: false,
                        message: 'Error en la petición del modelo de candidato',
                        error: err
                    });
                } else if(!candidateUpdated){
                    res.status(404).send({
                        ok: false,
                        message: 'No se pudo actualizar el estatus del candidato',
                        error: err
                    });
                } else {
                    res.status(200).send({
                        ok: true,
                        message: 'Se actualizó el estatus del candidato'
                    });
                }
            });
        }
    });
};

function approveCandidate(req, res){
    let recruitmentId = req.params.recruitmentId;
    let candidateId = req.params.candidateId;
    let admission_date = req.body.admission_date;
    let id_neixar = req.body.id_neixar;

    Recruitment.updateOne({$and: [{'_id': recruitmentId}, {'candidates.candidate': candidateId}]},
    {$set: {
        'candidates.$.status': 'Aprobado',
        'candidates.$.stage': 'Firma de Contrato',
        'candidates.$.admission_date': admission_date,
        'candidates.$.id_neixar': id_neixar
    }}, {new: true}, (err, approvedCandidate) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else if(!approvedCandidate){
            res.status(404).send({
                ok: false,
                message: 'No se encontró al candidato',
                error: err
            });
        } else {
            Candidate.findByIdAndUpdate(candidateId, {$set: {'status': 'Contratado'}},
            {new: true}, (err, candidateUpdated) => {
                if(err){
                    res.status(500).send({
                        ok: false,
                        message: 'Error en la petición del modelo de candidato',
                        error: err
                    });
                } else if(!candidateUpdated){
                    res.status(404).send({
                        ok: false,
                        message: 'No se pudo actualizar el estatus del candidato',
                        error: err
                    });
                } else {
                    res.status(200).send({
                        ok: true,
                        message: 'Se actualizó el estatus del candidato'
                    });
                }
            });
        }
    });
};

function vacantCover(req, res){
    let recruitmentId = req.params.recruitmentId;
    let candidates = req.body;

    Recruitment.findByIdAndUpdate(recruitmentId, {
        $set: {
            'status': 'Cubierta',
            'vacancyCover_date': new Date()
        }
    },
    {new: true}, (err, updateRecruitment) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else if(!updateRecruitment){
            res.status(404).send({
                ok: false,
                message: 'No se pudo actualizar el estatus de la requisición',
                error: err
            });
        } else {
            var criteria = {
                '_id':{ $in: candidates }
            };
            Candidate.update( criteria, {
                $set: {'status': "Cartera"}}, {multi: true, new: true}, (err, candidatesUpdated) => {
                if(err){
                    res.status(500).send({
                        ok: false,
                        message: 'Error en la petición',
                        error: err
                    });
                } else if(!candidatesUpdated) {
                    res.status(404).send({
                        ok: false,
                        message: 'No se pudo actualizar el estatus de los candidatos',
                        error: err
                    });
                } else {
                    res.status(200).send({
                        ok: true,
                        data: candidatesUpdated,
                        message: 'Requisición cubierta y candidatos a cartera'
                    });
                }
            });
        }
    });
};

function closedRecruitment(req, res){
    let recruitmentId = req.params.recruitmentId;
    let rejection = req.body.rejection;
    let candidates = req.body.candidates;

    Recruitment.findByIdAndUpdate(recruitmentId, {
        $set: {
            'status': 'Cerrada', 
            'closingReasons': rejection,
            'vacancyClosing_date': new Date()
        }
    },
    {new: true}, (err, updateRecruitment) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else if(!updateRecruitment){
            res.status(404).send({
                ok: false,
                message: 'No se pudo cerrar la requisición',
                error: err
            });
        } else {
            var criteria = {
                '_id':{ $in: candidates }
            };
            Candidate.update( criteria, {$set: {'status': "Cartera"}}, {multi: true, new: true}, (err, candidatesUpdated) => {
                if(err){
                    res.status(500).send({
                        ok: false,
                        message: 'Error en la petición',
                        error: err
                    });
                } else if(!candidatesUpdated) {
                    res.status(404).send({
                        ok: false,
                        message: 'No se pudo actualizar el estatus de los candidatos',
                        error: err
                    });
                } else {
                    res.status(200).send({
                        ok: true,
                        data: candidatesUpdated,
                        message: 'Requisición cerrada y candidatos a cartera'
                    });
                }
            });
        }
    });
};

function resetRecruitment(req, res){
    let recruitmentId = req.params.recruitmentId;
    let resetComments = req.body.resetComments;

    Recruitment.findByIdAndUpdate(recruitmentId, {$set: {'status': 'En proceso', 'resetComments': resetComments}},
    {new: true}, (err, recruitmentRestored) => {
        if(err){
            res.status(500).send({
                ok: false,
                message: 'Error en la petición',
                error: err
            });
        } else if(!recruitmentRestored){
            res.status(404).send({
                ok: false,
                message: 'No se pudo restablecer la requisición',
                error: err
            });
        } else {
            res.status(200).send({
                ok: true,
                data: recruitmentRestored,
                message: 'Se restableció la requisición'
            });
        }
    });
};

module.exports = {
    store,
    validated,
    statusUpdate,
    getRecruitments,
    assignRecruiter,
    reassignRecruiter,
    getRecruitmentsByRecruiter,
    getRecruitmentsByPetitioner,
    assignCandidate,
    storeEvaluationsOfCandidate,
    storeInterview,
    getCandidateInfo,
    recruitmentsToValidate,
    updateRecruitment,
    recruitmentsToBeAssigned,
    refuseRequisition,
    validatedLeaderOrValidator,
    currentRecruitments,
    expiredRecruitments,
    recruitmentsCovered,
    recruitmentsClosed,
    getRecruitmentsStatus,
    recruitmentInfo,
    validatedInterviewer,
    getCandidatesToInterview,
    refuseCandidate,
    approveCandidate,
    vacantCover,
    closedRecruitment,
    resetRecruitment
}