module.exports = init;

const enums = require('./enums');

function init(repo) {

    return {
        putRole,
        removeRole,
        getRoles,
        hasRole
    };

    async function putRole(user, role) { // todo: Question: What if the user not exists on "Users" Service? Should we validate it here?
        validateUser(user);
        validateRole(role);
        await repo.putRole(user, role);
    }

    async function removeRole(user, role) {
        validateUser(user);
        validateRole(role);
        await repo.removeRole(user, role);
    }

    async function getRoles(user) {
        validateUser(user);
        return await repo.getRoles(user);
    }

    async function hasRole(user, role) {
        validateUser(user);
        validateRole(role);
        return await repo.hasRole(user, role);
    }

    function validateUser(user) {
        if (typeof(user) !== 'string') { throw new Error('Invalid Parameter: user. Must be a string'); }
    }

    function validateRole(role) {
        if (typeof(role) !== 'number') { throw new Error('Invalid Parameter: role. Must be a number'); }
        if (!isValueExistsInEnum(enums.roles, role)) { throw new Error('Invalid Parameter: role. role not exists'); }
    }

    function isValueExistsInEnum(enumItem, val) {
        return new Set(Object.values(enumItem)).has(val);
    }

}