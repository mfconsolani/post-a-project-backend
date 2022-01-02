const express = require('express')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send("hola mundo")
});

const PORT = 8080

app.listen(PORT, console.log("App listening on port " + PORT))
