const express = require("express");
const _ = require('underscore');
const bcrypt = require('bcryptjs');
const UserModel = require("../../db/models/User");
const router = express.Router();

// POST Login
router.post("/login", async (req, res) => {
    
    try{
        // Validate that email and password exist
        if(req.body.email === null || req.body.password === null){
            throw new Error('User email or password not defined.')
        }

        // Grab all users with matching email
        const users = await UserModel.find({ email: req.body.email});

        // Extract one user that has same email
        const user = _.find(users, (foundUser) => foundUser.email === req.body.email);

        if (!user) {
            throw new Error(`User with email ${req.body.email} does not exist.`);
        }

        // Bcryptjs: Compare body password with user password
        // req.body.password IS NOT HASHED
        // user.password IS HASHED
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.json(user);
        } else {
            res.sendStatus(401); // 401 means unathorized login
        }
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
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
