//  modules
const { Client, Intents } = require("discord.js");
//  files
const bot = require("./src/bot.js");
//  data
const servers = require("./data/servers.json");



//  Discord bot
const dcBot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});
dcBot.login(process.env["DiscordToken"]);

setTimeout(() => {
  let delay = 0;
  servers.forEach(server => {
    if(server.deactivated) return;
    setTimeout(() => {
      bot.create(server, dcBot);
    }, delay * 1000);
    delay += 10;
  });
}, 10 * 1000);

dcBot.once("ready", () => {
  dcBot.user.setActivity(`?help | http://notobot.tk`, { type: "PLAYING" });
});