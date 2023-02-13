//  modules
const fs = require("fs");
const path = require("path");
//  data
const config = require("../data/config.json");
//  files
const util = require("./util.js");

const files = fs.readdirSync(path.join(__dirname, "../commands"));
var commands = [];
files.forEach(file => {
  commands.push(require(`../commands/${file}`));
});



module.exports = (params, content) => {
  if(!params.isDiscord) if(params.username === params.mcBot.username) return false;

  var isCommand = false;

  commands.forEach(command => {
    command.names.forEach(name => {
      if(content.split(" ")[0].toLowerCase() === `${config.prefix}${name.toLowerCase()}`) {
        isCommand = true;
        execute(command, params, content);
      }
    });
  });
  
}

function execute(command, params, content) {
  const {
    names,
    expectedArgs,
    minArgs,
    description,
    discord,
    callback
  } = command;

  const args = content.split(" ");
  args.shift();

  if(args.length < minArgs) {
    util.reply(params, `Wrong syntax! Please use ${config.prefix}${names[0]} ${expectedArgs}`);
    return;
  }

  if(params.isDiscord && !discord) {
    util.reply(params, "You can't use this command here");
    return;
  }

  params.reply = (message) => {
    util.reply(params, message);
  };

  callback(params, args, content);
}

/*
PARAMS:
Both...

isDiscord,
mcBot,
dcBot,
Server,
reply

Minecraft...
username

Discord...
message
*/