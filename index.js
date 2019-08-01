require('dotenv').config();
const { Client, RichEmbed } = require('discord.js');
const bot = new Client();
const pg = require('pg');
const http = require("http");

const database = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

database.connect();

database.query('SELECT fullname FROM test;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    database.end();
  });

const express = require('express');
var app = express();

bot.on('ready', () => {
    const prefix = process.env.PREFIX;
    console.log(`Logged in as ${bot.user.username}`);

    bot.user.setActivity(`prefix: ${prefix}`, { type: 'LISTENING' });
});

bot.on('message', message => {

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