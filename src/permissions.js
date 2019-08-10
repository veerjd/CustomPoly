disallowedChannels = ["general", "github-updates"]
allowedRoles = ["helper", "admin"]

function unallowedChannel(channelName) {
    channelStatus = disallowedChannels.includes(channelName)
    return channelStatus
}

function canDo(guildmember, channelName) {
    return new Promise((resolve, reject) => {
        resolveMsg = []
        let can

        guildmember.roles.some(x => {
            allowedRoles.forEach(role => {
                return can = x.name === role
            })
        })

        if(can)
            resolve()
        else
            reject("You are not allowed to perform this command.")
    })
}

module.exports = { unallowedChannel, canDo }