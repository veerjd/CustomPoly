disallowedChannels = ["general", "github-updates"]
allowedRoles = ["helper", "admin"]

function unallowedChannel(channelName) {
    channelStatus = disallowedChannels.includes(channelName)
    return channelStatus
}

function can(user, channelName) {
    return new Promise((resolve, reject) => {
        resolveMsg = []
    })
}

module.exports = { unallowedChannel, can }

/*const = restrictions {
    staff: ,
    helper
}*/