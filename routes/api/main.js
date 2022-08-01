const pgp = require('pg-promise')();
const db = pgp('postgres://filip:filip123@localhost:5432/statux');
const uuid = require('uuid');

const express = require('express');
const router = express.Router();

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        components: {},
        info: {
            title: "Statux API",
            description: "Main API for Statux application",
            contact: {
                name: ""
            },
            servers: ["http://localhost:5000"]
        }
    },

    apis: ["./routes/api/main.js"]
}

const swaggerDocument = swaggerJsDoc(swaggerOptions);

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

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
 *          Processor:
 *               type: body
 *               properties:
 *                  name:
 *                      type: string
 *                  machineId:
 *                      type: string
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

// Routes
/**
 * @swagger
 * /api/main/testdb:
 *  get:
 *      description: Simple connection test to database (returns '123' on success)
 *      tags:
 *        - Test
 *      responses:
 *          '200':
 *              description: Successful response
 */
router.get('/testdb', (req, res) => {
    db.one('SELECT $1 as value', 123)
        .then((data) => res.send(data))
        .catch((err) => res.send(err));
})

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
        .then((data) => res.send(data))
        .catch((err) => res.send(err));
})

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
        .then((data) => res.send(data))
        .catch((err) => res.send(err));
})

/**
 * @swagger
 * /api/main/cpuInfo/{id}:
 *  get:
 *      description: Returns registered processor with id
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
router.get('/cpuInfo/:id', (req, res) => {
    db.one('SELECT * FROM processor WHERE id = $1', req.params.id)
        .then((data) => res.send(data))
        .catch((err) => res.send(err));
})

/**
 * @swagger
 * /api/main/processStatus/{id}:
 *  get:
 *      description: Returns registered process with id
 *      tags:
 *        - Process
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
router.get('/processStatus/:id', (req, res) => {
    db.any('SELECT * FROM ProcessStatus WHERE processId = $1', req.params.id)
        .then((data) => res.send(data))
        .catch((err) => res.send(err));
})

/**
 * @swagger
 * /api/main/processList:
 *  get:
 *      description: Get all info about registered processes
 *      tags:
 *        - Process
 *      responses:
 *          '200':
 *              description: Successful response
 */
router.get('/processList', (req, res) => {
    db.any('SELECT * FROM Process')
        .then((data) => res.send(data))
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
    const newVersion = req.body.version;
    if(!newVersion){
        res.send("Request did not contain newVersion!");
    }

    db.none('INSERT INTO machine(id, name, linuxVersion) VALUES($1, $2, $3)', [newId, newName, newVersion])
        .then(() => {
            res.send("New registered machine ID: " + newId);
        })
        .catch((err) => {
            res.send(err);
        })
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
            res.send(`New processor (${name}) registered with id: ${newId}`);
        })
        .catch((err) => {
            res.send(err);
        })
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
    if(!cpuUtil){
        res.send("Request did not contain cpuUtil!");
    }
    const threads = req.body.threads;
    if(!threads){
        res.send("Request did not contain threads!");
    }

    db.none('INSERT INTO ProcessStatus(processId, time, state, cpuUtil, threads) VALUES ($1, to_timestamp($2/1000), $3, $4, $5)', [processId, time, state, cpuUtil, threads])
        .then(() => {
            res.send("Updated process id: " + processId);
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

    db.none('INSERT INTO Process(id, processIdSystem, name, machineId) VALUES ($1, $2, $3, $4)', [newId, processIdSystem, name, machineId])
        .then(() => {
            res.send("New process registered with id: " + newId);
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
            res.send("Successfully deleted process with id " + idToDelete);
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
            res.send("Successfully deleted Processor with id " + idToDelete);
        })
        .catch((err) => {
            res.send(err);
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
 router.delete('/cpuDelete/:id', (req, res) => {
    const idToDelete = req.params.id;
    db.none('DELETE FROM Machine WHERE id=$1', idToDelete)
        .then(() => {
            res.send("Successfully deleted Machine with id " + idToDelete);
        })
        .catch((err) => {
            res.send(err);
        })
})

//router.stack.forEach((el) => console.log(`${el.route.path} -> ${el.route.methods.get ? 'GET' : 'POST'}`));
module.exports = router;