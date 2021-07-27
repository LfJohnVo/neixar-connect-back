'use strict'

var nodemailer = require('nodemailer');
const email_template = require('../email-template');
const User = require('../models/user');
const Recruitment = require('../models/recruitment');
const Position = require('../models/position');
const jwt = require('../services/jwt');
const mongoose = require('mongoose');

//============================================================
//              ENVIAR CORREO COLABORADOR-JEFE
//============================================================
function toBoss(req, res) {
    let body = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>" +
        "<html lang='es'>" +
        "<head>" +
        "<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />" +
        "<meta name='viewport' content='width=device-width, initial-scale=1.0' />" +
        "<title>NEIXAR CONNECT</title>" +
        "<style type='text/css'>" +
        "@media screen and (max-width: 600px) {table[class='container'] {width: 95% !important;}}" +
        "#outlook a { padding: 0; }" +
        "body {" +
        "width: 100% !important;" +
        "-webkit-text-size-adjust: 100%;" +
        "-ms-text-size-adjust: 100%;" +
        "margin: 0;" +
        "padding: 0;}" +
        ".ExternalClass { width: 100%; }" +
        ".ExternalClass," +
        ".ExternalClass p," +
        ".ExternalClass span," +
        ".ExternalClass font," +
        ".ExternalClass td," +
        ".ExternalClass div { line-height: 100%; }" +
        "#backgroundTable { margin: 0; padding: 0; width: 100% !important; line-height: 100% !important; }" +
        "img {" +
        "outline: none;" +
        "text-decoration: none;" +
        "-ms-interpolation-mode: bicubic;}" +
        "a img {" +
        "border: none;}" +
        ".image_fix { display: block; }" +
        "p { margin: 1em 0; }" +
        "h1, h2, h3, h4, h5, h6 { color: black !important; }" +
        "h1 a, h2 a, h3 a, h4 a, h5 a, h6 a { color: blue !important; }" +
        "h1 a:active, h2 a:active, h3 a:active, h4 a:active, h5 a:active, h6 a:active { color: red !important; }" +
        "h1 a:visited, h2 a:visited, h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited { color: purple !important; }" +
        "table td { border-collapse: collapse; }" +
        "table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }" +
        "a { color: #000; }" +
        "@media only screen and (max-device-width: 480px) {" +
        "a[href^='tel']," +
        "a[href^='sms'] {" +
        "text-decoration: none;" +
        "color: black;" +
        "pointer-events: none;" +
        "cursor: default; }" +
        ".mobile_link a[href^='tel']," +
        ".mobile_link a[href^='sms'] {" +
        "text-decoration: default;" +
        "color: white !important;" +
        "pointer-events: auto;" +
        "cursor: default; } }" +
        "@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {" +
        "a[href^='tel']," +
        "a[href^='sms'] {" +
        "text-decoration: none;" +
        "color: white !important;" +
        "pointer-events: none;" +
        "cursor: default; }" +
        ".mobile_link a[href^='tel']," +
        ".mobile_link a[href^='sms'] {" +
        "text-decoration: default;" +
        "color: orange !important;" +
        "pointer-events: auto;" +
        "cursor: default; } }" +
        "h2 {" +
        "color: #181818; font-family: Helvetica, Arial, sans-serif; font-size: 22px; line-height: 22px; font-weight: normal; }" +
        "a.link2 {" +
        "color: #fff !important; text-decoration: none; font-family: Helvetica, Arial, sans-serif; font-size: 16px; border-radius: 4px; }" +
        "p {" +
        "color: #555; font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 160%; }" +
        "</style>" +
        "<script type='colorScheme' class='swatch active'>" +
        "{ 'name':'Default', 'bgBody':'ffffff', 'link':'fff', 'color':'555555', 'bgItem':'ffffff', 'title':'181818' }" +
        "</script>" +
        "</head>" +
        "<body>" +
        "<table cellpadding='0' width='100%' cellspacing='0' border='0' id='backgroundTable' class='bgBody'>" +
        "<tr> <td>" +
        "<table cellpadding='0' width='620' class='container' align='center' cellspacing='0' border='0'>" +
        "<tr> <td>" +
        "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td class='movableContentContainer bgItem'>" +
        "<div class='movableContent'>" +
        "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='200' valign='top'>&nbsp;</td>" +
        "<td width='200' valign='top' align='center'>" +
        "<div class='contentEditableContainer contentImageEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<img src='http://3.96.32.250/assets/img/login.png' height='140' alt='NEIXAR CONNECT' data-default='placeholder' />" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<tr height='25'>" +
        "<td width='200'>&nbsp;</td>" +
        "<td width='200'>&nbsp;</td>" +
        "<td width='200'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>" +
        "<div class='movableContent'>" +
        "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Evaluación Semestral de Objetivos SMART " + req.body.year + "</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p align='justify'>Estimado colaborador." +
        "<br/>" +
        "<br/><strong>" + req.body.name + "</strong> ha concluido con el registro de avance de sus objetivos SMART." +
        "<br/>" +
        "<br/>Favor de validarlo en la platafoma.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>" +
        "<div class='movableContent'>" +
        "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='2' style='padding-top:25px;'>" +
        "<hr style='height:1px;border:none;color:#333;background-color:#ddd;' />" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='60%' height='70' valign='middle' style='padding-bottom:20px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<span style='font-size:13px;color:#181818;font-family:Helvetica, Arial, sans-serif;line-height:200%;'>Enviado por NEIXAR CONNECT</span>" +
        "<br/>" +
        "<span style='font-size:11px;color:#555;font-family:Helvetica, Arial, sans-serif;line-height:200%;'>Automation | Development Team </span>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</body>" +
        "</html>";

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        } else {
            console.log('Notificación registro de avance de objetivos enviada correctamente a ' + req.body.TO);
            res.status(200).json({
                ok: true,
                mensaje: 'El correo ha sido enviado, favor de verificar...'
            });
        }
    });
}

