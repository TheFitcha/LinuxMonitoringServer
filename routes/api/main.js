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

    apis: ["./routes/api/main.js", 
        "./routes/api/machine.js", 
        "./routes/api/cpu.js", 
        "./routes/api/cores.js", 
        "./routes/api/process.js",
        "./routes/api/memory.js"]
}

const swaggerDocument = swaggerJsDoc(swaggerOptions);

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

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

//router.stack.forEach((el) => console.log(`${el.route.path} -> ${el.route.methods.get ? 'GET' : 'POST'}`));
module.exports = router;