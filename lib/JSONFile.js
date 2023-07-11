import fs from 'fs';
import path from 'path';
import os from 'os';

// Return JSON content as a JS object
export function read(absolutePath) {
  const FILE_PATH = path.join(os.homedir(), absolutePath.replace(/^~/, ''));

  return new Promise( (resolve, reject) => {
    fs.readFile(FILE_PATH, 'utf8', (err, jsonString) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(jsonString));
    });
  });

}

// Write JS object as JSON content
export function write(absolutePath, jsonObj) {
  const FILE_PATH = path.join(os.homedir(), absolutePath.replace(/^~/, ''));


  return new Promise( (resolve, reject) => {
    fs.writeFile(FILE_PATH, JSON.stringify(jsonObj), (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve("File write success");
    });
  });
}
