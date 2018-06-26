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
    return done();
    // console.log(`Converting ${fileBaseName} to png, putting in temp folder`);
    // gm(`${__dirname}/${squad.livery_source_dir}/${fileBaseName}${squad.livery_source_file_suffix}.psd`)
    //     .flatten()
    //     .write(`${__dirname}/temp/${fileBaseName}${squad.livery_source_file_suffix}.png`, done);
}

function errorHandler(err) {
    if(err) {
        console.error(err);
    }
}

function copyFiles(outputDir) {
    squad.files_to_copy.forEach(function(f) {
        fs.copyFileSync(`${squad.livery_source_dir}/${f}`, `${outputDir}/${f}`);
    })
}


function createMemberSkin(m) {
    console.log("Processing member", m.callsign);
    const memberTempDir = `temp/${m.callsign}`;
    fs.ensureDirSync(memberTempDir);
    const memberOutputDir = `output/${squad.livery_basedir} ${m.callsign}`
    fs.ensureDirSync(memberOutputDir);

    const pilotNameText = `${m.rank} ${m.first} ${m.last}\n"${m.callsign}"`.toUpperCase();

    console.log("  Adding text decals and exporting to DDS files");
    gm(`${__dirname}/temp/F18C_1_DIFF${squad.livery_source_file_suffix}.png`)
        .draw([`font 'ITC Franklin Gothic LT Medium Condensed.ttf' font-size 26 fill 'rgba(30,30,30,0.7)' translate ${730-2048},${1897-2048} gravity Center rotate 185 text 0,0 '${pilotNameText}'`])
        .draw([`font 'ITC Franklin Gothic LT Medium Condensed.ttf' font-size 26 fill 'rgba(30,30,30,0.7)' translate ${730-2048},${1053-2048} gravity Center rotate 355 text 0,0 '${pilotNameText}'`])
        .write(`${__dirname}/${memberOutputDir}/F18C_1_DIFF${squad.livery_source_file_suffix}.dds`, errorHandler);

    gm(`${__dirname}/temp/F18C_2_DIFF${squad.livery_source_file_suffix}.png`)
        .font("Arial Black.ttf", 60)
        .stroke("#444")
        .fill("#444")
        .drawText(0, 0, "", "center")
        .write(`${__dirname}/${memberOutputDir}/F18C_2_DIFF${squad.livery_source_file_suffix}.dds`, errorHandler);

    

    console.log("  Constructing and writing member description lua", m.callsign);
    const memberDesc = description.replace(/name = \"[^\"]*\"/, `name = "${squad.livery_basename} ${m.callsign}"`);
    fs.writeFileSync(`${memberOutputDir}/${squad.livery_source_description_lua}`, memberDesc, "utf8");

    copyFiles(memberOutputDir);
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