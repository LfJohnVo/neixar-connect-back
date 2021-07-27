'use strict'

const User = require('../models/user');
const fs = require('fs');
const path = require('path');

function getImage(req, res) {

    var id = req.params.id;
    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al subir la imagen',
            errors: { message: 'No seleccionó ninguna imagen' }
        });
    }

    //Obtener el nombre del archivo
    var file = req.files.imagen;
    var name = file.name.split('.');
    var extencion = name[name.length -1];

    //Definir extenciones de los archivos
    var exVal = ['png', 'jpg']

    if(exVal.indexOf(extencion) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Archivo no válido',
            errors: { message: 'Se debe de seleccionar una imagen PNG ó JPG' }
        });
    }

    //Nombe de archivo personalizado
    var nameDB = `${ id }-${ new Date().getMilliseconds() }.${ extencion }`;

    //Mover el archivo a la ruta específica
    var path = `/home/Documentos/e-neixar/images/avatar/${ nameDB }`;
    //var path = `C:/${ nameDB }`;

    file.mv( path, err =>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        update(id, nameDB, res);
    })
}

function update(id, nameDB, res){
    User.findById(id, (err, usuario) =>{

        //console.log(usuario);
        //Obtener el path anterior de una imagen
        var pathOld = '/home/Documentos/e-neixar/images/avatar/' + usuario.img;
        //var pathOld = 'C:/' + usuario.img;

        //Si existe una imagen en de ese usuario, la elimina
        if(fs.existsSync(pathOld)){
            fs.unlink(pathOld);
        }

        usuario.img = nameDB;

        User.update({"_id": id},
        {$set: {
            "img": usuario.img
        }},
        {new: true}, (err, userUpdate) =>{
            if (err) {
                res.status(500).send({
                    ok: false,
                    message: 'Error en la petición',
                    errors: err
                });
            } else {
                if(!userUpdate){
                    res.status(404).send({
                        ok: false,
                        message: 'El usuario no pudo ser actualizado',
                        errors: err
                    });
                } else {
                    res.status(200).send({
                        ok: true,
                        data: userUpdate
                    });
                }
            }
        })
    })
}

function getImage(req, res){

    var img = req.params.img;

    // Ruta de la imagen requerida
    //var pathImage = path.resolve( __dirname, `/home/Documentos/e-neixar/images/avatar/${ img }`);
    var pathImage = path.resolve(__dirname, `/home/Documentos/e-neixar/images/avatar/${ img }`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-image.png');
        res.sendFile(pathNoImage);
    }

}

module.exports = {
    getImage
};