const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "password",
    host: "localhost",
    database: "crud"
})

module.exports = pool;