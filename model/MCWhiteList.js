
import fetch from 'node-fetch';
import { exec } from 'child_process';
import { read, write } from '../lib/JSONFile.js';
import dotenv from 'dotenv';

dotenv.config();

const UUIDURL = (username) => `http://tools.glowingmines.eu/convertor/nick/${username}`;
const WHITE_LIST_DIR = process.env.WHITE_LIST_DIR;

export function reloadWhitelist(resolveMessage) {
  return new Promise( (resolve, reject) => {
    exec('screen -S minecraft -p 0 -X stuff "whitelist reload\n"', (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        reject(err)
      } else {
        resolve(resolveMessage || '### Lista blanca recargada');
      }
    });
  });
}

export async function add(username) {
  try {
    const WHITE_LIST = await read(WHITE_LIST_DIR);

    const alreadyExistsUsername = WHITE_LIST.find( ({name}) => name === username);
    if(alreadyExistsUsername) return `El usuario ${username} ya fue agregado`;

    const response = await fetch(UUIDURL(username));
    const { offlinesplitteduuid } = await response.json();

    WHITE_LIST.push({
      uuid: offlinesplitteduuid,
      name: username,
    });
    
    await write(WHITE_LIST_DIR, WHITE_LIST);

    return await reloadWhitelist(`### Usuario ${username} agregado correctamente`);
  } catch (error) {
    console.log('Error', error);
    return "Error al agregar al usuario"
  }
}
