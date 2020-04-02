process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
//"test": "mocha --recursive --exit"

const app = require('../app');
const dbConnect = require('../app/database/connect');

describe('Routes Team.js', ()=>{
    before((done)=>{
        dbConnect.connect()
            .then(() => done())
            .catch((err) => done(err));
    });

    after((done)=>{
        dbConnect.connect()
            .then(() => done())
            .catch((err) => done(err));
    });

    describe('Signup POST /signup', ()=>{
        it('OK, ')
    });
});
