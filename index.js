const fs = require("fs");
const csvParser = require("csv-parser");

const result = [];

const PLATFORM_NAMES = {
  gameBoy: "Game Boy",
  gameBoyAdvance: "Game Boy Advance",
  gameBoyColor: "Game Boy Color",
  gameCube: "GameCube",
  nintendo3ds: "Nintendo 3DS",
  nintendo64: 'Nintendo 64'
}

const NORMALIZED_PLATFORM_NAMES = {
  "Game Boy [NA]": PLATFORM_NAMES.gameBoy,
  "Game Boy Advance [JP]": PLATFORM_NAMES.gameBoyAdvance,
  "Game Boy Advance [NA]": PLATFORM_NAMES.gameBoyAdvance,
  "Game Boy Color [NA]": PLATFORM_NAMES.gameBoyColor,
  "GameCube [NA]": PLATFORM_NAMES.gameCube,
  "Nintendo 3DS [CN]": PLATFORM_NAMES.nintendo3ds,
  "Nintendo 3DS [NA]": PLATFORM_NAMES.nintendo3ds,
  'Nintendo 64 [NA]': PLATFORM_NAMES.nintendo64
}

function parseVGCollectData(data) {
  // Example
  // {
  //   'VGC id': '17276',
  //   Name: 'Baten Kaitos: Origins',
  //   Platform: 'GameCube [NA]',
  //   Notes: '',
  //   Cart: 'Yes',
  //   Box: 'Yes',
  //   Manual: 'Yes',
  //   Other: 'Yes',
  //   'Purchased Price': '0.00',
  //   'Purchased Date': '0000-00-00',
  //   Added: '2018-04-25 12:18:55',
  //   '': ''
  // },

  // data.
}

fs.createReadStream("./vgcollect-collection.csv")
  .pipe(csvParser())
  .on("data", (data) => {
    result.push(data);
  })
  .on("end", () => {
    // console.log(result);
    parseVGCollectData(result);
  });
  