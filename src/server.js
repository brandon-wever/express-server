require('dotenv').config();
const express = require("express");
const app = express();
require('../db/config.js');
const port = process.env.HOST_PORT;
const hostName = process.env.HOST_NAME;
const moment = require('moment');

const logRequestBody = (req, res, next) => {
    console.log(`Request incoming at ${moment().format('MM/DD/YYYY HH:mm:ss')}: ${JSON.stringify(req.body)}`);
    next();
};

const isValidBody = (req, res, next) => {
    if (!req.body.token) {
        next(new Error('Has no token on body'));
        console.log('Invalid request');
    } else {

        console.log('Valid request');
        next();
    }
};

// Adding middleware
app.use(express.json());
app.use(logRequestBody);

// Adding my routes
app.get("/", (req, res) => {
    console.log('In route')
    res.send("Hello world");
});

app.use("/api/register/", require("./routes/register"));
app.use("/api/auth/", require("./routes/auth"));

// GET (retrieving data), PUT (updating something in the db), POST (creating in db), DEL (removing data - db)

app.listen(port, () => {
    console.log(`listening at http://${hostName}:${port}`);
});

module.exports = app;