//============================================================
//              ENVIAR CORREO JEFE-COLABORADOR
//============================================================
function toEmployee(req, res) {
    let body = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>" +
        "<html lang='es'>" +
        "<head>" +
        "<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />" +
        "<meta name='viewport' content='width=device-width, initial-scale=1.0' />" +
        "<title>NEIXAR CONNECT</title>" +
        "<style type='text/css'>" +
        "@media screen and (max-width: 600px) {table[class='container'] {width: 95% !important;}}" +
        "#outlook a { padding: 0; }" +
        "body {" +
        "width: 100% !important;" +
        "-webkit-text-size-adjust: 100%;" +
        "-ms-text-size-adjust: 100%;" +
        "margin: 0;" +
        "padding: 0;}" +
        ".ExternalClass { width: 100%; }" +
        ".ExternalClass," +
        ".ExternalClass p," +
        ".ExternalClass span," +
        ".ExternalClass font," +
        ".ExternalClass td," +
        ".ExternalClass div { line-height: 100%; }" +
        "#backgroundTable { margin: 0; padding: 0; width: 100% !important; line-height: 100% !important; }" +
        "img {" +
        "outline: none;" +
        "text-decoration: none;" +
        "-ms-interpolation-mode: bicubic;}" +
        "a img {" +
        "border: none;}" +
        ".image_fix { display: block; }" +
        "p { margin: 1em 0; }" +
        "h1, h2, h3, h4, h5, h6 { color: black !important; }" +
        "h1 a, h2 a, h3 a, h4 a, h5 a, h6 a { color: blue !important; }" +
        "h1 a:active, h2 a:active, h3 a:active, h4 a:active, h5 a:active, h6 a:active { color: red !important; }" +
        "h1 a:visited, h2 a:visited, h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited { color: purple !important; }" +
        "table td { border-collapse: collapse; }" +
        "table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }" +
        "a { color: #000; }" +
        "@media only screen and (max-device-width: 480px) {" +
        "a[href^='tel']," +
        "a[href^='sms'] {" +
        "text-decoration: none;" +
        "color: black;" +
        "pointer-events: none;" +
        "cursor: default; }" +
        ".mobile_link a[href^='tel']," +
        ".mobile_link a[href^='sms'] {" +
        "text-decoration: default;" +
        "color: white !important;" +
        "pointer-events: auto;" +
        "cursor: default; } }" +
        "@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {" +
        "a[href^='tel']," +
        "a[href^='sms'] {" +
        "text-decoration: none;" +
        "color: white !important;" +
        "pointer-events: none;" +
        "cursor: default; }" +
        ".mobile_link a[href^='tel']," +
        ".mobile_link a[href^='sms'] {" +
        "text-decoration: default;" +
        "color: orange !important;" +
        "pointer-events: auto;" +
        "cursor: default; } }" +
        "h2 {" +
        "color: #181818; font-family: Helvetica, Arial, sans-serif; font-size: 22px; line-height: 22px; font-weight: normal; }" +
        "a.link2 {" +
        "color: #fff !important; text-decoration: none; font-family: Helvetica, Arial, sans-serif; font-size: 16px; border-radius: 4px; }" +
        "p {" +
        "color: #555; font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 160%; }" +
        "</style>" +
        "<script type='colorScheme' class='swatch active'>" +
        "{ 'name':'Default', 'bgBody':'ffffff', 'link':'fff', 'color':'555555', 'bgItem':'ffffff', 'title':'181818' }" +
        "</script>" +
        "</head>" +
        "<body>" +
        "<table cellpadding='0' width='100%' cellspacing='0' border='0' id='backgroundTable' class='bgBody'>" +
        "<tr> <td>" +
        "<table cellpadding='0' width='620' class='container' align='center' cellspacing='0' border='0'>" +
        "<tr> <td>" +
        "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td class='movableContentContainer bgItem'>" +
        "<div class='movableContent'>" +
        "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='200' valign='top'>&nbsp;</td>" +
        "<td width='200' valign='top' align='center'>" +
        "<div class='contentEditableContainer contentImageEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<img src='http://3.96.32.250/assets/img/login.png' height='140' alt='NEIXAR CONNECT' data-default='placeholder' />" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<tr height='25'>" +
        "<td width='200'>&nbsp;</td>" +
        "<td width='200'>&nbsp;</td>" +
        "<td width='200'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>" +
        "<div class='movableContent'>" +
        "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Evaluación Semestral de Objetivos SMART " + req.body.year + "</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p align='justify'>Estimado colaborador." +
        "<br/>" +
        "<br/>Tu jefe directo ha concluido la validación de tus objetivos SMART." +
        "<br/>" +
        "<br/>Gracias por tu participación.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>" +
        "<div class='movableContent'>" +
        "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='2' style='padding-top:25px;'>" +
        "<hr style='height:1px;border:none;color:#333;background-color:#ddd;' />" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='60%' height='70' valign='middle' style='padding-bottom:20px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<span style='font-size:13px;color:#181818;font-family:Helvetica, Arial, sans-serif;line-height:200%;'>Enviado por NEIXAR CONNECT</span>" +
        "<br/>" +
        "<span style='font-size:11px;color:#555;font-family:Helvetica, Arial, sans-serif;line-height:200%;'>Automation | Development Team </span>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</body>" +
        "</html>";

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        } else {
            console.log('Notificación de validación de avance enviada correctamente a ' + req.body.TO + ', ' + req.body.CC);
            res.status(200).json({
                ok: true,
                mensaje: 'El correo ha sido enviado, favor de verificar...'
            });
        }
    });
}

