const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next(); // Okay I'm good to go, go save the user
    } catch (error) {
        next(error); // Pass this to mmongoose (going to throw an error and stop the save)
    }
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
