/*************************************************
  This is the main file for the application
  Includes endpoint implementation
  Calls for the checks, which are implemented
  in a separate module
*************************************************/

const express = require('express');
const ibanChecker = require('./iban-checker.js');

const app = express();

const API_PATH = '/api/check_iban/:iban'
const BAD_REQUEST = 400;
const SUCCESS = 200;

const server = app.listen(3000, () => {
    console.log('Application is running on port 3000');
});

app.get(API_PATH, async (req, res, next) => {
    let iban = req.params.iban;
    let body = {};
    body['original'] = iban;

    let result = ibanChecker.checkIBAN(iban);

    if (result.status === 0) {
        body['result'] = 'IBAN OK';
    } else {
        body['result'] = 'IBAN NOT OK';
        body['reason'] = result.reason;
    }
    return res
        .status(SUCCESS)
        .json(body);
});

app.get('*', (req, res, next) => {
    let body = {};
    body['result']  = 'BAD REQUEST';
    body['reason']  = 'Invalid request format';
    body['format']  = 'localhost:3000/api/check_iban/:iban';
    body['example'] = 'localhost:3000/api/check_iban/SE8730000000010123456789';
    return res
        .status(BAD_REQUEST)
        .json(body);
});

module.exports = server;