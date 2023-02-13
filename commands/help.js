module.exports = {
  names: ["help", "commands"],
  expectedArgs: "(command name)",
  minArgs: 0,
  description: "Get a list of commands",
  discord: true,
  callback: ({ reply, mcBot, isDiscord }, args, msg) => {

    if(args.length === 0) {
      reply("Visit http://notobot.tk to get a list of commands");
    } else {
      
    }
    
  }
}