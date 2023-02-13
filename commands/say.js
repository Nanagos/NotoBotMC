module.exports = {
  names: ["say"],
  expectedArgs: "<message>",
  minArgs: 1,
  description: "Kill the bot",
  discord: true,
  callback: ({ reply, mcBot, isDiscord }, args, msg) => {

    let message = args.join(" ");

    while(message.startsWith("/")) {
      message = message.replace("/", "");
    }

    mcBot.chat(message);
    
  }
}