//============================================================
//              ENVIAR CORREO REESTABLECIMIENTO CONTRASEÑA
//============================================================
function resetPass(req, res) {
    let params = req.body;
    let template = email_template.template;

    User.findOne({
            $and: [
                { $or: [{ 'id_saf': params.TO }, { 'email': params.TO }] },
                { 'w_information.status': 'ACTIVO' }
            ]
        }, `_id
        p_information.name 
        p_information.firstSurname 
        p_information.secondSurname 
        email
        id_saf`)
        .exec((err, user) => {
            if (err)
                res.status(500).send({ message: 'Error al buscar colaborador.' });
            else {
                if (!user)
                    res.status(400).send({ message: `La dirección de correo electrónico o número de empleado ${params.TO} no está registrada(o).` });
                else {
                    let token = jwt.createPassToken(user)
                    let data = {
                        data: user,
                        token: token
                    };

                    /************** CORREO ELECTRÓNICO **************/
                    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
                        "<tr>" +
                        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
                        "<div class='contentEditableContainer contentTextEditable'>" +
                        "<div class='contentEditable' align='center'>" +
                        "<br/>" +
                        "<h2><strong>Restablecer Contraseña</strong></h2>" +
                        "</div>" +
                        "</div>" +
                        "</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td width='100'>&nbsp;</td>" +
                        "<td width='400' align='center'>" +
                        "<div class='contentEditableContainer contentTextEditable'>" +
                        "<div class='contentEditable' align='left'>" +
                        "<p style='text-align:justify'>Estimado colaborador." +
                        "<br/>" +
                        "<br/>Hemos recibido tu solicitud para restablecer tu contraseña, da clic en el botón <strong>'Restablecer contraseña'</strong> para hacerlo." +
                        "<br/>" +
                        "<br/>Si tú no solicitaste este cambio, puedes ignorar este correo. Aún no hemos hecho modificaciones a tu contraseña.</p>" +
                        "</div>" +
                        "</div>" +
                        "</td>" +
                        "<td width='100'>&nbsp;</td>" +
                        "</tr>" +
                        "</table>" +
                        "</div>";

                    template = template.replace('EMAIL-BODY', body)

                    var transporter = nodemailer.createTransport({
                        host: 'smtp.ionos.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: 'neixar.connect@neixar.com.mx',
                            pass: 'Nconnect4$'
                        }
                    });
                    var mailOptions = {
                        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
                        to: data.data.email,
                        cc: req.body.CC,
                        subject: req.body.SUBJECT,
                        html: template
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            res.status(500).send({ message: 'Error al enviar correo para restablecer la contraseña.' });
                        } else {
                            console.log('Correo de restablecimiento de contraseña enviado correctamente a ' + data.data.email);
                            res.status(200).json({
                                ok: true,
                                mensaje: `El correo ha sido enviado a ${data.data.email}, favor de verificar.`
                            });
                        }
                    });
                    /************** FIN CORREO ELECTRÓNICO **************/

                }
            }
        });

}

