const { assert } = require('chai');
const ROUTE_PATH = '/api/auth/';
const REGISTER_ROUTE_PATH = '/api/register/';
const moment = require('moment');
const request = require('supertest');
let server = require('../src/server');
const UserModel = require('../db/models/User.js');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const { response } = require('../src/server');

describe('API Auth', () => {
    let users = [];

    async function registerNewUser() {
        const body = { email: `test-${moment().unix() + users.length + _.random(10_000)}@please-remove.com`, password: `${moment().unix()}`};

        const response = await request(server).post(REGISTER_ROUTE_PATH).send(body);
        const user = await UserModel.findOne({ email: body.email });
        users.push(user);

        assert.equal(response.statusCode, 200);
        assert.equal(user.email, body.email);

        body._id = user._id;
        return body;
    }

    describe(`POST ${ROUTE_PATH}login`,() => {
        const path = `${ROUTE_PATH}/login`;
        let body = { email: null, password: null };
        let user;

        beforeEach(async () => {
            user = await registerNewUser();
            body = { email: user.email, password: user.password };
        });

        it('should login valid user and sign token with email and _id', async () => {

            const response = await request(server).post(path).send(body);
            const token = jwt.sign({ user: { _id: user._id, email: user.email } }, process.env.JWT_SECRET);

            assert.equal(response.statusCode, 200);
            assert.equal(response.body.token, token);
        });

        it('should return http status 401 when password is invalid', async () => {
            body.password = 'this should be invalid password';
            
            const response = await request(server).post(path).send(body);

            assert.equal(response.statusCode, 401);
        });

        it('should return http status 401 when a user cannot be found with a email that has not been registered', async () => {
            body.email = 'no-user-found-with-this-email@thisdoesntwork.com';
            
            const response = await request(server).post(path).send(body);

            assert.equal(response.statusCode, 401);
        });
    });

    after(async () => {
        if (users.length === 0) {
            return;
        }

        // Remove added users
        const ids = _.pluck(users, '_id');
        await UserModel.deleteMany(
            {
                _id: {
                    $in: ids
                }
            }
        );
    });
});