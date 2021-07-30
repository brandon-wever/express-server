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
            return next(error);
        }
    })(req, res, next);
});

// TODO: Forgot Password
// Updates a users password with matching email
router.put('/forgot-password', async (req, res) => {
    try{
        const newPassword = req.body.password;

        // Grab users with matching email
        const users = await UserModel.find({ email: req.body.email });
        
        // Extract one user that has same email
        const user = _.find(users, (foundUser) => foundUser.email === req.body.email);
        
        //check if user exists
        if (!user) { 
            throw new Error(`User with email ${req.body.email} does not exist.`);
        }

        //hash new password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        const newUserPassword = hash;

        //update account with new password on database
        await UserModel.findByIdAndUpdate(user._id, { password: newUserPassword });

        // Returning user object to client
        res.json({ user: _.pick(user, 'email') });
    }
    catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// TODO: Logout

module.exports = router
