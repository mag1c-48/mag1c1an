const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const fetch = require('node-fetch');
const querystring = require('querystring');
require('dotenv').config();
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str); 
const prefix = 'd.';


client.on('ready', () => {
    console.log('Bot is ready');

});

client.on('message', msg => {
    if (msg.content.toLowerCase() === 'ping') {
        msg.reply('pong');
    }
});

client.on('message', async msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const cmd = args.shift().toLowerCase();
	
	if (cmd === 'cat') {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
		msg.channel.send(file);
	}
});
	

client.on('message', async msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const cmd = args.shift().toLowerCase();
	
	if (cmd === 'urban') {
		if (!args.length) {
			return msg.channel.send('No search term provided. USAGE: d.urban [search term]');
		}

		const query = querystring.stringify({ term: args.join(' ') });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
		if (!list.length) {
			return msg.channel.send(`No results found for **${args.join(' ')}**.`);
		}

		const [answer] = list;
		const embed = new MessageEmbed()
			.setColor('#EFFF00')
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
					{ name: 'Definition', value: trim(answer.definition, 1024) },
					{ name: 'Example', value: trim(answer.example, 1024) },
			);

		msg.channel.send(embed);
	}
});

client.on('message', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    if (cmd === 'dic') {
        if (!args.length) {
            return msg.channel.send('No search term provided. USAGE: d.dir [search term]');
        }

        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${args[0]}`)
        .then(response => response.json()).then(list => {

            if (list.length == 0) {
                return msg.channel.send(`No results found for **${args.join(' ')}**.`);
            }

            const [answer] = list;
                        let meaning_string = "";
                        for (let key in answer.meanings[0].definitions){
                                        meaning_string += `Definition ${parseInt(key) + 1}: ${answer.meanings[0].definitions[key].definition}\n`
                        }
            const embed = new MessageEmbed()
                .setColor('#b942f5')
                .setTitle(answer.word)
                .addFields(
                    { name: 'Definition', value: meaning_string },
                    { name: 'Phoentics', value: `Text: ${answer.phonetics[0].text}\nAudio: ${answer.phonetics[0].audio}`},
                );

            msg.channel.send(embed);
        })
        .catch(err => { console.log(err), msg.reply(`Could not define **${args[0]}**`)})
    }
});

client.on('message', async msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const cmd = args.shift().toLowerCase();
	
	if (cmd === 'dadjoke') {

		fetch("https://icanhazdadjoke.com/", {
				method 	:	"GET",
				headers	:	{
					Accept	:	"application/json",
				}
		}).then(response => response.json()).then(list => {
			msg.reply(list.joke);
		
		})
		.catch(err => { console.log(err),  msg.channel.send("woopsy there's been a fucky wucky")});

	}
	
});


client.login(process.env.TOKEN);

