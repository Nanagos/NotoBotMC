const plugins = {
  conversions: false,
  furnace: false,
  math: false,
  painting: false,
  scoreboard: false,
  villager: false,
  bed: false,
  book: false,
  boss_bar: false,
  chest: false,
  command_block: false,
  craft: false,
  digging: false,
  dispenser: false,
  enchantment_table: false,
  experience: false,
  rain: false,
  ray_trace: false,
  sound: false,
  tablist: true,
  time: false,
  title: false,
  physics: true,
  blocks: true
}

function removeDiscordFormating(text) {
  let new_text = "";
  const chars = "*_|>";
  for(let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    new_text += `${chars.includes(char) ? "\\" : ""}${char}`;
  }
  return new_text;
}

function removeIllegalSigns(text) {
  let new_text = "";
  const legal = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?.:,;<>|*+~#/()[]{}-_%&/="
  for(let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    if(legal.includes(char)) new_text += char;
  }
  return new_text;
}

function hasContent(text) {
  if((typeof text) !== "string") return false;
  if(text === "") return false;
  for(let i = 0; i < text.length; i++) {
    if(text.charAt(i) !== ' ') return true;
  }
  return false;
}

function reply(params, message) {
  if(params.isDiscord) {
    let chat = removeDiscordFormating(message.substr(0, 512));

    try {
      params.message.reply({ embeds: [ {
        description: chat,
        color: "AQUA"
      } ] });
    } catch(error) {}
  } else {
    let chat = `> ${message}`;
    chat = chat.substr(0, params.server.maxChars);
    params.mcBot.chat(chat);
  }
}

function distance(e1, e2) {
  return Math.sqrt(Math.pow(e1.position.x - e2.position.x, 2) + Math.pow(e1.position.y - e2.position.y, 2) + Math.pow(e1.position.z - e2.position.z, 2));
}

module.exports = {
  plugins,
  removeDiscordFormating,
  removeIllegalSigns,
  hasContent,
  reply,
  distance
}