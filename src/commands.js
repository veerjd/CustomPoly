const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL
const prefix = process.env.PREFIX
const modes = require('./modes')

const pool = new Pool({
    connectionString: connectionString,
    ssl: true,
})

function setcode(discordUser, code) {
    return new Promise((resolve, reject) => {
        const verify = 'SELECT discord_id FROM players_test WHERE discord_id=$1'
        const valverify = [discordUser.id];

        pool.query(verify, valverify, (err, res) => {
            if(err) {
                console.error('ERROR:', err.message)
                resolve(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
                console.log('Any record with that discord id?:', res.rowCount)
                if (res.rowCount === 1) {
                    const text = 'UPDATE players_test SET discord_name=$1, poly_code=$2 WHERE discord_id=$3'
                    const values = [discordUser.username, code, discordUser.id]
                    pool.query(text, values, (err, result) => {
                        //console.log('result:', result)
                        if (err) {
                            console.error('ERROR:', err.message)
                            resolve(`${err.message}. Ping an @**admin** if you need help!`)
                        } else {
                            let resolveMsg = `Player **${discordUser.username}** updated in system with Polytopia code: \`${code}\`.`
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
                    const values = [discordUser.id, discordUser.username, code]
                    pool.query(text, values, (err, result) => {
                        if (err) {
                            console.error('ERROR:', err.message)
                            resolve(`${err.message}. Ping an @**admin** if you need help!`)
                        } else {
                            let resolveMsg = `Player **${discordUser.username}** created in system with Polytopia code: \`${code}\`.`

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

function code(user) {
    return new Promise((resolve, reject) => {
        let resolveMsg = [];
        const text = 'SELECT poly_code FROM players_test WHERE discord_id = $1'
        const value = [user.id]
        pool.query(text, value, (err, result) => {
            if(err) {
                console.error('ERROR:', err.message)
                resolve(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
                if(result.rows[0] === undefined)
                    resolveMsg[0] = `We found **${user.username}**, but his code isn't in our books. Have them use \`${prefix}setcode\`!`
                else {
                    resolveMsg[0] = `Here is **${user.username}**'s code for you to copy:`
                    resolveMsg[1] = result.rows[0].poly_code;
                }
                resolve(resolveMsg)
            }
        })
    })
}

function setname() {}

function open(hostUser, gametype) {
    return new Promise((resolve, reject) => {
        /*const text = 'INSERT INTO games_test () VALUES($1, $2, $3) RETURNING *'
        const values = [discordUser.id, discordUser.username, code]*/
        resolve("Yay")
    })
}

function test(hostUser, gametype) {
    return new Promise((resolve, reject) => {
        resolveMsg = []
        modesTesting = Object.keys(modes.testing)
        thismode = modesTesting.find(key => key.includes(gametype))
        if (thismode === undefined) {
            resolveMsg.push("You tried to open a game for a mode that doesn't exist *(yet?)*.")
        } else {
            resolveMsg.push("We opened game #1 for you.")
        }
        /*const text = 'INSERT INTO games_test () VALUES($1, $2, $3) RETURNING *'
        const values = [discordUser.id, discordUser.username, code]*/

        resolve(resolveMsg)
    })
}

function games() {}

function join(gameID) {}

function leave(gameID) {}

function deleteGame() {}

function start(gameID, gameName) {}

function win(gameID, winner) {}

function incomplete(player) {}

function complete(player) {}

function game(gameID) {}

function allgames(player, gameName) {}

function help(command) {}

module.exports = { setcode, setname, code, open, test, games, join, leave, deleteGame, start, win, incomplete, complete, game, allgames, help }