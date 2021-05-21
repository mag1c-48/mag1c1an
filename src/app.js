const Discord = require("discord.js");
const client = new Discord.Client();
require('dotenv').config();

client.on('ready', () => {
    console.log('Bot is ready');

});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
});

client.login(process.env.TOKEN);
