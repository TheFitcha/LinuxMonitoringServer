const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  components:
 *      schema:
 *          Memory:
 *               type: body
 *               properties:
 *                  machineId:
 *                      type: string
 *                  totalPhysicalMemoryKb:
 *                      type: integer
 *                  totalSwapMemoryKb:
 *                      type: integer
 *                  freePhysicalMemoryKb:
 *                      type: integer
 *                  freeSwapMemoryKb:
 *                      type: integer
 */

/**
 * @swagger
 * /api/main/memory/{machineId}:
 *  get:
 *      description: Get all memory entries associated with machine id
 *      tags:
 *        - Memory
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
 router.get('/memory/:machineId', (req, res) => {
    const machineId = req.params.machineId;
    db.one('SELECT * FROM Memory WHERE machineId=$1', machineId)
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
})

/**
 * @swagger
 * /api/main/memoryRegister:
 *  post:
 *      description: Register new memory for machine
 *      tags:
 *        - Memory
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          schema:
 *              $ref: '#components/schema/Memory'
 *      responses:
 *          '200':
 *              description: Successful response
 */
 router.post('/memoryRegister', (req, res) => {
    const machineId = req.body.machineId;
    if(!machineId){
        res.send("Request did not contain processId!");
    }
    const totalPhysicalMemoryKb = req.body.totalPhysicalMemoryKb;
    if(totalPhysicalMemoryKb === undefined){
        res.send("Request did not contain totalPhysicalMemoryKb!");
    }
    const totalSwapMemoryKb = req.body.totalSwapMemoryKb;
    if(totalSwapMemoryKb === undefined){
        res.send("Request did not contain totalSwapKb!");
    }

    const freePhysicalMemoryKb = req.body.freePhysicalMemoryKb;
    if(freePhysicalMemoryKb === undefined){
        res.send("Request did not contain freePhysicalMemoryKb!");
    }

    const freeSwapMemoryKb = req.body.freeSwapMemoryKb;
    if(freeSwapMemoryKb === undefined){
        res.send("Request did not contain freeSwapMemoryKb!");
    }

    db.none('INSERT INTO Memory(machineId, totalPhysicalMemoryKb, totalSwapMemoryKb, freePhysicalMemoryKb, freeSwapMemoryKb) VALUES ($1, $2, $3, $4, $5)', [machineId, totalPhysicalMemoryKb, totalSwapMemoryKb, freePhysicalMemoryKb, freeSwapMemoryKb])
        .then(() => {
            res.send(machineId);
        })
        .catch((err) => {
            res.send(err);
        })
})

/**
 * @swagger
 * /api/main/memoryUpdate:
 *  put:
 *      description: Update memory for machine
 *      tags:
 *        - Memory
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          schema:
 *              $ref: '#components/schema/Memory'
 *      responses:
 *          '200':
 *              description: Successful response
 */
 router.put('/memoryUpdate', (req, res) => {
    const machineId = req.body.machineId;
    if(machineId === undefined){
        res.send("Request did not contain machineId!");
    }
    
    const totalPhysicalMemoryKb = req.body.totalPhysicalMemoryKb;
    if(totalPhysicalMemoryKb === undefined){
        res.send("Request did not contain totalPhysicalMemoryKb!");
    }
    const totalSwapMemoryKb = req.body.totalSwapMemoryKb;
    if(totalSwapMemoryKb === undefined){
        res.send("Request did not contain totalSwapKb!");
    }

    const freePhysicalMemoryKb = req.body.freePhysicalMemoryKb;
    if(freePhysicalMemoryKb === undefined){
        res.send("Request did not contain freePhysicalMemoryKb!");
    }

    const freeSwapMemoryKb = req.body.freeSwapMemoryKb;
    if(freeSwapMemoryKb === undefined){
        res.send("Request did not contain freeSwapMemoryKb!");
    }

    db.none('UPDATE Memory SET totalPhysicalMemoryKb=$1, totalSwapMemoryKb=$2, freePhysicalMemoryKb=$3, freeSwapMemoryKb=$4 WHERE machineId=$5', [totalPhysicalMemoryKb, totalSwapMemoryKb, freePhysicalMemoryKb, freeSwapMemoryKb, machineId])
        .then(() => {
            res.send(machineId);
        })
        .catch((err) => {
            res.send(err);
        })
})

/**
 * @swagger
 * /api/main/memory/{id}:
 *  delete:
 *      description: Deletes memory with machine id
 *      tags:
 *        - Memory
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
 router.delete('/memory/:id', (req, res) => {
    const machineIdToDelete = req.params.id;
    db.none('DELETE FROM Memory WHERE machineId=$1', machineIdToDelete)
        .then(() => {
            res.send(machineIdToDelete);
        })
        .catch((err) => {
            res.send(err);
        })
})

module.exports = router;