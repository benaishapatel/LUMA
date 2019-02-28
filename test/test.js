var assert = require("assert")
var should = require('should'); 
var router = require("../routes/index.js")
var request = require('supertest');

describe('Routing', function() {
  var url = 'http://localhost:3000';
  before(function(done) {
    done();
  });
  describe('Percent', function() {
    it('Should get data for B220', function(done) {
      request(url)
        .get('/percents')
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          should.exist(res.body['EBU3B B220']);
          done();
      });
    });
    it('Should NOT get data for B280', function(done) {
      request(url)
        .get('/percents')
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          should.not.exist(res.body['EBU3B B280']);
          // this is should.js syntax, very clear
          done();
      });
    });
  });
  describe('layout', function() {
    it('Should get length of B220', function(done) {
      request(url)
        .get('/layout/EBU3B B220')
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          should.exist(res.body['length']);
          // this is should.js syntax, very clear
          done();
      });
    });
    it('Should have computers for B230', function(done) {
      request(url)
        .get('/layout/EBU3B B220')
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          should.exist(res.body['computers']);
          done();
      });
    });
  });
  describe('computers', function() {
    it('Should have a first computer for B230', function(done) {
      request(url)
        .get('/computers/EBU3B B230')
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          should.exist(res.body['ACS_CSEB230_01']);
          done();
      });
    });
  });
  describe('reservations', function() {
    it('Should get reservations', function(done) {
      request(url)
        .get('/reservations')
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          should.exist(res.body);
          done();
      });
    });
  });
});
