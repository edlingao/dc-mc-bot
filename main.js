import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { add, reloadWhitelist } from './model/MCWhiteList.js';

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

  fetch("http://127.0.0.1:4040/api/tunnels")
    .then( response => {
      return response.json();
    })
    .then(({tunnels}) => {
      const [ tunnel ] = tunnels;
      const ipServerString = tunnel ? tunnel.public_url.split('tcp://')[1] : 'El servidor MC no esta abierto, contacte al admin';
      commands({
        command,
        ipServerString,
        message,
        args,
      });
    })
    .catch( (e) => {
      commands({
        message,
        command,
        ipServerString: 'El servidor MC no esta abierto, contacte al admin',
        args,
      })
    })
});


async function commands({command, ipServerString, message, args}) {
  switch(command){
    case 'ip':
      message.channel.send(`### ${ipServerString}`);
    break;
    case 'version':
      message.channel.send(process.env.VERSION);
    break;
    case 'help':
      message.channel.send(`
        ### Comandos disponibles:
        - !ip
        - !version
        - !help
        - !add <username>
        - !reload
      `);
    break;
    case 'add':
      const username = args[0];
      if(!username){
        message.channel.send('### Debes ingresar un nombre de usuario');
        return;
      }
      const text = await add(username)
      message.channel.send(text);
    break;
    case 'reload':
      message.channel.send(await reloadWhitelist());
    break;
  }
}











client.login(process.env.TOKEN);