'use strict';

const chai = require('chai');
const chaiHttp = require("chai-http");
const should = require('chai').should();
const expect = require('chai').expect;


chai.use(chaiHttp);

const server = require('../server'); // Our server

describe('API endpoints /reset and /resample', () => {

    describe('POST /reset', () => {

        it('it should reset all the tables', async (done) => {
            await chai.request(server).post("/reset");
            chai.request(server)
                .get('/auctions')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an("array");
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('POST /resample', () => {

        it('it should fill all the tables', async (done) => {
            await chai.request(server).post("/reset");
            await chai.request(server).post("/resample");
            chai.request(server)
                .get('/auctions')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an("array");
                    res.body.length.should.be.eql(5);
                    done();
                });
        });
    });
});