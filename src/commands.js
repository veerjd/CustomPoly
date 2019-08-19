const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL
const prefix = process.env.PREFIX
const modes = require('./modes')
const display = require("./display")

const pool = new Pool({
    connectionString: connectionString,
    ssl: true,
})
//--------------------------------------------
//                 SETCODE
//--------------------------------------------
function setcode(discordUser, code) {
    return new Promise((resolve, reject) => {
        const verify = 'SELECT discord_id FROM players WHERE discord_id=$1'
        const valverify = [discordUser.id];

        pool.query(verify, valverify, (err, res) => {
            if(err) {
                console.error('ERROR:', err.message)
                resolve(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
                console.log('Any record with that discord id?:', res.rowCount)
                if (res.rowCount === 1) {
                    const text = 'UPDATE players SET discord_name=$1, poly_code=$2 WHERE discord_id=$3'
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
                    const text = 'INSERT INTO players (discord_id, discord_name, poly_code) VALUES($1, $2, $3) RETURNING *'
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
//--------------------------------------------
//                  CODE
//--------------------------------------------
function code(user) {
    return new Promise((resolve, reject) => {
        let resolveMsg = [];
        const text = 'SELECT poly_code FROM players WHERE discord_id = $1'
        const values = [user.id]
        pool.query(text, values, (err, result) => {
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
//--------------------------------------------
//                 SETNAME
//--------------------------------------------
function setname() {}
//--------------------------------------------
//                  OPEN
//--------------------------------------------
function open(hostUser, gametype, botname) {
    console.log("botname:", botname)
    return new Promise((resolve, reject) => {
        resolveMsg = []
        modesOngoing = Object.keys(modes.ongoing)
        thismode = modesOngoing.find(key => key.includes(gametype))
        modesTesting = Object.keys(modes.testing)
        testmode = modesTesting.find(key => key.includes(gametype))
        if (modesOngoing.length === 0) {
            resolveMsg.push(`No modes are available right now. To open a test game, use \`${prefix}test\`.`)
        } else if (!gametype) {
            resolveMsg.push(`You need to specify a game type you wanna the available modes are ${modesOngoing}.`)
        } else if (testmode) {
            resolveMsg.push("You tried to open that is being tested and not yet open to free play.")
        } else if (thismode === undefined) {
            resolveMsg.push("You tried to open a game for a mode that doesn't exist *(yet?)*.")
        } else {
            if (botname === "[beta]CustomPoly")
                text = 'INSERT INTO games_beta (host_id, allplayer_ids, is_test, gamemode) VALUES($1, $2, $3) RETURNING *'
            else 
                text = 'INSERT INTO games (host_id, allplayer_ids, is_test, gamemode) VALUES($1, $2, $3) RETURNING *'
            values = [hostUser.username, ARRAY[hostUser], true, gametype]

            console.log("text:", text)
            console.log("values:", values)

            resolveMsg.push(`We opened game #1 for you for the **${gametype}** game mode.`)
        }

        resolve(resolveMsg)
    })
}
//--------------------------------------------
//                  TEST
//--------------------------------------------
function test(hostUser, gametype, botname) {
    return new Promise((resolve, reject) => {
        resolveMsg = []
        modesOngoing = Object.keys(modes.ongoing)
        openmode = modesOngoing.find(key => key.includes(gametype))
        modesTesting = Object.keys(modes.testing)
        thismode = modesTesting.find(key => key.includes(gametype))
        if (modesTesting.length === 0) {
            resolveMsg.push(`No modes are under test right now.`)
        } else if (!gametype) {
            resolveMsg.push(`You need to specify a game type you wanna the available modes are **${modesTesting}**.`)
        } else if (openmode) {
            resolveMsg.push("You tried to open that is being tested and not yet open to free play.")
        } else if (thismode === undefined) {
            resolveMsg.push("You tried to open a test game for a mode that doesn't exist (*yet*?).")
        } else {
            if (botname === "[beta]CustomPoly")
                text = 'INSERT INTO games_beta (host_id, allplayer_ids, is_test, gamemode) VALUES($1, $2, $3)'
            else 
                text = 'INSERT INTO games (host_id, allplayer_ids, is_test, gamemode) VALUES($1, $2, $3)'
            values = [hostUser.id, [hostUser.id], true, thismode]

            console.log("text:", text)
            console.log("values:", values)

            resolveMsg.push(`We opened test game #1 for you for the **${thismode}** game mode.`)
        }

        resolve(resolveMsg)
    })
}
//--------------------------------------------
//                  GAME
//--------------------------------------------
function game(gameID, richmsg, botname, guild) {
    return new Promise((resolve, reject) => {
        if (botname === "[beta]CustomPoly") {
            text = 'SELECT * FROM games_beta WHERE game_id = $1'
        } else {
            text = 'SELECT * FROM games WHERE game_id = $1'
        }
        values = [Number(gameID)]

        console.log("text:", text)
        console.log("values:", values)

        pool.query(text, values, (err, result) => {
            if(err) {
                console.error('ERROR:', err.message)
                resolve(`${err.message}. Ping an @**admin** if you need help!`)
            } else {
                cGame = result.rows[0]
                if(cGame === undefined)
                    richmsg.setTitle(`No games were found with that ID.`)
                else {
                    if(cGame.is_pending) //if not full
                        richmsg = display.pending(richmsg,cGame,guild)
                    else if (!cGame.is_pending && !cGame.is_completed) //if incomplete
                        richmsg = display.incomplete(richmsg,cGame,guild)
                    else if (cGame.is_completed && !cGame.is_confirmed) //if finished
                        richmsg = display.completed(richmsg,cGame,guild)
                    else if (cGame.is_confirmed) //if confirmed
                        richmsg = display.confirmed(richmsg,cGame,guild)
                }
                resolve(richmsg)
            }
        })
    })
}

function games(options) {}

function join(gameID) {}

function leave(gameID) {}

function deleteGame(gameID) {}

function start(gameID, gameName) {}

function win(gameID, winner) {}

function incomplete(player) {}

function complete(player) {}

function allgames(player, gameName) {}

function help(command) {}

module.exports = { setcode, setname, code, open, test, games, join, leave, deleteGame, start, win, incomplete, complete, game, allgames, help }