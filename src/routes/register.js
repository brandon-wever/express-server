const express = require("express")
const router = express.Router();
const User = require('../../db/models/User');

// Create
router.post("/", async (req, res) => {
    const user = new User(req.body); // Not a critical section

    try {
        // Critical code
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router
