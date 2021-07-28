const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../../db/models/User');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
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


                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user, {
                        message: 'Logged in Successfully'
                    });
                } else {
                    return done(null, false, {
                        message: 'Wrong Password'
                    });
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);