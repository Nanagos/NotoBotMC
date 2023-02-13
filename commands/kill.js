module.exports = {
  names: ["kill", "die"],
  expectedArgs: "",
  minArgs: 0,
  description: "Kill the bot",
  discord: true,
  callback: ({ reply, mcBot, isDiscord }, args, msg) => {

    reply("Trying to execute /kill...");
    mcBot.chat("/kill");
    
  }
}