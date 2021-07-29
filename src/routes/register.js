const express = require("express")
const router = express.Router();
const User = require('../../db/models/User');

// Create
router.post("/", async (req, res, next) => {
    const user = new User(req.body); // Not a critical section

    try {
        // Critical code
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
