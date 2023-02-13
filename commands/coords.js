module.exports = {
  names: ["coords", "location"],
  expectedArgs: "",
  minArgs: 0,
  description: "Get the bot's coordinates",
  discord: true,
  callback: ({ reply, mcBot }, args, msg) => {
    let {x, y, z} = mcBot.entity.position;
    
    x = Math.round(x);
    y = Math.round(y);
    z = Math.round(z);

    reply(`Bot Coords: [ X: ${x} | Y: ${y} | Z: ${z} ] | Dimension: ${mcBot.game.dimension}`);
    
  }
}