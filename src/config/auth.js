const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../../db/models/User');
const bcrypt = require('bcryptjs');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

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

// Verify a JWT token
// Documentation: http://www.passportjs.org/packages/passport-jwt/
passport.use(
    new JWTstrategy(
        { secretOrKey: process.env.JWT_SECRET, jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() },
        async (jwtPayload, done) => {
            try {
                const user = await UserModel.findById(jwtPayload.user._id);
                if (user) {
                    done(null, true);
                } else {
                    done(null, false);
                }
            } catch (error) {
                console.log(error);
                done(error, false);
            }
        }
    )
);
