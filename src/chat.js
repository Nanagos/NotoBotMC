//  files
const util = require("./util.js");
//  data
const lang = require("../data/mc/lang.json");

function convertJson(json) {
  //console.log(JSON.stringify(json, null, 2));
  let res;
  
  if(json.json) {
    res = readPartList(json.json, "", []);
  } else {
    return null;
  }
  
  let { message, colors } = res;

  message = removeColorCodes(message);
  //message = util.removeDiscordFormating(message);

  let color = getBestColor(colors);
  color = colorNameToHex(color);

  return {
    message,
    color
  }
}

function readPartList(list, message, colors) {
  if(!(list instanceof Array)) list = [list];
    
  list.forEach(part => {
    if(part.color) {
      colors.push(part.color);
    }

    if(part.text) {
      message += part.text;
    } else if(part.translate) {
      let translated = lang[part.translate];
      if(part.translate.match(/entity\.([^.]+)\.name/g)) {
        translated = lang[`entity.minecraft.${part.translate.split(".")[1].toLowerCase()}`];
      }
      if(!translated) return;
      
      if(part.with) {
        let counter = 1;
        part.with.forEach(wp => {
          let res = readPartList(wp, "", []);
          
          if(translated.includes("%s"))
            translated = translated.replace("%s", res.message);
          else if(translated.includes(`%${counter}$s`))
            translated = translated.replace(`%${counter}$s`, res.message);
          
          colors = colors.concat(res.colors);
          counter++;
        });
      }
      message += translated;
    }

    if(part.extra) {
      let res = readPartList(part.extra, message, colors);
      message = res.message;
      colors = res.colors;
      return;
    }
  });

  return {
    message,
    colors
  }
}

function removeColorCodes(text) {
  let new_text = "";

  for(let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    if(char === '§') {
      i++;
      continue;
    }
    new_text += char;
  }

  return new_text;
}



const colorList = [
  { name: "green", hex: "55FF55" },
  { name: "blue", hex: "5555FF" },
  { name: "red", hex: "FF5555" },
  { name: "yellow", hex: "FFFF55" },
  
  { name: "gold", hex: "FFAA00" },
  { name: "light_purple", hex: "FF55FF" },
  { name: "aqua", hex: "55FFFF" },

  { name: "gray", hex: "AAAAAA" },
  { name: "dark_green", hex: "00AA00" },
  { name: "dark_blue", hex: "0000AA" },
  { name: "dark_red", hex: "AA0000" },
  { name: "dark_purple", hex: "AA00AA" },
  { name: "dark_aqua", hex: "00AAAA" },
  
  { name: "dark_gray", hex: "555555" },
  { name: "white", hex: "FFFFFF" },
  { name: "black", hex: "000000" }
]

function colorNameToHex(name) {
  return colorList.find(c => c.name === name).hex;
}

function getBestColor(list) {
  if(list.length === 0) return "white";
  
  return list.sort((c1, c2) => {
    return colorList.indexOf(colorList.find(c => c.name === c1)) - colorList.indexOf(colorList.find(c => c.name === c2))
  })[0];
}


module.exports = {
  convertJson,
  colorNameToHex,
  getBestColor
}