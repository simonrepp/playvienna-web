const sourceEvents = require('./source/events.js');
const sourceGames = require('./source/games.js');
const sourceJourney = require('./source/journey.js');
const sourceMedia = require('./source/media.js');
const sourcePlayvienna = require('./source/playvienna.js');

module.exports = async (contentDir, buildDir) => {
  const data = {
    asyncProcessing: [],
    buildDir,
    contentDir,
    de: {},
    en: {}
  };

  await sourceMedia(data);

  await sourceEvents(data);
  await sourceGames(data);
  await sourceJourney(data);
  await sourcePlayvienna(data);

  return data;
};
