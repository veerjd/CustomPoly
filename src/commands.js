const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString: connectionString,
    ssl: true,
})

function setcode(discordID, discordName, code) {
    return new Promise((resolve, reject) => {
        console.log(discordID, discordName, code)
        const verify = 'SELECT discord_id FROM players_test WHERE discord_id=$1'
        const valverify = [discordID];

        pool.query(verify, valverify, (err, res) => {
            if(err) {
                console.error('Error executing query', err.message)
                resolve(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
                console.log('Any record with that discord id?:', res.rowCount)
                if (res.rowCount === 1) {
                    const text = 'UPDATE players_test SET discord_name=$1, poly_code=$2 WHERE discord_id=$3'
                    const values = [discordName, code, discordID]
                    pool.query(text, values, (err, result) => {
                        //console.log('result:', result)
                        if (err) {
                            console.error('Error executing query', err.message)
                            resolve(`${err.message}. Ping an @**admin** if you need help!`)
                        } else {
                            let resolveMsg = `Player ${discordName} updated in system with Polytopia code \`${code}\`.`
                            //console.log('result:', result)
                            //if (result.rows[0].poly_name === undefined)
                            //    resolveMsg = resolveMsg + `\nYou can set your Polytopia name using the \`${process.env.PREFIX}setname\` command`
                            resolve(resolveMsg)
                        }
                    })
                } else if (res.rowCount > 1) {
                    resolve('More than one result? Ping an @**admin** to deal with this!')
                } else { //if the entry doesn't exist, create it
                    const text = 'INSERT INTO players_test (discord_id, discord_name, poly_code) VALUES($1, $2, $3) RETURNING *'
                    const values = [discordID, discordName, code]
                    pool.query(text, values, (err, result) => {
                        if (err) {
                            console.error('Error executing query', err.message)
                            resolve(`${err.message}. Ping an @**admin** if you need help!`)
                        } else {
                            let resolveMsg = `Player ${discordName} created in system with Polytopia code \`${code}\`.`

                            //console.log('result:', result)
                            //if (result.rows[0].poly_name === undefined)
                            //    resolveMsg = resolveMsg + `\nYou can set your Polytopia name using the \`${process.env.PREFIX}setname\` command`
                            resolve(resolveMsg)
                        }
                    })
                }
            }
        })
    })
}

function setname() {
    
}

module.exports = {setcode, setname}