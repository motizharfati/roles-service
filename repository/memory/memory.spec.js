const memory = require('./memory');
const chai = require('chai');
const { REDIS_PORT, REDIS_HOST } = process.env;

describe('Memory', () => {

    let repo;

    before(async () => {
        chai.should();
        repo = await memory.connect(REDIS_PORT, REDIS_HOST);

        // todo: Question: Should i call to "redisClient.flushall" OR should i create a "flushall" method inside the repo?
    });

    async function addRoles() {

        // Moti and Rotem are Admins
        await repo.putRole('Moti', 1);
        await repo.putRole('Rotem', 1);

        // Doron is Author
        await repo.putRole('Doron', 2);

        // Yotam is Manager and Author
        await repo.putRole('Yotam', 2);
        await repo.putRole('Yotam', 3);

    }

    describe('putRole + getRoles', () => {

        before(addRoles);

        it('Should getRoles', async () => {
            (await repo.getRoles('Moti')).should.have.members([1]);
            (await repo.getRoles('Yotam')).should.have.members([2, 3]);
            (await repo.getRoles('NOT_EXISTS')).should.have.members([]);
        });

    });

    describe('hasRole', () => {

        before(addRoles);

        it('Should hasRole return a Boolean', async () => {
            (await repo.hasRole('Rotem', 1)).should.be.equals(true);
            (await repo.hasRole('Yotam', 1)).should.be.equals(false);
        });

        it('Should hasRole return false even if the key does not exists on redis', async () => {
            (await repo.hasRole('NOT_EXISTS', 1)).should.be.equals(false);
        });

    });

    describe('hasRole', () => {

        before(addRoles);

        it('Should removeRole', async () => {
            await repo.removeRole('Yotam', 3); // todo: Question: Should remove operations return a Boolean if the record removed or not? it's important?
            (await repo.getRoles('Yotam')).should.have.members([2]);
        });

    });

});