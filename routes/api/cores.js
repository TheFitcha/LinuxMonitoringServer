const express = require('express');
const router = express.Router();

/**
 * @swagger
 *  components:
 *      schema:
 *          Core:
 *              type: body
 *              properties:
 *                  processorId:
 *                      type: string
 *                  speed:
 *                      type: number
 *                  coreNo:
 *                      type: integer
 *                  cacheSizeKB:
 *                      type: number
 */

/**
 * @swagger
 * /api/main/cpuCore/{id}:
 *  get:
 *      description: Get all info about registered core for certain processor
 *      tags:
 *        - Core
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *          description: Processor ID
 *      responses:
 *          '200':
 *              description: Successful response
 */
router.get('/cpuCore/:processorId', (req, res) => {
    const processorId = req.params.processorId;
    db.any('SELECT * FROM Core WHERE processorId=$1', processorId)
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
})

/**
 * @swagger
 * /api/main/coreRegister:
 *  post:
 *      description: Registers new core
 *      tags:
 *        - Core
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          schema:
 *              $ref: '#components/schema/Core'
 *      responses:
 *          '200':
 *              description: Successful response
 */
router.post('/coreRegister', (req, res) => {
    const processorId = req.body.processorId;
    if(!processorId){
        res.send("Request did not contain processorId!");
    }
    const speed = req.body.speed;
    if(speed === undefined){
        res.send("Request did not contain speed!");
    }
    const coreNo = req.body.coreNo;
    if(coreNo === undefined){
        res.send("Request did not contain coreNo!");
    }
    const cacheSizeKB = req.body.cacheSizeKB;
    if(cacheSizeKB === undefined){
        res.send("Request did not contain cacheSizeKB!");
    }

    db.none('INSERT INTO Core(processorId, speed, coreNo, cacheSizeKB) VALUES ($1, $2, $3, $4)', [processorId, speed, coreNo, cacheSizeKB])
        .then(() => {
            res.send(processorId);
        })
        .catch((err) => {
            res.send(err);
        })
})

/**
 * @swagger
 * /api/main/cpuCore/{id}:
 *  delete:
 *      description: Delete core info
 *      tags:
 *        - Core
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *              type: string
 *              minimum: 1
 *          description: Processor ID
 *      responses:
 *          '200':
 *              description: Successful response
 */
router.delete('/cpuCore/:processorId', (req, res) => {
    const processorId = req.params.processorId;
    db.none('DELETE FROM Core WHERE processorId=$1', processorId)
        .then(() => {
            res.send(processorId);
        })
        .catch((err) => {
            res.send(err);
        });
})

module.exports = router;