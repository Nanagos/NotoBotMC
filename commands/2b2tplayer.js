//  modules
const axios = require("axios");

module.exports = {
  names: ["2b2tplayer", "2bplayer"],
  expectedArgs: "<player name>",
  minArgs: 1,
  description: "Get information about a 2b2t player",
  discord: true,
  callback: async ({ reply, mcBot, isDiscord }, args, msg) => {

    const player = args[0].substr(0, 16);

    const players = (await axios.get("https://api.2b2t.dev/status")).data[1][0];

    let seenRes = await axios.get(`https://api.2b2t.dev/seen?username=${player}`);
    let statsRes = await axios.get(`https://api.2b2t.dev/stats?username=${player}`);

    const waiting = (await axios.get("https://2bqueue.info/players")).data.queue.players.includes(player);

    if(seenRes.data.length == 0) {
      if(waiting) {
        reply(`The player ${name} has never played on 2b2t before, but is waiting in queue.`);
        return;
      }

      reply(`The player **${player}** has never played on 2b2t before or doesn't exist.`);
      return;
    }
    
    const seen = seenRes.data[0];
    const stats = statsRes.data[0];

    let online = false;
    for(key in players) {
      if(key.toLowerCase() === player.toLowerCase()) online = true;
    }

    const onlineMsg = online ? "online" : (waiting ? "waiting in queue" : "offline");
    const kd = (stats.kills / stats.deaths).toFixed(2);
    const joins = stats.joins < stats.leaves ? (online ? stats.leaves + 1 : stats.leaves) : (online ? stats.joins : stats.joins - 1);
      
    reply(`(${player}) Online: ${onlineMsg} | Kills: ${stats.kills} | Deaths: ${stats.deaths} | K/D: ${kd} | Joins: ${joins} | Last Seen: ${seen.seen}`);
    
  }
}