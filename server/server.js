const express = require('express');
const bodyParser = require('body-parser');
const rolesApi = require('./api/roles.api.js');

module.exports = init;

async function init(options) {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use('/roles', rolesApi(options));
    app.use((err, req, res, next) => res.status(500).json({ status: 'error', error: err.toString() }));
    return app;
}