module.exports = {
  names: ["health"],
  expectedArgs: "",
  minArgs: 0,
  description: "Find out about the bot's well being",
  discord: true,
  callback: ({ reply, mcBot, isDiscord }, args, msg) => {

    const health = Math.round(mcBot.health);
    const food = Math.round(mcBot.food);
    const saturation = Math.round(mcBot.foodSaturation);

    reply(`Health: ${health} | Food: ${food} | Saturation: ${saturation}`);
    
  }
}