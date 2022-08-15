const pgp = require('pg-promise')();
const db = pgp('postgres://pi:filip123@localhost:5432/statux');
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
        .then((data) => res.json(data))
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
        .then((data) => res.json(data))
        .catch((err) => res.send(err));
})

/**
 * @swagger
 * /api/main/machine/{id}:
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
router.get('/processStatus/:id', (req, res) => {
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
            res.send(idToDelete);
        })
        .catch((err) => {
            res.send(err);
        })
})

/**
 * @swagger
 * /api/main/cpuCore/{processorId}:
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
 * /api/main/cpuCore/{processorId}:
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
            res.send(idToDelete);
        })
        .catch((err) => {
            res.send(err);
        });
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

//router.stack.forEach((el) => console.log(`${el.route.path} -> ${el.route.methods.get ? 'GET' : 'POST'}`));
module.exports = router;