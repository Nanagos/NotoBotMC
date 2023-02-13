//  modules
const axios = require("axios");

module.exports = {
  names: ["wiki", "wikipedia"],
  expectedArgs: "<search term>",
  minArgs: 1,
  description: "Find a definition on Wikipedia",
  discord: true,
  callback: async ({ reply, mcBot, isDiscord }, args, msg) => {

    const term = args.join(" ").substr(0, 30);

    const data = (await axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&srlimit=20&srsearch=${term}`)).data.query.search;

    if(data.length === 0) {
      reply(`I couldn't find the term "${term}" in wikipedia`);
      return;
    }

    const snippet = data[0].snippet.replace(/(?:<[^>]*>?|&quot;)/gm, '');
    reply(`(${term}): ${snippet}`);
    
  }
}