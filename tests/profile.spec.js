const { assert } = require('chai');
const ROUTE_PATH = '/api/profile/';
const REGISTER_ROUTE_PATH = '/api/register/';
const LOGIN_ROUTE_PATH = '/api/auth/login';
const moment = require('moment');
const request = require('supertest');
let server = require('../src/server');
const UserModel = require('../db/models/User.js');
const _ = require('underscore');

describe('API Profile', () => {
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

    async function getValidToken() {
        try {
            const user = await registerNewUser();

            const response = await request(server).post(LOGIN_ROUTE_PATH).send({ email: user.email, password: user.password });

            assert.equal(response.statusCode, 200);
            assert.isDefined(response.body.token);

            return response.body.token;
        } catch (error) {
            console.error(error);
        }
    }

    describe(`PUT ${ROUTE_PATH}`, () => {
        it('should return 200 with an authorized token', async () => {
            const authorizedToken = await getValidToken();

            const response = await request(server).put(ROUTE_PATH).set('Authorization', 'Bearer ' + authorizedToken);

            assert.equal(response.statusCode, 200);
        });

        it('should return 401 with unauthorized token', async () => {
            const token = 'blah';

            const response = await request(server).put(ROUTE_PATH).set('Authorization', 'Bearer ' + token);

            assert.equal(response.statusCode, 401);
        });
    });

    after(async () => {
        if (users.length === 0) {
            return;
        }

        try {
            // Remove added users
            const ids = _.pluck(users, '_id');
            await UserModel.deleteMany(
                {
                    _id: {
                        $in: ids
                    }
                }
            );
        } catch (error) {
            console.error(error);
        }
    });
});
