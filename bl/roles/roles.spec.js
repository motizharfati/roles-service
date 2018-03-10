const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const memory = require('../../repository/memory/memory');
const rolesService = require('./roles');
const { roles: rolesEnum } = require('./enums');
const { Admin, Author, Manager } = rolesEnum;

describe('Roles', () => {

    let repo, roles;

    before(async () => {
        const { REDIS_PORT, REDIS_HOST } = process.env;
        repo = await memory.connect(REDIS_PORT, REDIS_HOST);
        roles = rolesService(repo);
        chai.use(chaiAsPromised);
        chai.should();
    });

    async function addRoles() {

        // Moti and Rotem are Admins
        await roles.putRole('Moti', Admin);
        await roles.putRole('Rotem', Admin);

        // Doron is Author
        await roles.putRole('Doron', Author);

        // Yotam is Manager and Author
        await roles.putRole('Yotam', Author);
        await roles.putRole('Yotam', Manager);

    }

    describe('putRole + getRoles', () => {

        before(addRoles);

        it('Should putRole reject if user is not a string', done => {
            roles.putRole(5).should.be.rejectedWith('Invalid Parameter: user. Must be a string').and.notify(done);
        });

        it('Should putRole reject if role is not a number', done => {
            roles.putRole('Moti', 'invalid_role').should.be.rejectedWith('Invalid Parameter: role. Must be a number').and.notify(done);
        });

        it('Should putRole reject if role is not exists in roles enum', done => {
            roles.putRole('Moti', -1).should.be.rejectedWith('Invalid Parameter: role. role not exists').and.notify(done);
        });

        it('Should getRoles', async () => {
            (await roles.getRoles('Moti')).should.have.members([Admin]);
            (await roles.getRoles('Yotam')).should.have.members([Author, Manager]);
            (await roles.getRoles('NOT_EXISTS')).should.have.members([]);
        });

    });

    describe('hasRole', () => {

        before(addRoles);

        it('Should hasRole return a Boolean', async () => {
            (await roles.hasRole('Rotem', Admin)).should.be.equals(true);
            (await roles.hasRole('Yotam', Admin)).should.be.equals(false);
        });

    });

    describe('hasRole', () => {

        before(addRoles);

        it('Should removeRole', async () => {
            await roles.removeRole('Yotam', Manager);
            (await roles.getRoles('Yotam')).should.have.members([Author]);
        });

    });

});