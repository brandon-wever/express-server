require('dotenv').config();
const express = require("express");
const app = express();
require('../db/config.js');
const port = process.env.HOST_PORT;
const hostName = process.env.HOST_NAME;

// Adding middleware
app.use(express.json());

// Adding my routes
app.get("/", (req, res) => {
    res.send("Hello world");
});

app.use("/api/register/", require("./routes/register"));
app.use("/api/auth/", require("./routes/auth"));

// GET (retrieving data), PUT (updating something in the db), POST (creating in db), DEL (removing data - db)

app.listen(port, () => {
    console.log(`listening at http://${hostName}:${port}`);
});

module.exports = app;
