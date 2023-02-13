module.exports = {
  names: ["players", "ppl"],
  expectedArgs: "",
  minArgs: 0,
  description: "Get a list of players",
  discord: true,
  callback: ({ reply, mcBot }, args, msg) => {
    
    var playerNames = [];
    for(key in mcBot.players) {
      playerNames.push(mcBot.players[key].username);
    }

    reply(`Players(${playerNames.length}): ${playerNames.join(", ")}`);
    
  }
}