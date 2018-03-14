'use strict';

const chai = require('chai');
const chaiHttp = require("chai-http");
const should = require('chai').should();


chai.use(chaiHttp);

const server = require('../server'); // Our server

describe('API endpoint /auctions', () => {

    before(() => {
        console.log("1");
    });

    after(function () {

        console.log("3");
    });

    describe('GET /auctions', () => {

        it('it should GET all the auctions', async (done) => {
            await chai.request(server).post("/reset");
            await chai.request(server).post("/resample");
            chai.request(server)
                .get('/auctions')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });
    });
});