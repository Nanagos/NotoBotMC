//  modules
const axios = require("axios");

module.exports = {
  names: ["urban", "ud"],
  expectedArgs: "<term>",
  minArgs: 1,
  description: "Search a query in the urban dictionary",
  discord: true,
  callback: async ({ reply, mcBot, isDiscord, server }, args, msg) => {

    const t = args.join(" ");
    const term = encodeURIComponent(t);

    const list = (await axios.get(`https://api.urbandictionary.com/v0/define?term=${term}`)).data.list;

    if(list.length === 0) {
      return;
    }

    const element = list.sort((el1, el2) => {
      return (el2.thumbs_up - el2.thumbs_down) - (el1.thumbs_up - el1.thumbs_down);
    })[0];

    let { definition } = element;

    reply(`(${t}): ${definition}`);
    
  }
}