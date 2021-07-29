const { assert } = require('chai');
const ROUTE_PATH = '/api/register/';
const moment = require('moment');
const request = require('supertest');
let server = require('../src/server');
const UserModel = require('../db/models/User.js');
const _ = require('underscore');

describe('API Register', () => {
    let users;

    beforeEach(() => {
        users = [];
    });

    describe(`POST ${ROUTE_PATH}`, () => {

        it('should add new user to database', async () => {
            // Initialize
            const body = { email: `test-${moment().unix()}@please-remove.com`, password: 'test' };

            // Act (call method)
            const response = await request(server).post('/api/register/').send(body);
            const user = await UserModel.findOne({ email: body.email });
            users.push(user);

            // Assert
            assert.equal(response.status, 200);
            assert.equal(user.email, body.email);
        });

        it('should not add user when email is missing', async () => {
            // Initialize
            const body = { password: 'test' };

            // Act (call method)
            const response = await request(server).post('/api/register/').send(body);
    
            // Assert
            assert.equal(response.status, 500);
            assert.equal(response.body.msg, 'Internal server error');
        });

        it('should not add user when password is missing', async () => {
            // Initialize
            const body = { email: '1234' };

            // Act (call method)
            const response = await request(server).post('/api/register/').send(body);
    
            // Assert
            assert.equal(response.status, 500);
        });

        it('should not add a user with existing email in database', async () => { //got test to pass, having trouble making it fail
            // Initialize
            const body = { email: `testingDuplicate-${moment().unix()}@please-remove.com`, password: 'test' };

            // Act (call method)
            const response1 = await request(server).post('/api/register').send(body); 
            const response2 = await request(server).post('/api/register').send(body);
            const user = await UserModel.findOne({ email: body.email });
            users.push(user);

            // Assert
            assert.notEqual(response1, response2);
            assert.equal(response1.status, 200);
            assert.equal(response2.status, 500);
        });
    });

    afterEach(async () => {
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
