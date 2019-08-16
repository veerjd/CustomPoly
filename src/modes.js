/*const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL
const prefix = process.env.PREFIX

const pool = new Pool({
    connectionString: connectionString,
    ssl: true,
})*/

diplomacy = {
    name: "FFA Diplomacy",
    shortrules: "",
    wincondition: ""
}

werewolf = {
    name: "Werewolf",
    shortrules: "",
    wincondition: ""
}

powerbender = {
    name: "Powerbender",
    shortrules: "",
    wincondition: ""
}

module.exports.ongoing = {}

module.exports.testing = {diplomacy, werewolf, powerbender}