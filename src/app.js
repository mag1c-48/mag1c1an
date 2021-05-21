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


const jokes = [
  'I went to a street where the houses were numbered 8k, 16k, 32k, 64k, 128k, 256k and 512k. It was a trip down Memory Lane.',
  '“Debugging” is like being the detective in a crime drama where you are also the murderer.',
  'The best thing about a Boolean is that even if you are wrong, you are only off by a bit.',
  'A programmer puts two glasses on his bedside table before going to sleep. A full one, in case he gets thirsty, and an empty one, in case he doesn’t.',
  'If you listen to a UNIX shell, can you hear the C?',
  'Why do Java programmers have to wear glasses? Because they don’t C#.',
  'What sits on your shoulder and says “Pieces of 7! Pieces of 7!”? A Parroty Error.',
  'When Apple employees die, does their life HTML5 in front of their eyes?',
  'Without requirements or design, programming is the art of adding bugs to an empty text file.',
  'Before software can be reusable it first has to be usable.',
  'The best method for accelerating a computer is the one that boosts it by 9.8 m/s2.',
  'I think Microsoft named .Net so it wouldn’t show up in a Unix directory listing.',
  'There are two ways to write error-free programs; only the third one works.',
];

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const cmd = args.shift().toLowerCase();
	if (cmd === 'joke') {
		msg.channel.send(jokes[Math.floor(Math.random() * jokes.length)]);
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
		console.log(list);
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

client.login(process.env.TOKEN);

