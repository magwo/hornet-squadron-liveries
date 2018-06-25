const fs = require("fs-extra");
const gm = require("gm");

var squad;
var description;

function init() {
    console.log("Creating output dir");
    fs.ensureDirSync("output");
    
    console.log("Creating temp dir");
    fs.ensureDirSync("temp");

    console.log("Reading squadron definition");
    squad = require("./squadron");
    console.log("Squadron is", squad);

    console.log("Reading description lua file");
    description = fs.readFileSync(squad.livery_source_description_lua, "utf8");
    console.log("Description is", description);
}

console.log("Read description.lua");

console.log("Convert base skin files to png or similar, put in temp folder");

console.log("For each member:");
console.log("  Create member dir in temp dir");
console.log("  Copy base pngs to member temp dir");
console.log("  Add text decals tp temp pngs");
console.log("  Export member pngs to DDS files (DXT5?) to member output dir");
console.log("  Write modified description.lua to member output dir");


init();

squad.members.forEach(function(m) {
    console.log("Processing member", m.callsign);
    fs.ensureDirSync(`temp/${m.callsign}`);
});
