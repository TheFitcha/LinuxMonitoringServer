const uuid = require('uuid');

const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  components:
 *      schema:
 *          Process:
 *               type: body
 *               properties:
 *                  processIdSystem:
 *                      type: string
 *                  name:
 *                      type: string
 *                  machineId:
 *                      type: string
 *          ProcessStatus:
 *               type: body
 *               properties:
 *                  processId:
 *                      type: string
 *                  state:
 *                      type: string
 *                  cpuUtil:
 *                      type: number
 *                  threads:
 *                      type: integer
 */

/**
 * @swagger
 * /api/main/processStatus/{id}:
 *  get:
 *      description: Returns process status for id
 *      tags:
 *        - Process
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *          description: Process ID
 *      responses:
 *          '200':
 *              description: Successful response
 */
 router.get('/processDetails/:id', (req, res) => {
    db.any('SELECT * FROM ProcessStatus WHERE processId = $1', req.params.id)
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
})

/**
 * @swagger
 * /api/main/process/{id}:
 *  get:
 *      description: Returns registered process for id
 *      tags:
 *        - Process
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *          description: Process ID
 *      responses:
 *          '200':
 *              description: Successful response
 */
 router.get('/process/:id', (req, res) => {
    db.any('SELECT * FROM Process WHERE id = $1', req.params.id)
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
})

/**
 * @swagger
 * /api/main/processList/{machineId}:
 *  get:
 *      description: Get all processes associated with machine id
 *      tags:
 *        - Process
 *      parameters:
 *        - in: path
 *          name: machineId
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *          description: Machine ID
 *      responses:
 *          '200':
 *              description: Successful response
 */
router.get('/processList/:machineId', (req, res) => {
    const machineId = req.params.machineId;
    db.any('SELECT * FROM Process WHERE machineId=$1', machineId)
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
})


/**
 * @swagger
 * /api/main/processUpdate:
 *  post:
 *      description: Update existing process status
 *      tags:
 *        - Process
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          schema:
 *              $ref: '#components/schema/ProcessStatus'
 *      responses:
 *          '200':
 *              description: Successful response
 */
router.post('/processUpdate', (req, res) => {
    const processId = req.body.processId;
    if(!processId){
        res.send("Request did not contain processId!");
        return;
    }
    const time = Date.now();
    const state = req.body.state;
    if(!state){
        res.send("Request did not contain state!");
    }
    const cpuUtil = req.body.cpuUtil;
    if(cpuUtil === undefined){
        res.send("Request did not contain cpuUtil!" + cpuUtil);
    }
    const memUtil = req.body.memUtil;
    if(memUtil === undefined){
        res.send("Request did not contain memUtil!");
    }
    const threads = req.body.threads;
    if(threads === undefined){
        res.send("Request did not contain threads!");
    }

    db.none('INSERT INTO ProcessStatus(processId, time, state, cpuUtil, memUtil, threads) VALUES ($1, to_timestamp($2/1000), $3, $4, $5, $6)', [processId, time, state, cpuUtil, memUtil, threads])
        .then(() => {
            res.send(processId);
        })
        .catch((err) => {
            res.send(err);
        })
})

/**
 * @swagger
 * /api/main/processRegister:
 *  post:
 *      description: Registers new process
 *      tags:
 *        - Process
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          schema:
 *              $ref: '#components/schema/Process'
 *      responses:
 *          '200':
 *              description: Successful response
 */
router.post('/processRegister', (req, res) => {
    const newId = uuid.v4();
    const processIdSystem = req.body.processIdSystem;
    if(!processIdSystem){
        res.send("Request did not contain processIdSystem!");
    }
    const name = req.body.name;
    if(!name){
        res.send("Request did not contain name!");
    }
    const machineId = req.body.machineId;
    if(!machineId){
        res.send("Request did not contain machineId!");
    }
    const processPath = req.body.processPath;
    if(!processPath){
        res.send("Request did not contain processPath!");
    }

    console.log("/processRegister");

    db.none('INSERT INTO Process(id, processIdSystem, name, machineId, processPath) VALUES ($1, $2, $3, $4, $5)', [newId, processIdSystem, name, machineId, processPath])
        .then(() => {
            res.send(newId);
        })
        .catch((err) => {
            res.send(err);
        })
})

/**
 * @swagger
 * /api/main/processDelete/{id}:
 *  delete:
 *      description: Deletes process with id
 *      tags:
 *        - Process
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *          description: Process ID
 *      responses:
 *          '200':
 *              description: Successful response
 */
router.delete('/processDelete/:id', (req, res) => {
    const idToDelete = req.params.id;
    db.none('DELETE FROM Process WHERE id=$1', idToDelete)
        .then(() => {
            res.send(idToDelete);
        })
        .catch((err) => {
            res.send(err);
        })
})

module.exports = router;