//==================================================================
//              ENVIAR CORREO A JEFE PARA DAR VOBO A NUEVOS OBJETIVOS
//==================================================================
function approveObjectives(req, res) {
    let params = req.body;
    let template = email_template.template;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Registro de Objetivos SMART " + req.body.year + "</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p style='text-align:justify'>Estimado colaborador." +
        "<br/>" +
        "<br/><strong>" + req.body.name + "</strong> ha concluido el registro de sus objetivos SMART." +
        "<br/>" +
        "<br/>Favor de revisarlos y aprobarlos en la platafoma.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    template = template.replace('EMAIL-BODY', body)

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'cimainnovation@gmail.com',
            pass: '(ima1nnovation'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <cimainnovation@gmail.com>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo para notificar registro de objetivos SMART.' });
        } else {
            console.log('Notificación de registro de objetivos enviada correctamente a ' + req.body.TO);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.TO}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/

}

/*
 * Notifica cuando una requisición tiene los 3 VoBo
 */
function recruitmentApproved(req, res) {
    let position = req.body.position;
    let template = email_template.template;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Requisición de Personal Aprobada</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p style='text-align:justify'>Estimado colaborador." +
        "<br/>" +
        "<br/>Se ha aprobado la requisición para el puesto <strong>" + position + "</strong>" +
        "<br/>" +
        "<br/>Favor de asignarla al reclutador correspondiente para su seguimiento.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    template = template.replace('EMAIL-BODY', body);

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo de notificación de requisición aprobada.' });
        } else {
            console.log('Notificación de requisición aprobada enviada correctamente a ' + req.body.TO + ', ' + req.body.CC);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.CC}, ${req.body.TO}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/
}

