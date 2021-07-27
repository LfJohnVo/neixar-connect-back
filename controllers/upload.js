'use strict'

const User = require('../models/user');
const fs = require('fs');
const path = '/home/Documentos/e-neixar/images/avatar/';

function saveImage(req, res) {
    var id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            message: 'Debe seleccionar una imagen.'
        });
    }

    //Obtener el nombre del archivo
    var file = req.files.imagen;
    var name = file.name.split('.');
    var extention = name[name.length - 1].toLowerCase();

    // Extenciones aceptadas
    var extentionAccepted = ['png', 'jpg', 'jpeg'];

    if (extentionAccepted.indexOf(extention) < 0) {
        return res.status(400).json({
            message: 'Extensión no válida. El archivo debe tener una extensión .png, .jpg o .jpeg.'
        });
    }

    // Nombre de archivo personalizado
    var fileName = `${ id }-${ new Date().getMilliseconds() }.${ extention }`;

    // Mover archivo del temporal a una ruta específica.
    var folderPath = `${ path }${ fileName }`;

    file.mv(folderPath, (err) => {

        if (err) {
            return res.status(500).json({
                message: 'Error al guardar imagen, inténtalo de nuevo. - Mover archivo'
            });
        }

        registerImage(id, fileName, res);

    });

};

/*
 * Esta función permite guardar el nombre de la imagen en  el documento
 * de la BD del colaborador indicado.
 */
function registerImage(id, fileName, res) {

    User.findById(id, (err, userDB) => {

        if (err) {
            fs.unlink(`${ path }${ fileName }`);
            return res.status(500).json({
                message: 'Colaborador no encontrado. Puede ser que el colaborador ha sido dado de baja.',
                err: err
            });
        }

        if (!userDB) {
            fs.unlink(`${ path }${ fileName }`);
            return res.status(500).json({
                message: 'No existe el colaborador seleccionado.'
            });
        }

        // Obtener nombre de antigua fotografía asociada al colaborador
        var oldFilePath = `${ path }${ userDB.img }`;

        //  Si existe, elimina la imagen anterior
        if (fs.existsSync(oldFilePath)) {
            fs.unlink(oldFilePath);
        }

        // Se guarda el nombre de la imagen en la BD
        User.update({ "_id": id }, { $set: { "img": fileName } }, { new: true }, (err, userUpdate) => {
            if (err) {
                fs.unlink(`${ path }${ fileName }`);
                res.status(500).send({
                    message: 'Error al guardar imagen, inténtalo de nuevo.'
                });
            } else {
                if (!userUpdate) {
                    fs.unlink(`${ path }${ fileName }`);
                    res.status(404).send({
                        message: 'La imagen no pudo ser guardada.'
                    });
                } else {
                    return res.status(200).json({
                        message: 'Imagen guardada exitosamente.'
                    });
                }
            }
        });

    });

};

module.exports = {
    saveImage
};