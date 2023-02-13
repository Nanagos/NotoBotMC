//  modules
const axios = require("axios");

module.exports = {
  names: ["2b2tstatus", "2bstatus"],
  expectedArgs: "",
  minArgs: 0,
  description: "Get information about 2b2t",
  discord: true,
  callback: async ({ reply, mcBot, isDiscord }, args, msg) => {

    const status = (await axios.get("https://api.2b2t.dev/status")).data[0];
    const prioq = (await axios.get("https://api.2b2t.dev/prioq")).data;
    
    const all_players = (await axios.get(`https://api.mcsrvstat.us/2/2b2t.org`)).data.players.online;
    const players = parseInt(status[1]);

    reply(`2b2t Status | Tps: ${status[0]} | Players: ${players} | Queue Length: ${all_players - players - prioq[1]} | PrioQueue Length: ${prioq[1]} | PrioQueue Waiting Time: ${prioq[2] === null ? "none" : prioq[2]}`);
    
  }
}