/*
 * Notifica cuando se genera DP
 */
function createDP(req, res) {
    let position = req.body.position;
    let author = req.body.author;
    let template = email_template.template;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Nueva Descripción de Puesto</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p style='text-align:justify'><strong>" + author + "</strong> ha generado una descripción de puesto para <strong>" + position + "</strong>" +
        "<br/>" +
        "<br/>Favor de ingresar a la plataforma para su validación.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    template = template.replace('EMAIL-BODY', body);

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo de notificación de nueva DP.' });
        } else {
            console.log('Notificación de nueva DP enviado correctamente a ' + req.body.TO + ', ' + req.body.CC);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.TO}, ${req.body.CC}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/
}

/*
 * Notifica cuando se modifica DP
 */
function editDP(req, res) {
    let position = req.body.position;
    let author = req.body.author;
    let template = email_template.template;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Actualización de Descripción de Puesto</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p style='text-align:justify'><strong>" + author + "</strong> ha actualizado la descripción de puesto para <strong>" + position + "</strong>" +
        "<br/>" +
        "<br/>Favor de ingresar a la plataforma para su validación.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    template = template.replace('EMAIL-BODY', body);

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo de notificación de actualización de DP.' });
        } else {
            console.log('Notificación de actualización de DP enviada correctamente a ' + req.body.TO + ', ' + req.body.CC);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.TO}, ${req.body.CC}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/
}

/*
 * Notifica cuando se rechaza una DP
 */
function rejectDP(req, res) {
    let position = req.body.position;
    let template = email_template.template;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Solicitud de Cambios - Descripción de Puesto</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p style='text-align:justify'>Estimado colaborador. <br/><br/>El departamento de Capital Humano NO aprobó la descripción del puesto <strong>" + position + "</strong> que has registrado." +
        "<br/>" +
        "<br/>Revisa los motivos de rechazo en la plataforma.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    template = template.replace('EMAIL-BODY', body);

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo de notificación de DP rechazada.' });
        } else {
            console.log('Notificación de DP rechazada enviada correctamente a ' + req.body.TO + ', ' + req.body.CC);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.TO}, ${req.body.CC}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/
}

/*
 * Notifica cuando se rechaza una DP
 */
function validateDP(req, res) {
    let position = req.body.position;
    let template = email_template.template;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Descripción de Puesto Aprobada</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p style='text-align:justify'>Estimado colaborador. <br/><br/>El departamento de Capital Humano ha aprobado la descripción del puesto <strong>" + position + "</strong> que has registrado." +
        "<br/>" +
        "<br/>Favor de validarlo en la plataforma.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    template = template.replace('EMAIL-BODY', body);

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo de notificación de DP aprobada.' });
        } else {
            console.log('Notificación de DP aprobada enviada correctamente a ' + req.body.TO + ', ' + req.body.CC);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.TO}, ${req.body.CC}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/
}

/*
 * Notifica cuando se crea una requisición
 */
function createRecruitment(req, res){
    let position = req.body.position;
    let template = email_template.template;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Nueva Requisición de Personal</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p style='text-align:justify'>Estimado equipo. <br/><br/> Se generó una requisición de personal para el puesto <strong>" + position + "</strong>."+
        "<br/>" +
        "<br/>Favor de autorizarla dentro de la plataforma para poder iniciar con el proceso de reclutamiento y selección.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    template = template.replace('EMAIL-BODY', body);

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo de notificación de nueva requisición.' });
        } else {
            console.log('Notificación de nueva requisición enviada correctamente a ' + req.body.TO + ', ' + req.body.CC);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.TO}, ${req.body.CC}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/
}

/*
 * Notifica cuando se rechaza una requisición
 */
function rejectionRecruitment(req, res){
    let position = req.body.position;
    let template = email_template.template;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Requisición de Personal Rechazada</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p style='text-align:justify'>Estimado colaborador. <br/><br/> La requisición de personal para el puesto <strong>" + position + "</strong> ha sido rechazada."+
        "<br/>" +
        "<br/>Favor de validarlo en la plataforma.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    template = template.replace('EMAIL-BODY', body);

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo de notificación de requisición rechazada.' });
        } else {
            console.log('Notificación de rechazo de requisición enviada correctamente a ' + req.body.TO + ', ' + req.body.CC);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.TO}, ${req.body.CC}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/
}

