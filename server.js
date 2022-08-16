const { readFileSync, writeFileSync, readFile } = require('fs');
const express = require('express');
const path = require('path');

const app = express();
const https = require('https');
//treba izgenerirati kljuceve!
const serverCertificate = readFileSync('server_keys/host.cert', 'utf-8');
const serverPrivateKey = readFileSync('server_keys/host.key', 'utf-8');

//global database variable 
const pgp = require('pg-promise')();
global.db = pgp('postgres://pi:filip123@localhost:5432/statux');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const mainPathRequest = '/api/main';
// main entry for statux
app.use(mainPathRequest, require('./routes/api/main'));
app.use(mainPathRequest, require('./routes/api/machine'));
app.use(mainPathRequest, require('./routes/api/cores'));
app.use(mainPathRequest, require('./routes/api/process'));
app.use(mainPathRequest, require('./routes/api/cpu'));
app.use(mainPathRequest, require('./routes/api/memory'));

// this enables html files from public
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

//console.log(app._router.stack);
var httpsServer = https.createServer({key: serverPrivateKey, cert: serverCertificate}, app);
httpsServer.listen(PORT, () => console.log('https://localhost:' + PORT + '/'));