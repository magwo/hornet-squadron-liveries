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

console.log("Convert base skin files to png or similar, put in temp folder");

function createBaseSkin() {

}


function createMemberSkin(m) {
    console.log("Processing member", m.callsign);
    const memberTempDir = `temp/${m.callsign}`;
    fs.ensureDirSync(memberTempDir);

    console.log("  Copy base pngs to member temp dir");

    console.log("  Add text decals tp temp pngs");

    const memberOutputDir = `output/${squad.livery_basedir} ${m.callsign}`
    fs.ensureDirSync(memberOutputDir);

    console.log("  Constructing and writing member description lua", m.callsign);
    const memberDesc = description.replace(/name = \"[^\"]*\"/, `name = "${squad.livery_basename} ${m.callsign}"`);
    fs.writeFileSync(`${memberOutputDir}/${squad.livery_source_description_lua}`, memberDesc, "utf8");
    

    console.log("  Export member pngs to DDS files (DXT5?) to member output dir");
    console.log("  Write modified description.lua to member output dir");
}


init();
createBaseSkin();
squad.members.forEach(createMemberSkin);