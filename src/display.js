module.exports.pending = function (richmsg,cGame,guild) {
    if(cGame.is_test)
        richmsg.setTitle(`**${cGame.gamemode.toUpperCase()}** Test Game ${cGame.game_id}`)
    else
        richmsg.setTitle(`**${cGame.gamemode.toUpperCase()}** Game ${cGame.game_id}`)

    players = []
    cGame.allplayers_ids.forEach((x, index) => {
        member = guild.members.get(x)
        players[index] = member.user.username
    })
    richmsg.setDescription(players)
    return richmsg
}

module.exports.incomplete = function (rishmsg,cGame,guild) {
    if(cGame.is_test)
        richmsg.setTitle(`**${cGame.gamemode.toUpperCase()}** Test Game ${cGame.game_id}`)
    else
        richmsg.setTitle(`**${cGame.gamemode.toUpperCase()}** Game ${cGame.game_id}`)

    players = []
    cGame.allplayers_ids.forEach((x, index) => {
        member = guild.members.get(x)
        players[index] = member.user.username
    })
    richmsg.setDescription(players)
    return richmsg
}

module.exports.completed = function (rishmsg,cGame,guild) {
    
}

module.exports.confirmed = function (rishmsg,cGame,guild) {
    
}