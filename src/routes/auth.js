const express = require("express");
const _ = require('underscore');
const bcrypt = require('bcryptjs');
const UserModel = require("../../db/models/User");
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../config/auth');

// POST Login
router.post("/login", async (req, res, next) => {
    passport.authenticate('login', async (error, user, msg) => {
        try {
            if (error) {
                return res.sendStatus(500);
            }

            if (!user) {
                return res.sendStatus(401); // Unathorized login, passwords do not match
            }

            // Valid user
            req.login(user, { session: false }, async (er) => {
                if (er) {
                    return next(er);
                }

                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
                res.json({token: token});
            });
        } catch (err) {
            console.error(err)
            return next(err);
        }
    })(req, res, next);
});

// TODO: Logout

module.exports = router
