const rolesService = require('./bl/roles/roles');
const server = require('./server/server');

let config, { ROLES_ENV } = process.env;

if (ROLES_ENV === 'prod') { config = require('./config.prod'); }
if (!config) { throw new Error('Missing config, are you missing ROLES_ENV parameter?'); }

const { repo: repoName, repoParams, port } = config;

init()
    .catch(err => console.error(err));

async function init() {
    const repo = await require('./repository/' + repoName + '/' + repoName).connect.apply(null, repoParams);
    const roles = rolesService(repo);
    const app = await server({ roles });
    app.listen(port, () => console.log(`Listening to port: ${port}`));
}