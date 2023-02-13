//  modules
const axios = require("axios");

module.exports = {
  names: ["namemc"],
  expectedArgs: "<player name>",
  minArgs: 1,
  description: "Search a player on namemc.",
  discord: true,
  callback: async ({ reply, mcBot, isDiscord }, args, msg) => {
    const name = args[0].substr(0, 16);

    const uuid = (await axios.get(`https://api.mojang.com/users/profiles/minecraft/${name}`)).data.id;

    if(uuid === undefined) {
      reply(`The player "${name}" could not be found. Only premium accounts can be requested.`);
      return;
    }

    const friends = (await axios.get(`https://api.namemc.com/profile/${uuid}/friends`)).data;

    const history = (await axios.get(`https://api.mojang.com/user/profiles/${uuid}/names`)).data;
    const historyList = [];
    history.map(e => {
      historyList.push(e.name);
    });

    reply(`(${name}) UUID: ${uuid} | Name Changes: ${historyList.length - 1} | NameMc Friends: ${friends.length} | Page: https://namemc.com/search?q=${name.toLowerCase()}`);
    //  length: 82 + 16 + 36 + 5 + 5 + 16 = 160
    
  }
}