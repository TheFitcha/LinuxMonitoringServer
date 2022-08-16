app.get('/count', (req, res) => {
    const count = readFileSync('./count.txt', 'utf-8');
    console.log("Current count: ", count);

    const newCount = parseInt(count) + 1;
    writeFileSync('./count.txt', newCount);

    res.send(`
        <h1>Count: ${newCount}</h1>
    `)
});

//post json entry by GET
app.get('/addEntryGet', (req, res) => {
    const newEntry = {
        "id": req.query.id,
        "name": req.query.name
    };

    var json = JSON.parse(readFileSync('./json_examples/example.json', 'utf-8'));
    json.tests.push(newEntry);
    writeFileSync('./json_examples/example.json', JSON.stringify(json));

    console.log(json);
    res.send(json);
})

app.post('/addEntryPost', (req, res) => {
    const newEntry = {
        id: uuid.v4(),
        name: req.body.name
    };

    if(!newEntry.name){
        return res.status(400).json({ msg: "Name not sent!" });
    }

    readFile('./json_examples/post_json.json', (err, data) => {
        if(err){
            next(err);
        }

        var jsonFile = JSON.parse(data);
        jsonFile.entries.push(newEntry);
        writeFileSync('./json_examples/post_json.json', JSON.stringify(jsonFile));
    })
    console.log(newEntry);
    res.send(req.body);
})

app.post('/', (req, res) => {
    writeFileSync('./randomText.txt', req.body);
    console.log("Received: ", req.body);
});