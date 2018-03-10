const asyncHandler = require('express-async-handler');
const express = require('express');
const router = express.Router();

module.exports = (options) => {

    const { roles } = options;

    router
        .post('/put-role', asyncHandler(putRole))
        .get('/get-roles', asyncHandler(getRoles));

    return router;

    async function putRole(req, res) {
        const { user, role } = req.body;
        await roles.putRole(user, role);
        res.json({ status: 'ok' });
    }

    async function getRoles(req, res) {
        const { user } = req.query;
        res.json({ status: 'ok', roles: await roles.getRoles(user) });
    }

};