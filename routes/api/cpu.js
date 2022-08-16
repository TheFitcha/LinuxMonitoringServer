const uuid = require('uuid');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  components:
 *      schema:
 *          Processor:
 *               type: body
 *               properties:
 *                  name:
 *                      type: string
 *                  machineId:
 *                      type: string
 */

/**
 * @swagger
 * /api/main/cpuInfo:
 *  get:
 *      description: Get all info about registered CPUs
 *      tags:
 *        - CPU
 *      responses:
 *          '200':
 *              description: Successful response
 */
 router.get('/cpuInfo', (req, res) => {
    db.any('SELECT * FROM processor', req.params.id)
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
})

/**
 * @swagger
 * /api/main/cpuInfo/{id}:
 *  get:
 *      description: Returns registered processor with machine id
 *      tags:
 *        - CPU
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
router.get('/cpuInfo/:machineId', (req, res) => {
    db.one('SELECT * FROM processor WHERE machineId = $1', req.params.machineId)
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
})

/**
 * @swagger
 * /api/main/cpuRegister:
 *  post:
 *      description: Register new processor
 *      tags:
 *        - CPU
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          schema:
 *              $ref: '#components/schema/Processor'
 *      responses:
 *          '200':
 *              description: Successful response
 */
 router.post('/cpuRegister', (req, res) => {
    const newId = uuid.v4();
    const name = req.body.name;
    if(!name){
        res.send("Request did not contain name!");
    }
    const machineId = req.body.machineId;
    if(!machineId){
        res.send("Request did not contain machineId!");
    }

    db.none('INSERT INTO processor(id, name, machineId) VALUES ($1, $2, $3)', [newId, name, machineId])
        .then(() => {
            res.send(`${newId}`);
        })
        .catch((err) => {
            res.send(err);
        })
})

/**
 * @swagger
 * /api/main/cpuDelete/{id}:
 *  delete:
 *      description: Deletes processor with id
 *      tags:
 *        - CPU
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *          description: Cpu ID
 *      responses:
 *          '200':
 *              description: Successful response
 */
 router.delete('/cpuDelete/:id', (req, res) => {
    const idToDelete = req.params.id;
    db.none('DELETE FROM Processor WHERE id=$1', idToDelete)
        .then(() => {
            res.send(idToDelete);
        })
        .catch((err) => {
            res.send(err);
        })
})

module.exports = router;