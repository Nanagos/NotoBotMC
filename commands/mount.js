//  files
const util = require("../src/util.js");

module.exports = {
  names: ["mount"],
  expectedArgs: "",
  minArgs: 0,
  description: "The bot will mount the nearest vehicle in reach",
  discord: true,
  callback: ({ reply, mcBot, isDiscord }, args, msg) => {

    var mounted = mcBot.vehicle !== undefined;
    if(mounted) mounted = mcBot.vehicle.isValid;

    if(mounted) {
      reply("The bot is already in a vehicle. You can use the dismount command to dismount.");
      return;
    }

    const entities = Object.values(mcBot.entities);

    let vehicles = [];
    entities.forEach(entity => {
      if(
        util.distance(mcBot.entity, entity) < 5 &&
        entity.kind === "Vehicles"
      ) {
        vehicles.push(entity);
      }
    });

    vehicles = vehicles.sort((a, b) => {
      return util.distance(mcBot.entity, b) - util.distance(mcBot.entity, a);
    });

    if(vehicles.length === 0) {
      reply("There are no vehicles near by");
      return;
    }
    
    const vehicle = vehicles[0];
    console.log(vehicle);

    vehicle.isValid = true;
    reply(`Mounted to ${vehicle.mobType}!`);
    mcBot.mount(vehicle);
    
  }
}