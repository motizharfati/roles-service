const Promise = require('bluebird');
const redis = require('redis-mock');
const config = require('./memory.config');

module.exports = { connect };

function repository(redisClient) {

    const { rolesUser  } = config.redisKeys;

    return {
        putRole,
        removeRole,
        getRoles,
        hasRole
    };

    // todo: Question: Should i add validations inside the repository methods? it's internal... so maybe the service should make sure that every parameter will pass correctly?

    async function putRole(user, role) {
        await redisClient.saddAsync(rolesUser + user, role.toString());
    }

    async function removeRole(user, role) {
        await redisClient.sremAsync(rolesUser + user, role.toString());
    }

    async function getRoles(user) {
        return (await redisClient.smembersAsync(rolesUser + user)).map(item => parseInt(item, 10));
    }

    async function hasRole(user, role) {
        return Boolean(await redisClient.sismemberAsync(rolesUser + user, role.toString()));
    }

}

async function connect(port, host) {

    const redisClient = await redis.createClient(port, 'host.redis.com');

    return repository(Promise.promisifyAll(redisClient));

}


