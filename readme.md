# Install
* npm install

# Test
* npm t

# Run
* npm run prod

## In order to debug

* insert role from devtools: fetch('http://localhost:3555/roles/put-role', { method: 'POST', headers: { "content-type": "application/json" }, body: JSON.stringify({ user: "moti", role: 1 }) })
* see roles: http://localhost:3555/roles/get-roles?user=moti
