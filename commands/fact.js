//  modules
const axios = require("axios");

module.exports = {
  names: ["fact"],
  expectedArgs: "",
  minArgs: 0,
  description: "Get a random funfact",
  discord: true,
  callback: async ({ reply, mcBot, isDiscord, server }, args, msg) => {

    const data = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
    const fact = data.data.text;

    const text = `Random fact: ${fact}`;
    reply(text.substr(0, server.maxChars));
    
  }
}