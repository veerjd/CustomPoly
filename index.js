require('dotenv').config();
const { Client, RichEmbed } = require('discord.js');
const bot = new Client();
const pg = require('pg');
const http = require("http");
const {setcode, setname} = require("./src/commands");

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
    let args = message.content.toLowerCase().slice(prefix.length+cmd.length+1).split(/ +/);
    console.log("args:", args)

    if (cmd === "setcode") {
        setcode(message.author.id, message.author.username, args[0])
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