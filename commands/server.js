//  modules
const axios = require("axios");

module.exports = {
  names: ["server"],
  expectedArgs: "<ip>",
  minArgs: 1,
  description: "Get information about a Minecraft server",
  discord: true,
  callback: async ({ reply, mcBot, isDiscord }, args, msg) => {

    const address = args[0];

    let {
      ip,
      port,
      online,
      motd,
      players
    } = (await axios.get(`https://api.mcsrvstat.us/2/${address}`)).data;

    reply(`(${address}) Online: ${online ? "yes" : "no"} | Ip: ${ip}:${port} | Players: ${players.online}/${players.max} | Motd: ${motd.clean.join(" ")}`);
    
  }
}