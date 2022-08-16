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
 *                  totalSwapKb:
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
    db.any('SELECT * FROM Memory WHERE machineId=$1', machineId)
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

    db.none('INSERT INTO Memory(machineId, totalPhysicalMemoryKb, totalSwapMemoryKb) VALUES ($1, $2, $3)', [machineId, totalPhysicalMemoryKb, totalSwapMemoryKb])
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