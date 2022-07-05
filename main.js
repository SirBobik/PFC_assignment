const express = require('express');

const app = express();

const BAD_REQUEST = 400;
const SUCCESS = 200;

const server = app.listen(3000, () => {
    console.log("Application is running on port 3000");
});

app.get('*', (req, res, next) => {
    let body = {};
    body['reason']  = 'Invalid request format.';
    body['format']  = 'localhost:3000/api/check_iban/:iban';
    body['example'] = 'localhost:3000/api/check_iban/SE8730000000010123456789';
    return res
        .status(BAD_REQUEST)
        .json(body);
});

module.exports = server;