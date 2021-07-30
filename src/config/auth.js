const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../../db/models/User');
const bcrypt = require('bcryptjs');

passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email', // req.body.email
            passwordField: 'password' // req.body.password
        },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email: email });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const isValid = await bcrypt.compare(password, user.password);
                if (isValid) {
                    return done(null, user, {
                        message: 'Logged in successfully'
                    });
                } else {
                    return done(null, false, {
                        message: 'Wrong password'
                    });
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);
