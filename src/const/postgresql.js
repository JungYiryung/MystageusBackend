const {Pool} = require("pg")

const pool = new Pool({
    "user" : "ubuntu",
    "password" : "1234",
    "host" : "localhost",
    "port" : 5432,
    "database" : "hw",
    "max" : 5
})

pool.connect()

module.exports = pool