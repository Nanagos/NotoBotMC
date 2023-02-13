module.exports = {
  names: ["discord", "dc"],
  expectedArgs: "",
  minArgs: 0,
  description: "Get the discord invite link",
  discord: true,
  callback: ({ reply, mcBot, isDiscord }, args, msg) => {

    reply("Discord Server: https://discord.gg/QqCjE9tPqQ | Contact: Nanagos#1872");
    
  }
}