/*
 * Notifica cuando se asiga un reclutador a una requisición
 */
function assignRecruitmentToRecruitment(req, res){
    let position = req.body.position;
    let template = email_template.template;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Requisición de Personal Asignada</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p style='text-align:justify'>Estimado colaborador. <br/><br/> La requisición de personal para el puesto <strong>" + position + "</strong> te ha sido asignada."+
        "<br/>" +
        "<br/>Favor de comenzar con el proceso de reclutamiento y selección.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    template = template.replace('EMAIL-BODY', body);

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo de notificación de requisición asignada.' });
        } else {
            console.log('Notificación de requisición asignada enviada correctamente a ' + req.body.TO + ', ' + req.body.CC);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.TO}, ${req.body.CC}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/
}

/*
 * Notifica cuando se modifica una requisición
 */
function editRecruitment(req, res) {
    let position = req.body.position;
    let template = email_template.template;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Actualización de Requisición de Personal</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p style='text-align:justify'>Se ha actualizado la requisición de personal para el puesto <strong>" + position + "</strong>" +
        "<br/>" +
        "<br/>Favor de ingresar a la plataforma para su validación.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    template = template.replace('EMAIL-BODY', body);

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo de notificación de edición de requisición.' });
        } else {
            console.log('Notificación de edición de requisición enviada correctamente a ' + req.body.TO + ', ' + req.body.CC);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.TO}, ${req.body.CC}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/
};

function registerEvaluation(req, res){
    let position = req.body.position;
    let candidate = req.body.candidate;
    let evaluator = req.body.evaluator;
    let template = email_template.template;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Reporte de Entrevista Registrado</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p style='text-align:justify'>" + evaluator + " ha registrado el reporte de entrevista del candidato <strong> " + candidate + "</strong> de la vacante <strong> " + position + "</strong>." +
        "<br/>" +
        "<br/>Favor de ingresar a la plataforma para su validación.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    template = template.replace('EMAIL-BODY', body);

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo de notificación de informe de entrevista registrado.' });
        } else {
            console.log('Notificación de registro de informe de entrevista enviada correctamente a ' + req.body.TO);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.TO}, ${req.body.CC}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/
};

function requisitionCovered(req, res){
    let position = req.body.position;
    let template = email_template.template;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Vacante Cubierta</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p style='text-align:justify'>La vacante <strong>" + position + "</strong> ha sido cubierta." +
        "<br/>" +
        "<br/>En breve Capital Humano te compartirá los detalles.</p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    template = template.replace('EMAIL-BODY', body);

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo de notificación de vacante cubierta.' });
        } else {
            console.log('Notificación de vacante cubierta enviada correctamente a ' + req.body.TO);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.TO}, ${req.body.CC}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/
};

