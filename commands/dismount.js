module.exports = {
  names: ["dismount"],
  expectedArgs: "",
  minArgs: 0,
  description: "Dismount the bot from a vehicle",
  discord: true,
  callback: ({ reply, mcBot, isDiscord }, args, msg) => {

    var mounted = mcBot.vehicle !== undefined;
    if(mounted) mounted = mcBot.vehicle.isValid;

    if(!mounted) {
      reply("The bot is not mounted to an vehicle.");
      return;
    }

    mcBot.vehicle.isValid = false;
    reply(`Dismounted from ${mcBot.vehicle.mobType}!`);
    mcBot.dismount();
    
  }
}