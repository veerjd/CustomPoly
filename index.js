require('dotenv').config();
const { Client } = require('discord.js');
const bot = new Client();
const { setcode, code, help } = require("./src/commands");
const { unallowedChannel, canDo } = require("./src/permissions")

const express = require('express');
var app = express();

bot.on('ready', () => {
    const prefix = process.env.PREFIX;
    console.log(`Logged in as ${bot.user.username}`);

    bot.user.setActivity(`prefix: ${prefix}`, { type: 'LISTENING' });
});

bot.on('message', message => {
    const prefix = process.env.PREFIX;

    if(message.author.bot || !message.content.startsWith(prefix) || message.content === prefix)
        return;

    if(unallowedChannel(message.channel.name))
        return message.channel.send(`You shouldn't use me in this channel...`)
            .then(x => {
                x.delete(10000)
                message.delete(10000)
            })

//--------------------------------------------
//             COMMAND HANDLER
//--------------------------------------------
    let cmd = message.content.toLowerCase().slice(prefix.length).split(/ +/, 1).toString();
    console.log(`${message.cleanContent} in #${message.channel.name} by ${message.author.tag}`);
    let args = message.content.slice(prefix.length+cmd.length+1).split(/ +/);

//--------------------------------------------
//                 SETCODE
//--------------------------------------------
    if (cmd === "setcode") {
        if(args.length === 1) {
            setcode(message.author, args[0])
                .then(x => {
                    console.log(x)
                    message.channel.send(x)
                })
        } else if (args.length === 2) {
            canDo(message.member, message.channel.name)
                .then(() => {
                    if(message.mentions.members.first())
                        user = message.mentions.members.first().user
                    else {
                        member = message.guild.members.find(x => x.user.username.toLowerCase().includes(args[0].toLowerCase()))
                        console.log("member:", member.user.username)
                        user = member.user
                    }
                    setcode(user, args[args.length - 1])
                        .then(x => {
                            console.log(x)
                            message.channel.send(x)
                        })
                })
                .catch(x => {
                    console.log(x)
                    message.channel.send(x)
                })
        }
    }
//--------------------------------------------
//                 CODE
//--------------------------------------------
    if (cmd === "code") {
        if(args.length === 0) {
            code(message.author)
                .then(x => {
                    console.log(x)
                    x.forEach(x => message.channel.send(x))
                })
        } else {
            if(message.mentions.members.first()) {
                id = message.mentions.members.firstKey()
                user = message.mentions.members.first().user
            } else {
                member = message.guild.members.find(x => x.user.username.toLowerCase().includes(args[0].toLowerCase()))
                if(member === null)
                    return message.channel.send(`We couldn't find player **${args[0]}** ¯\\\_(ツ)_/¯`)
                else
                    user = member.user
            }
            code(user)
                .then(x => {
                    console.log(x)
                    x.forEach(x => message.channel.send(x))
                })
        }
    }
})
//--------------------------------------
//              END/OTHER
//--------------------------------------
const port = process.env.PORT || 5000;

/*setInterval(function() {
    https.get("https://custompoly.herokuapp.com");
}, 300000); // every 5 minutes (300000)*/

app.get('/', function (req, res) {
    res.send('Hello Phil!')
})

app.listen(port, () => {
    console.log('Listening on ' + port);
});

bot.login(process.env.TOKEN);