const express = require("express")
const router = express.Router();
const User = require('../../db/models/User');
let counter = 0;
const users = [
    createUser()
]

function createUser() {
    return {
        email: `someEamil-${counter}@email.com`,
        password: `somePassword${counter}`
    };
}

// CRUD (Create, read, update, delete)

// Read
router.get("/", (req,res) => {
    res.json({users})
});

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

// Update
router.put("/change-password", (req, res) => {
    // TODO: Given a email and password, update the user's password

    counter: 0;
    //check if in array, if so update password
    while(counter < users.length){
        if(users[counter].email === req.body.email){
            users[counter].password = req.body.password;
        }
        counter += 1;
    }
    
    //return updated users to json
    res.json({users});
});

// Delete
// router.del


// TODO: Login
// router.post

// TODO: Delete their account

module.exports = router