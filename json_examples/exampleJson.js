const express = require('express');
const router = express.Router();

const { readFileSync, writeFileSync, readFile } = require('fs');
const _ = require('underscore');

//get one json entry
router.get('/:id', (req, res) => {
    readFile('./json_examples/example.json', 'utf-8', (err, data) => {
        if(err){
            //passing error to Express
            console.log(err);
            next(err);
        }
        const fileJson = JSON.parse(data);
        console.log("Get exampleJson for id: ", req.params.id)
        console.log(fileJson);
        res.json(_.where(fileJson.tests, {"id": parseInt(req.params.id)}));
    });
})

//get all json entries
router.get("/", (req, res) => {
    const fileJson = readFileSync("./json_examples/example.json", "utf-8");
    res.json(fileJson);
})

// console.log(router.stack);
module.exports = router;