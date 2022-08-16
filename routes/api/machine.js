const uuid = require('uuid');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  components:
 *      schema:
 *          Machine:
 *              type: body
 *              properties:
 *                  name:
 *                      type: string
 *                  linuxVersion:
 *                      type: string
 */

/**
 * @swagger
 * /api/main/machine:
 *  get:
 *      description: Gets all registered machines
 *      tags:
 *        - Machine
 *      responses:
 *          '200':
 *              description: Successful response
 */
 router.get('/machine', (req, res) => {
    db.any('SELECT * FROM machine')
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
})

/**
 * @swagger
 * /api/main/machine/{id}:
 *  get:
 *      description: Returns registered machine with id
 *      tags:
 *        - Machine
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *          description: Machine ID
 *      responses:
 *          '200':
 *              description: Successful response
 */
router.get('/machine/:id', (req, res) => {
    db.one('SELECT * FROM machine WHERE id = $1', req.params.id)
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
})

/**
 * @swagger
 * /api/main/machine/{name}:
 *  get:
 *      description: Returns registered machine with name
 *      tags:
 *        - Machine
 *      parameters:
 *        - in: path
 *          name: name
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *          description: Machine ID
 *      responses:
 *          '200':
 *              description: Successful response
 */
 router.get('/machine/:name', (req, res) => {
    db.one('SELECT * FROM machine WHERE name = $1', req.params.name)
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
})

/**
 * @swagger
 * /api/main/machineRegister:
 *  post:
 *      description: Register new machine
 *      tags:
 *        - Machine
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          schema:
 *              $ref: '#components/schema/Machine'
 *      responses:
 *          '200':
 *              description: Success
 */
 router.post('/machineRegister', (req, res) => {
    const newId = uuid.v4();
    const newName = req.body.name;
    if(!newName){
        res.send("Request did not contain newName!");
    }
    const newVersion = req.body.linuxVersion;
    if(!newVersion){
        res.send("Request did not contain newVersion!");
    }

    db.none('INSERT INTO machine(id, name, linuxVersion) VALUES($1, $2, $3)', [newId, newName, newVersion])
        .then(() => {
            res.send(newId);
        })
        .catch((err) => {
            res.send(newName+ " "+ newVersion+ " \n "+ err +"\n");
            //res.send(err);
        })
})

/**
 * @swagger
 * /api/main/machineDelete/{id}:
 *  delete:
 *      description: Deletes machine with id
 *      tags:
 *        - Machine
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *          description: Machine ID
 *      responses:
 *          '200':
 *              description: Successful response
 */
 router.delete('/machineDelete/:id', (req, res) => {
    const idToDelete = req.params.id;
    db.none('DELETE FROM Machine WHERE id=$1', idToDelete)
        .then(() => {
            res.send(idToDelete);
        })
        .catch((err) => {
            res.send(err);
        })
})

/**
 * @swagger
 * /api/main/deleteAllMachines:
 *  delete:
 *      description: Deletes all machines
 *      tags:
 *        - Machine
 *      responses:
 *          '200':
 *              description: Successful response
 */
 router.delete('/deleteAllMachines', (req, res) => {
    db.none('DELETE FROM Machine WHERE 1=1')
        .then(() => {
            res.send("Succesfully deleted all machines!");
        })
        .catch((err) => {
            res.send(err);
        })
})

module.exports = router;