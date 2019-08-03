const { Pool, Client } = require('pg')
const http = require("http");

const database = new Pool({
    connectionString: process.env.DATABASE_URL
});
(async () => {
  database.connect().catch(console.error);
})();

function setcode(discordID, discordName, code) {
    console.log(discordID, discordName, code)
    const text = 'INSERT INTO players_test (discord_id, discord_name, poly_code) VALUES($1, $2, $3) RETURNING *'
    const values = [discordID, discordName, code]
    /*database.query(text, values)
        .then(res => {
            database.end()
            console.log("res:", res)
        })
        .catch(e => {
            console.log("in catch")
            console.error(e)
        })
        .catch(console.error)*/
    database.query(text, values, (err, res) => {
        if (err) {
            console.log(err.stack)
            database.end()
        } else {
            console.log(res.rows[0])
            database.end()
        }
    })
    
}

function setname() {
    
}

module.exports = {setcode, setname}