const express = require('express');
const router = express.Router();

router.put('/', async (req, res, next) => {
    res.send('Hello authenticated user!');
});

module.exports = router;