const Router = require('../src/routes/register.js');
const { assert } = require('chai');
const ROUTE_PATH = '/api/register/';
const moment = require('moment');
const request = require('supertest');
let server = require('../src/server');

describe('API Register', () => {

    beforeEach(() => {

    });

    describe(`POST ${ROUTE_PATH}`, () => {

        beforeEach(() => {

        });

        it('should add new user to database', async () => {
            // Initialize
            const body = { email: `test-${moment().unix()}@please-remove.com`, password: 'test' };

            // Act (call method)
            const response = await request(server).post('/api/register/').send(body);

            // Assert
            assert.equal(response.status, 200);
        });
    });

    afterEach(() => {

    });
});
