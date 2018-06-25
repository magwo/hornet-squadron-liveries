const fs = require("fs-extra");
const gm = require("gm").subClass({imageMagick: true});

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

function createPng(fileBaseName, done) {
    console.log(`Converting ${fileBaseName} to png, putting in temp folder`);
    gm(`${__dirname}/${squad.livery_source_dir}/${fileBaseName}${squad.livery_source_file_suffix}.psd`)
        .flatten()
        .write(`${__dirname}/temp/${fileBaseName}${squad.livery_source_file_suffix}.png`, done);
}

function errorHandler(err) {
    if(err) {
        console.error(err);
    }
}


function createMemberSkin(m) {
    console.log("Processing member", m.callsign);
    const memberTempDir = `temp/${m.callsign}`;
    fs.ensureDirSync(memberTempDir);
    const memberOutputDir = `output/${squad.livery_basedir} ${m.callsign}`
    fs.ensureDirSync(memberOutputDir);

    const pilotNameText = `${m.rank} ${m.first} ${m.last}\n"${m.callsign}"`.toUpperCase();

    console.log("  Adding text decals");
    gm(`${__dirname}/temp/F18C_1_DIFF${squad.livery_source_file_suffix}.png`)
        .draw([`font 'Arial Black.ttf' font-size 40 fill '#333333' gravity Center text -600,-800 '${pilotNameText}'`])
        .draw([`font 'Arial Black.ttf' font-size 40 fill '#333333' gravity Center rotate 180 text 600,400 '${pilotNameText}'`])
        .write(`${__dirname}/${memberOutputDir}/F18C_1_DIFF${squad.livery_source_file_suffix}.dds`, errorHandler);

    gm(`${__dirname}/temp/F18C_2_DIFF${squad.livery_source_file_suffix}.png`)
        .font("Arial Black.ttf", 60)
        .stroke("#333333")
        .fill("#333333")
        .drawText(0, 0, m.callsign.toUpperCase(), "center")
        .write(`${__dirname}/${memberOutputDir}/F18C_2_DIFF${squad.livery_source_file_suffix}.dds`, errorHandler);

    

    console.log("  Constructing and writing member description lua", m.callsign);
    const memberDesc = description.replace(/name = \"[^\"]*\"/, `name = "${squad.livery_basename} ${m.callsign}"`);
    fs.writeFileSync(`${memberOutputDir}/${squad.livery_source_description_lua}`, memberDesc, "utf8");
    

    console.log("  Export member pngs to DDS files (DXT5?) to member output dir");
    console.log("  Write modified description.lua to member output dir");
}


init();
createPng("F18C_1_DIFF", function(err) {
    if(err) {
        console.log(err);
        process.exit(1);
    }
    createPng("F18C_2_DIFF", function(err) {
        if(err) {
            console.log(err);
            process.exit(1);
        }
        console.log("Done writing pngs");
        if(!err) {
            squad.members.forEach(createMemberSkin);
        }
    });
});