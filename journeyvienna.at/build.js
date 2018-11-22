const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const elaboration = require('./templates/elaboration.js');
const index = require('./templates/index.js');
const siteNotFound = require('./templates/site-not-found.js');
const source = require('../common/source.js');

const build = async () => {
  console.time('journeyvienna.at/build');
  console.log(`
         _                                         _                                      __
        (_)___  __  ___________  ___  __  ___   __(_)__  ____  ____  ____ _        ____ _/ /_
       / / __ \\/ / / / ___/ __ \\/ _ \\/ / / / | / / / _ \\/ __ \\/ __ \\/ __ \`/       / __ \`/ __/
      / / /_/ / /_/ / /  / / / /  __/ /_/ /| |/ / /  __/ / / / / / / /_/ /  _    / /_/ / /_
   __/ /\\____/\\__,_/_/  /_/ /_/\\___/\\__, / |___/_/\\___/_/ /_/_/ /_/\\__,_/  (_)   \\__,_/\\__/
  /___/                            /____/
`);

  const data = await source();

  const publicDir = path.join(__dirname, '../public');

  await fsExtra.emptyDir(publicDir);
  await fsExtra.copy(path.join(__dirname, 'static/'), path.join(publicDir, '/'));

  for(let locale of ['de', 'en']) {

    // index

    const context = {
      latestJourney: data[locale].journey.latest,
      locale: locale,
      url: locale === 'de' ? '/de/' : '/',
      website: data[locale].journey.website
    };

    await fsExtra.ensureDir(path.join(publicDir, context.url));
    await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), index(context));

    // game

    context.url = locale === 'de' ? '/de/spiel/' : '/game/';

    await fsExtra.ensureDir(path.join(publicDir, context.url));
    await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), elaboration(context, 'Game'));

    // publicity

    context.url = locale === 'de' ? '/de/weitersagen/' : '/publicity/';

    await fsExtra.ensureDir(path.join(publicDir, context.url));
    await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), elaboration(context, 'Publicity'));

    // volunteer

    context.url = locale === 'de' ? '/de/freiwillige/' : '/volunteer/';

    await fsExtra.ensureDir(path.join(publicDir, context.url));
    await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), elaboration(context, 'Volunteer'));

    // site not found

    context.url = locale === 'de' ? '/de/seite-nicht-gefunden/' : '/site-not-found/';

    await fsExtra.ensureDir(path.join(publicDir, context.url));
    await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), siteNotFound(context));

  }

  console.timeEnd('journeyvienna.at/build');
};

build();
