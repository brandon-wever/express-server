const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Hello world");
});

// GET (retrieving data), PUT (updating something in the db), POST (creating in db), DEL (removing data - db)

app.listen(4000, () => {
    console.log("listening at http://localhost:4000")
});
