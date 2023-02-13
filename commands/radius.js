module.exports = {
  names: ["radius"],
  expectedArgs: "",
  minArgs: 0,
  description: "Shows a list of all player in the bot's renderdistance",
  discord: true,
  callback: ({ reply, mcBot, isDiscord }, args, msg) => {

    const players = [];
    for(key in mcBot.entities) {
      let e = mcBot.entities[key];
      if(e.type !== "player") continue;
      players.push(`${e.username} (${Math.round(e.position.x)} ${Math.round(e.position.z)})`);
    }

    reply(`Players Nearby(${players.length}): ${players.join(", ")}`);
    
  }
}