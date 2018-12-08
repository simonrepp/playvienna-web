const sourceEvents = require('./source/events.js');
const sourceGames = require('./source/games.js');
const sourceJourney = require('./source/journey.js');
const sourceMedia = require('./source/media.js');
const sourcePlayvienna = require('./source/playvienna.js');

module.exports = async (contentFolder, buildFolder) => {
  const data = {
    asyncProcessing: [],
    buildFolder,
    contentFolder,
    de: {},
    en: {}
  };

  if(!data.contentFolder)
    throw `Please run 'npm config set playvienna_web_content /your/absolute/path/to/content' in a terminal to configure where the playvienna.com content folder is located.`;

  await sourceMedia(data);

  await sourceEvents(data);
  await sourceGames(data);
  await sourceJourney(data);
  await sourcePlayvienna(data);

  return data;
};
