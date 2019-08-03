const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL
const pool = new Pool({
  connectionString: connectionString,
})

const client = new Client({
  connectionString: connectionString,
})
client.connect()

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
    client.query(text, values, (err, res) => {
        if (err) {
            console.log(err.stack)
            client.end()
        } else {
            console.log(res.rows[0])
            client.end()
        }
    })
    
}

function setname() {
    
}

module.exports = {setcode, setname}