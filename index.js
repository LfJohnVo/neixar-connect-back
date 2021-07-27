'use strict'

var fs = require('fs'); // Para SSL
var mongoose = require('mongoose');
var app = require('./app');
const config = require('./config');

// Para SSL //
var https = require('https');
var privateKey  = fs.readFileSync('./sslcert/_.neixar.com_private_key.key', 'utf8');
var certificate = fs.readFileSync('./sslcert/neixar.com_ssl_certificate.cer', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);
// Fin para SSL //

mongoose.connect(config.db, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
        // app.listen(config.port, () => {
        //     console.log(`Servidor escuchando por el puerto ${config.port}: \x1b[32m%s\x1b[0m `, 'online');
        // });
        httpsServer.listen(config.port, () => {
            console.log(`Servidor escuchando por el puerto ${config.port}: \x1b[32m%s\x1b[0m `, 'online');
        });
    }
});