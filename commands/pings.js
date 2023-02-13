module.exports = {
  names: ["pings", "wp", "bp"],
  expectedArgs: "",
  minArgs: 0,
  description: "Get the player with the best and the worst ping on the server",
  discord: true,
  callback: ({ reply, mcBot, isDiscord }, args, msg) => {

    const playerList = mcBot.players;

    var players = [];
    for(const key in playerList) {
      const player = playerList[key];
      if(player.ping !== 0) {
        players.push(player);
      }
    }

    const sorted = players.sort((el1, el2) => {
      return el2.ping - el1.ping;
    });

    const bestPing = sorted[sorted.length - 1];
    const worstPing = sorted[0];

    reply(`Best Ping: ${bestPing.username} (${bestPing.ping}) | Worst Ping: ${worstPing.username} (${worstPing.ping})`);
    
  }
}