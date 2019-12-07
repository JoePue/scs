'use strict';
'use esversion: 6';

const fs = require('fs');
const util = require('util');

function log($msg) {
  console.log($msg);
}
function exit(code) {
  process.exit(code);
}

const unitMap = new Map();
unitMap.set("BanditRecruit", "Rek");
unitMap.set("BanditBowman", "BS");
unitMap.set("BanditMilitia", "Mil");
unitMap.set("BanditLongbowman", "Lb");
unitMap.set("EnemyEliteSoldier", "ES");
unitMap.set("EnemyCrossbowman", "Ab");
unitMap.set("EnemyCannoneer", "Kan");
unitMap.set("BanditBoss1", null);
unitMap.set("BanditSoldier", "Sol");
unitMap.set("BanditCavalry", "Cav");
unitMap.set("BanditBoss2", null);

function mapUnitId(name) {
  var value = unitMap.get(name);
  if (value != null) {
    return value;
  }
  return name;
}

// function validateArguments() {;
//   // for (let j = 0; j < process.argv.length; j++) {
//   //   console.log(j + ' -> ' + (process.argv[j]));
//   // }
//   if (process.argv.length != 3) {
//     log("Missing Argument: json file");
//     exit(-1);
//   }
// }

function readFile(filename) {
  return fs.readFileSync(filename, 'utf-8');
}

function readJsonFile(filename) {
  return JSON.parse(fs.readFileSync(filename));
}

function createFilenameByAdvId(advId) {
  return "downloads/" + advId + ".json";
}

function extractUnitsIds(filename) {
  let json = readJsonFile(filename);
  let unitIds = [];
  json.data[0].camps.forEach(camp => {
    camp.units.forEach(unit => unitIds.push(unit.id))
  });
  let unique = [...new Set(unitIds)];
  unitIds.sort();
  return unique;
}

function listUnitsIds(filename) {
  let unitIds = extractUnitsIds(filename);
  unitIds.forEach(id => {
    log(id)
  });
}

function listCamps(filename) {
  let json = readJsonFile(filename);
  json.data[0].camps.forEach(camp => {
    let campUnitString = camp.name + " ";
    if (camp.name.length < 2)
      campUnitString = " " + campUnitString;
    camp.units.forEach(unit => {
      campUnitString = campUnitString + " " + unit.count + "" + mapUnitId(unit.id)
    })
    log(campUnitString)
  });
}

function listAllCamps(filename) {
  let content = readFile(filename);
  let lines = content.split("\n")
  lines.forEach(line => {
    if (line) {
      log("\n*** " + line + " ***");
      listCamps(createFilenameByAdvId(line));
    }
  })
}

log("Programm start");
const argumentOne = process.argv[2];
if (argumentOne == "unit") {
  if (process.argv.length < 4) {
    log("Missing argument: ")
    exit(-1)
  }
  const argumentTwo = process.argv[3];
  const jsonFile = process.argv[4];
  if (argumentTwo == "list-ids") {
    listUnitsIds(jsonFile)
  } else {
    log("Unknown argument: " + argumentTwo)
  }
} else if (argumentOne == "camp") {
  const argumentTwo = process.argv[3];
  const jsonFile = process.argv[4];
  if (argumentTwo == "list") {
    listCamps(jsonFile)
  } else if (argumentTwo == "listall") {
    listAllCamps(jsonFile)
  } else {
    log("Unknown argument: " + argumentTwo)
  }
} else {
  log("Unknown argument: " + argumentOne)
}
