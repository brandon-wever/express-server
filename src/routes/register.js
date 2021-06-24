const express = require("express")
const router = express.Router()
const users = []

// TODO: GET method to return users array

router.post("/", (req, res) => {
    try {
        // Executing code that can error out
        // Verify my req.body
        if (!req.body.email || !req.body.password) {
            throw new Error('Email or password is undefined')
        }

        // TODO: Save to database
        users.push(req.body);

        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
})

// TODO: Login

// TODO: Delete their account

module.exports = router