function newEmployee(req, res){
    let position = req.body.position;
    let id_neixar = req.body.id_neixar;
    let candidateName = req.body.candidateName;
    let department = req.body.department;
    let admission_date = req.body.admission_date;
    let template = email_template.template;
    let immediateBoss = req.body.immediateBoss;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
    "<tr>" +
    "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
    "<div class='contentEditableContainer contentTextEditable'>" +
    "<div class='contentEditable' align='center'>" +
    "<br/>" +
    "<h2><strong>Nuevo Ingreso</strong></h2>" +
    "</div>" +
    "</div>" +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<td width='100'>&nbsp;</td>" +
    "<td width='400' align='center'>" +
    "<div class='contentEditableContainer contentTextEditable'>" +
    "<div class='contentEditable' align='left'>" +
    "<p style='text-align:justify'>Estimado equipo. <br/><br/>Se les informa de nuestro nuevo ingreso, a continuación la información."+
    "<br/>" +
    "<br/><strong>ID: </strong> "+ id_neixar +
    "<br/><strong>Nombre: </strong> "+  candidateName +
    "<br/><strong>Departamento: </strong> "+ department +
    "<br/><strong>Puesto: </strong> "+ position +
    "<br/><strong>Fecha de ingreso: </strong> "+ admission_date + "</p>" +
    "<br/><p style='text-align:justify;font-size:13px;font-family:Helvetica, Arial, sans-serif;'><strong>Capacitación</strong> para considerar en Inducción." +
    "<br/><strong>Movilidad y Valuación del Talento</strong> para gestionar la recepción de DP, objetivos y mapeo en organigrama." +
    "<br/><strong>Inplant</strong> para gestionar la firma de contrato." +
    "<br/><strong>Servicios Generales</strong> para la entrega del kit de bienvenida a Capital Humano y así hacerlo llegar a nuestro nuevo ingreso (libreta, plumas y mochila)" +
    "<br/><strong>Marketing</strong> para la toma de fotografía de la credencial." +
    "<br/><strong>"+ immediateBoss +"</strong> de acuerdo a las nuevas indicaciones en el proceso de integración, agrego la liga del onboarding para que de ser necesario pueda ser presentado a nuestro nuevo colaborador. <a href='https://neixar.sharepoint.com/sites/onboarding'>Onboarding</a></p>" +
    "</div>" +
    "</div>" +
    "</td>" +
    "<td width='100'>&nbsp;</td>" +
    "</tr>" +
    "</table>" +
    "</div>";

    template = template.replace('EMAIL-BODY', body);

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo de notificación de nuevo ingreso.' });
        } else {
            console.log('Notificación de nuevo ingreso enviada correctamente a ' + req.body.TO + ', ' + + req.body.CC);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.TO}, ${req.body.CC}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/
};

function requisitionClosed(req, res){
    let position = req.body.position;      
    let justification = req.body.justification;      
    let template = email_template.template;

    /************** CORREO ELECTRÓNICO **************/
    let body = "<table cellpadding='0' cellspacing='0' border='0' align='center' width='600' class='container'>" +
        "<tr>" +
        "<td width='100%' colspan='3' align='center' style='padding-bottom:10px;padding-top:0px;'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='center'>" +
        "<br/>" +
        "<h2><strong>Vacante Cerrada</strong></h2>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='100'>&nbsp;</td>" +
        "<td width='400' align='center'>" +
        "<div class='contentEditableContainer contentTextEditable'>" +
        "<div class='contentEditable' align='left'>" +
        "<p style='text-align:justify'>La vacante <strong>" + position + "</strong> ha sido cerrada por los siguientes motivos." +
        "<br/>" +
        "<br/><strong>"+justification+"</strong></p>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "<td width='100'>&nbsp;</td>" +
        "</tr>" +
        "</table>" +
        "</div>";

    template = template.replace('EMAIL-BODY', body);

    var transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com',
        port: 587,
        secure: false,
        auth: {
            user: 'neixar.connect@neixar.com.mx',
            pass: 'Nconnect4$'
        }
    });
    var mailOptions = {
        from: 'NEIXAR CONNECT <neixar.connect@neixar.com.mx>',
        to: req.body.TO,
        cc: req.body.CC,
        subject: req.body.SUBJECT,
        html: template
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Error al enviar correo de notificación de vacante cerrada.' });
        } else {
            console.log('Notificación de vacante cerrada enviada correctamente a ' + req.body.TO + ', ' + + req.body.CC);
            res.status(200).json({
                ok: true,
                mensaje: `El correo ha sido enviado a ${req.body.TO}, ${req.body.CC}, favor de verificar.`
            });
        }
    });
    /************** FIN CORREO ELECTRÓNICO **************/
};

module.exports = {
    toBoss,
    toEmployee,
    resetPass,
    approveObjectives,
    resetPass,
    recruitmentApproved,
    createDP,
    editDP,
    rejectDP,
    validateDP,
    createRecruitment,
    rejectionRecruitment,
    assignRecruitmentToRecruitment,
    editRecruitment,
    registerEvaluation,
    requisitionCovered,
    newEmployee,
    requisitionClosed
}