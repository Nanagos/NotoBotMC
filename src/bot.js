//  modules
const mineflayer = require("mineflayer");
const axios = require("axios");
//  data
const config = require("../data/config.json");
//  files
const util = require("./util.js");
const chat = require("./chat.js");
const cmdBase = require("./cmdBase.js");

async function create(server, dcBot) {
  

  let offlineMessageSent = false;
  let online = false;
  
  let serverHost = server.ip;
  let serverPort = 25565;
  
  if(serverHost.includes(":")) {
    const hostArray = serverHost.split(":");
    serverHost = hostArray[0];
    serverPort = hostArray[1];
  }

  const crackedPassword = server.crackedPassword ? server.crackedPassword : process.env["CrackedPassword"];

  let options = {
    host: serverHost,
    version: server.version,
    port: serverPort,
    plugins: util.plugins,
    settings: {
      viewDistance: 8
    }
  }

  if(server.cracked) {
    options.username = server.username;
  } else {
    options.username = process.env["LoginEmail"];
    options.password = process.env["LoginPassword"];
    options.auth =  "microsoft";
    options.authTitle = "00000000402b5328";
  }

  console.log("Bot created on " + server.ip);

  let lastMessageTime = 0;
  /*
  {
    msg,
    color,
    amount,
    interactions
  }
  */
  let lastMessage;

  
  let mcBot;
  await login();

  setInterval(updateTablist, 10 * 60 * 1000);
  dcBot.on("messageCreate", onDiscordMessage);

  
  setInterval(lookAtNearestPlayer, 100);

  async function login() {
    if(!(await axios.get(`https://api.mcsrvstat.us/2/${serverHost}${serverPort === 25565 ? "" : `:${serverPort}`}`)).data.online) {
      if(!offlineMessageSent) sendChannels("The server is currently not online. The bot will relog when the server is up again.", "RED");
      offlineMessageSent = true;
      setTimeout(login, 10 * 60 * 1000);
      return;
    }
    offlineMessageSent = false;
    
    mcBot = mineflayer.createBot(options);
    bindEvents();
  }

  async function bindEvents() {
    mcBot.on("error", (error) => {
      console.log(error);
    });
    
    mcBot.once("login", () => {
      online = true;
      console.log("NotoBot connected to " + server.ip);
      sendChannels("NotoBot connected", "GREEN");
      if(server.cracked) {
        setTimeout(() => {
          mcBot.chat(`/login ${crackedPassword}`);
          mcBot.chat(`/register ${crackedPassword} ${crackedPassword}`);
        }, 1000);
      }
    });

    mcBot.once("end", (reason) => {
      online = false;
      console.log("NotoBot disconnected from " + server.ip);
      sendChannels("NotoBot disconnected", "RED");

      mcBot.quit();
      mcBot.end();
      setTimeout(() => {
        login();
      }, 60 * 1000);
    });

    mcBot.on("chat", (username, message) => {
      if(message.startsWith(config.prefix)) {
        cmdBase({
          isDiscord: false,
          username: username,
          mcBot: mcBot,
          dcBot: dcBot,
          server: server
        }, message);
      }
    });

    mcBot.on("message", (json) => {
      if(Date.now() - lastMessageTime < 500) return;
      lastMessageTime = Date.now();
      
      const res = chat.convertJson(json);
      if(!res) {
        console.log("could not convert json: ", JSON.stringify(json, null, 2));
      }
      if(!res) return;
      let { message, color } = res;
      
      if(!util.hasContent(message)) return;

      if(message.match(/[^ ]+ wants to teleport to you./g)) {
        const player = message.split(" ")[0];
        console.log(`${player} wants to teleport to me`);

        mcBot.chat(`/tpy ${player}`);
        setTimeout(() => {
          mcBot.chat(`/w ${player} Hello, ${player}. Have a nice day :)`);
        }, 1000);
      }
      
      if(color === null) color = "WHITE";
      sendChannels(message, color);
    });
  }

  //  MINECRAFT FUNCTIONS

  function updateTablist() {
    try {
      
      const header = mcBot.tablist.header;
      const footer = mcBot.tablist.footer;
  
      const players = [];
      for(key in mcBot.players) {
        players.push(mcBot.players[key].username);
      }
  
      server.channels.forEach(channel => {
        dcBot.guilds.cache.forEach(_guild => {
          _guild.channels.cache.forEach(_channel => {
            if(_channel.id === channel) {
              _channel.setTopic(`**IP**: ${server.ip}\n` +
                `**Players**(${players.length}): ${players.join(", ")}\n` +
                `**Tab**:\n` +
                `${header}\n` +
                `${footer}\n`);
            }
          });
        });
      });
      
    } catch(error) {}
  }

  function lookAtNearestPlayer() {
    if(!online) return;
    const entities = Object.values(mcBot.entities);

    let players = [];
    entities.forEach(entity => {
      if(entity.type !== "player") return;
      players.push(entity);
    });

    if(players.length === 0) return;

    players = players.sort((a, b) => {
      return util.distance(mcBot.entity, b) - util.distance(mcBot.entity, a);
    });

    mcBot.lookAt(players[0].position.offset(0, 1.6, 0));
  }

  //  DISCORD FUNCTIONS

  function onDiscordMessage(message) {
    let { channel, author, content } = message;
    if(author.tag === dcBot.user.tag) return;

    server.channels.forEach(_channel => {
      if(channel.id === _channel) {
        if(content.length === 0) return;

        if(author.tag === "Nanagos#1872") {
          if(content === "??relog") {
            message.reply("relogging now...");
            mcBot.quit();
            mcBot.end();
            login();
          }
        }

        if(!online) {
          message.react("❌");
          return;
        }
        
        if(content.startsWith(config.prefix)) {
          message.react("✅");
          cmdBase({
            isDiscord: true,
            message: message,
            mcBot: mcBot,
            dcBot: dcBot,
            server: server
          }, content);
          return;
        }

        message.react("☑️");
        
        let text = `《${author.tag}》 ${content}`;

        if(text.length > server.maxChars) {
          text = text.substr(0, server.maxChars);
          message.react("💬");
          message.react("❗");
        }
        
        mcBot.chat(text);
        
      }  
    });
  }

  function sendChannels(msg, color) {
    if(lastMessage !== undefined) {
      if(lastMessage.msg === msg) {
        lastMessage.amount += 1;
        lastMessage.interactions.forEach(interaction => {
          interaction.edit({ embeds: [ {
            description: `${lastMessage.msg}\n**x${lastMessage.amount}**`,
            color: lastMessage.color
          } ] });
        });
        return;
      }
    }
    if(!color) color = "WHITE";

    lastMessage = {
      msg: msg,
      color: color,
      amount: 1,
      interactions: null
    }
    
    let interactions = [];
    server.channels.forEach(channel => {
      dcBot.guilds.cache.forEach(_guild => {
        _guild.channels.cache.forEach(async _channel => {
          if(_channel.id === channel) {
            let interaction = await _channel.send({ embeds: [ {
              description: util.removeDiscordFormating(msg),
              color: color
            } ] });
            interactions.push(interaction);
          }
        });
      });
    });
    lastMessage.interactions = interactions
  }
  
}

module.exports = {
  create: create
}

// chat regex: <([a-z]|[A-Z]|[0-9]|_)+> ([^]*)