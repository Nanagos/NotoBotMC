module.exports = {
  names: ["ping"],
  expectedArgs: "(username)",
  minArgs: 0,
  description: "Get a list of players",
  discord: true,
  callback: ({ reply, mcBot, isDiscord, username }, args, msg) => {
    
    let name;
    if(args.length < 1) {
      if(isDiscord) {
        name = mcBot.username;
      } else {
        name = username;
      }
    } else {
      name = args[0];
    }

    const players = mcBot.players;
    for(key in players) {
      const playername = key;
      const player = players[key];

      if(name.toLowerCase() === playername.toLowerCase()) {
        const ping = player.ping;

        if(ping === 0) {
          reply(`The server has not calculated the ping of ${playername} yet.`);
        }
        else {
          reply(`Ping of ${playername}: ${ping}`);
        }
      }  
    }
    
  }
}