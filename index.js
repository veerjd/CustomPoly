require('dotenv').config();
const { Client, RichEmbed } = require('discord.js');
const bot = new Client();
const pg = require('pg');
const http = require("http");
const { setcode, setname, code } = require("./src/commands");

/*const database = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});*/

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

//--------------------------------------------
//             COMMAND HANDLER
//--------------------------------------------
    let cmd = message.content.toLowerCase().slice(prefix.length).split(/ +/, 1).toString();
    console.log(`${message.cleanContent} in ${message.guild.name.toUpperCase()} in #${message.channel.name} by ${message.author.tag}`);
    let args = message.content.slice(prefix.length+cmd.length+1).split(/ +/);
    console.log("args:", args)

    if (cmd === "setcode") {
        if(args.length === 1) {
            setcode(message.author.id, message.author.username, args[0])
                .then(x => message.channel.send(x))
        } else if (args.length === 2) {
            let id
            let username
            if(message.mentions.members.first()) {
                id = message.mentions.members.firstKey()
                username = message.mentions.members.first().user.username
            } else {
                member = message.guild.members.find(x => x.user.username.includes(args[0]))
                id = member.id
                username = member.user.username
            }
            setcode(id, username, args[args.length - 1])
                .then(x => message.channel.send(x))
        }
    }
    if (cmd === "code") {
        if(args.length === 0) {
            code(message.author.id, message.author.username)
                .then(x => message.channel.send(x))
        } else if (args.length === 1) {
            let id
            let username
            if(message.mentions.members.first()) {
                id = message.mentions.members.firstKey()
                username = message.mentions.members.first().user.username
            } else {
                member = message.guild.members.find(x => x.user.username.includes(args[0]))
                if(member === null)
                    return message.channel.send(`We couldn't find player **${args[0]}** ¯\\\_(ツ)_/¯`)
                else {
                    id = member.id
                    username = member.user.username
                }
            }
            code(id, username)
                .then(x => x.forEach(x => message.channel.send(x)))
        }
    }
})

//--------------------------------------
//              END/OTHER
//--------------------------------------
const port = process.env.PORT || 5000;

/*setInterval(function() {
    http.get("http://custompoly.herokuapp.com");
}, 300000); // every 5 minutes (300000)*/

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('Listening on ' + port);
});

bot.login(process.env.TOKEN);