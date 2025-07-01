const fs = require("fs");
const csvParser = require("csv-parser");

const result = [];

const PLATFORM_NAMES = {
  gameBoy: "Game Boy",
  gameBoyAdvance: "Game Boy Advance",
  gameBoyColor: "Game Boy Color",
  gameCube: "GameCube",
  nintendo3ds: "Nintendo 3DS",
  nintendo64: "Nintendo 64",
  nintendoDS: "Nintendo DS",
  nintendoSwitch: "Nintendo Switch",
  pc: "PC",
  playStation: "PlayStation",
  playStation2: "PlayStation 2",
  playStation3: "PlayStation 3",
  playstationPortable: "PSP",
  segaDreamcast: "Sega Dreamcast",
  superNintendo: "Super Nintendo",
  wii: "Wii",
  wiiU: "Wii U",
  xbox: "Xbox",
  xbox360: "Xbox 360",
  xboxOne: "Xbox One"
};

// TODO: Commented out non-NA platforms so they'll go to the unrecognized list
const NORMALIZED_PLATFORM_NAMES = {
  "Game Boy [NA]": PLATFORM_NAMES.gameBoy,
  // "Game Boy Advance [JP]": PLATFORM_NAMES.gameBoyAdvance,
  "Game Boy Advance [NA]": PLATFORM_NAMES.gameBoyAdvance,
  "Game Boy Color [NA]": PLATFORM_NAMES.gameBoyColor,
  "GameCube [NA]": PLATFORM_NAMES.gameCube,
  // "Nintendo 3DS [CN]": PLATFORM_NAMES.nintendo3ds,
  "Nintendo 3DS [NA]": PLATFORM_NAMES.nintendo3ds,
  "Nintendo 64 [NA]": PLATFORM_NAMES.nintendo64,
  // "Nintendo DS [JP]": PLATFORM_NAMES.nintendoDS,
  "Nintendo DS [NA]": PLATFORM_NAMES.nintendoDS,
  "Nintendo Switch [NA]": PLATFORM_NAMES.nintendoSwitch,
  "PC [NA]": PLATFORM_NAMES.pc,
  "PlayStation [NA]": PLATFORM_NAMES.playStation,
  "PlayStation 2 [NA]": PLATFORM_NAMES.playStation2,
  // "PlayStation 3 [JP]": PLATFORM_NAMES.playStation3,
  "PlayStation 3 [NA]": PLATFORM_NAMES.playStation3,
  "PlayStation Portable [NA]": PLATFORM_NAMES.playstationPortable,
  "Sega Dreamcast [NA]":PLATFORM_NAMES.segaDreamcast,
  "Super Nintendo [NA]":PLATFORM_NAMES.superNintendo,
  // "Wii [EU]":PLATFORM_NAMES.wii,
  "Wii [NA]":PLATFORM_NAMES.wii,
  "Wii U [NA]":PLATFORM_NAMES.wiiU,
  "Xbox [NA]":PLATFORM_NAMES.xbox,
  "Xbox 360 [NA]": PLATFORM_NAMES.xbox360,
  "Xbox One [NA]": PLATFORM_NAMES.xboxOne,
};

function buildPriceChartingString(game) {
  const hasCart = game.Cart === 'Yes';
  const hasBox = game.Box === 'Yes';
  const hasManual = game.Manual === 'Yes';
  const hasOther = game.Other === 'Yes';
  const isCIB = hasCart && hasBox && hasManual && hasOther;

  const isSealed = game.Notes && game.Notes.toLowerCase().includes('sealed');
  
  let status = '';
  if (isCIB) {
    status = 'CIB';
  } else if (isSealed) {
    status = "Sealed"
  }

  const platform = NORMALIZED_PLATFORM_NAMES[game.Platform] ?? 'UNKNOWN PLATFORM';

  let resultString = `${game.Name} ${platform}`

  if (status.length) {
    resultString = `${resultString} ${status}`;
  }

  return resultString;
}

function parseVGCollectData(vgCollectData) {
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
  
  const gamesByPlatform = {unknown: []};

  // Parse all data and make a map of platforms to games
  vgCollectData.forEach(parsedGame => {
    const platform = NORMALIZED_PLATFORM_NAMES[parsedGame.Platform];

    if (!platform) {
      gamesByPlatform.unknown.push(parsedGame);
    } else {
      if (!gamesByPlatform[platform]) {
        gamesByPlatform[platform] = [];
      }
      gamesByPlatform[platform].push(parsedGame)
    }
  });

  const {unknown: unknownResults, ...restOfPlatforms } = gamesByPlatform;

  const flatList = [];
  Object.keys(restOfPlatforms).forEach(platform => {
    const platformGames = restOfPlatforms[platform];

    platformGames.forEach((game) => {
      const parsedResult = buildPriceChartingString(game);
      flatList.push(parsedResult);
    })
  });

  console.log("Results:")
  console.log('===================================');
  console.log(' ');
  flatList.forEach((flatItem) => console.log(flatItem));
  console.log('===================================')
  console.log(' ');
  console.log('Results for unknown platforms:')
  console.log('===================================')
  console.log(' ');

  unknownResults.forEach(unknownPlatformGame => {
    const parsedResult = buildPriceChartingString(unknownPlatformGame);
    console.log(parsedResult);
  })

  return gamesByPlatform;
}

const rawParsedResult = [];

fs.createReadStream("./vgcollect-collection.csv")
  .pipe(csvParser())
  .on("data", (data) => {
    rawParsedResult.push(data);
  })
  .on("end", () => {
    const result = parseVGCollectData(rawParsedResult);
    let totalCount = 0;
    
    console.log('===================================')
    console.log(' ');
    console.log('Platform counts:')
    Object.keys(result).forEach((platformName) => {
      console.log(`${platformName}: ${result[platformName].length}`)
      totalCount = totalCount + result[platformName].length
    })
    console.log(`Total: ${totalCount}`)
  });
