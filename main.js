import {Client, GatewayIntentBits} from 'discord.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

dotenv.config();

const prefix = '!'

client.once('ready', (message) => {
    console.log('Codelyon is online');
});

client.on('messageCreate', (message) => {
  if(!message.content.startsWith(prefix) || message.author.bot ){
    return;
  }

  
  const words = message.content.slice(prefix.length).split(/ +/);
  const command = words[0];
  const args = words.filter( (word, index) => index >= 1 );
  const user = message.author;

  fetch("http://0.0.0.0:4040/api/tunnels")
    .then( response => response.json())
    .then(({tunnels}) => {
      const [ tunnel ] = tunnels;
      const ipServerString = tunnel ? tunnel.public_url.split('tcp://')[1] : 'El servidor MC no esta abierto, contacte al admin';
      commands({
        command,
        ipServerString,
        message,
      });
    })
    .catch( () => commands({
      message,
      command,
      ipServerString: 'El servidor MC no esta abierto, contacte al admin'
    }))
});


function commands({command, ipServerString, message}) {
  switch(command){
    case 'ip':
        message.channel.send(`### ${ipServerString}`);
    break;
  }
}











client.login(process.env.TOKEN);