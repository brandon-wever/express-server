const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    res.json({ profile: { name: 'Test User' } });
});

router.put('/', async (req, res, next) => {
    res.send('Hello authenticated user!');
});

module.exports = router;