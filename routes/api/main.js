const pgp = require('pg-promise')();
const db = pgp('postgres://filip:filip123@localhost:5432/statux');
const uuid = require('uuid');

const express = require('express');
const router = express.Router();

// test connection to db
router.get('/testdb', (req, res) => {
    db.one('SELECT $1 as value', 123)
        .then((data) => res.send(data))
        .catch((err) => res.send(err));
})

router.get('/machine', (req, res) => {
    db.any('SELECT * FROM machine')
        .then((data) => res.send(data))
        .catch((err) => res.send(err));
})

router.get('/machine/:id', (req, res) => {
    db.one('SELECT * FROM machine WHERE id = $1', req.params.id)
        .then((data) => res.send(data))
        .catch((err) => res.send(err));
})

router.get('/cpuInfo', (req, res) => {
    db.any('SELECT * FROM processor', req.params.id)
        .then((data) => res.send(data))
        .catch((err) => res.send(err));
})

router.get('/cpuInfo/:id', (req, res) => {
    db.one('SELECT * FROM processor WHERE id = $1', req.params.id)
        .then((data) => res.send(data))
        .catch((err) => res.send(err));
})

router.get('/taskStatus/:id', (req, res) => {
    db.any('SELECT * FROM ProcessStatus WHERE processId = $1', req.params.id)
        .then((data) => res.send(data))
        .catch((err) => res.send(err));
})

router.get('/taskList', (req, res) => {
    db.any('SELECT * FROM Process')
        .then((data) => res.send(data))
        .catch((err) => res.send(err));
})

router.post('/machineRegister', (req, res) => {
    const newId = uuid.v4();
    const newName = req.body.name;
    const newVersion = req.body.version;

    db.none('INSERT INTO machine(id, name, linuxVersion) VALUES($1, $2, $3)', [newId, newName, newVersion])
        .then(() => {
            res.send("New registered machine ID: " + newId);
        })
        .catch((err) => {
            res.send(err);
        })
})

router.post('/cpuRegister', (req, res) => {
    const newId = uuid.v4();
    const name = req.body.name;
    const machineId = req.body.machineId;

    db.none('INSERT INTO processor(id, name, machineId) VALUES ($1, $2, $3)', [newId, name, machineId])
        .then(() => {
            res.send(`New processor (${name}) registered with id: ${newId}`);
        })
        .catch((err) => {
            res.send(err);
        })
})

router.post('/taskUpdate', (req, res) => {
    const processId = req.body.processId;
    const time = Date.now();
    const state = req.body.state;
    const cpuUtil = req.body.cpuUtil;
    const threads = req.body.threads;

    db.none('INSERT INTO ProcessStatus(processId, time, state, cpuUtil, threads) VALUES ($1, to_timestamp($2/1000), $3, $4, $5)', [processId, time, state, cpuUtil, threads])
        .then(() => {
            res.send("Updated process id: " + processId);
        })
        .catch((err) => {
            res.send(err);
        })
})

router.post('/taskRegister', (req, res) => {
    const newId = uuid.v4();
    const processIdSystem = req.body.processIdSystem;
    const name = req.body.name;
    const machineId = req.body.machineId;

    db.none('INSERT INTO Process(id, processIdSystem, name, machineId) VALUES ($1, $2, $3, $4)', [newId, processIdSystem, name, machineId])
        .then(() => {
            res.send("New process registered with id: " + newId);
        })
        .catch((err) => {
            res.send(err);
        })
})

router.stack.forEach((el) => console.log(`${el.route.path} -> ${el.route.methods.get ? 'GET' : 'POST'}`));
module.exports = router;