const fsExtra = require('fs-extra');
const path = require('path');

const elaboration = require('./templates/elaboration.js');
const index = require('./templates/index.js');
const siteNotFound = require('./templates/site-not-found.js');
const source = require('../common/source.js');

module.exports = async context => {
  const { buildDir, contentDir } = context;

  await fsExtra.emptyDir(buildDir);

  // TODO: Source/process (!) only journey relevant data - same applies vice versa for playvienna
  const data = await source(contentDir, buildDir);

  await fsExtra.copy(path.join(__dirname, 'static/'), path.join(buildDir, '/'));

  for(let locale of ['de', 'en']) {

    // index

    const context = {
      latestJourney: data[locale].journey.latest,
      locale: locale,
      url: locale === 'de' ? '/de/' : '/',
      website: data[locale].journey.website
    };

    await fsExtra.ensureDir(path.join(buildDir, context.url));
    await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), index(context));

    // game

    context.url = locale === 'de' ? '/de/spiel/' : '/game/';

    await fsExtra.ensureDir(path.join(buildDir, context.url));
    await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), elaboration(context, 'Game'));

    // publicity

    context.url = locale === 'de' ? '/de/weitersagen/' : '/publicity/';

    await fsExtra.ensureDir(path.join(buildDir, context.url));
    await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), elaboration(context, 'Publicity'));

    // volunteer

    context.url = locale === 'de' ? '/de/freiwillige/' : '/volunteer/';

    await fsExtra.ensureDir(path.join(buildDir, context.url));
    await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), elaboration(context, 'Volunteer'));

    // site not found

    context.url = locale === 'de' ? '/de/seite-nicht-gefunden/' : '/site-not-found/';

    await fsExtra.ensureDir(path.join(buildDir, context.url));
    await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), siteNotFound(context));

  }

  await Promise.all(data.asyncProcessing);
};
