const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const editionPage = require('./templates/journey/edition.js');
const events = require('./templates/events/index.js');
const gamePage = require('./templates/games/game.js');
const games = require('./templates/games/index.js');
const index = require('./templates/index/index.js');
const journey = require('./templates/journey/index.js');
const playvienna = require('./templates/playvienna/index.js');
const playviennaPage = require('./templates/playvienna/page.js');
const renderBackgrounds = require('./backgrounds/render.js');
const search = require('./templates/search/index.js');
const siteNotFound = require('./templates/site-not-found.js');
const source = require('../common/source.js');
const yearPage = require('./templates/events/year.js');

const build = async () => {
  console.log(`
           __                  _
    ____  / /___ ___  ___   __(_)__  ____  ____  ____ _        _________  ____ ___
   / __ \\/ / __ \`/ / / / | / / / _ \\/ __ \\/ __ \\/ __ \`/       / ___/ __ \\/ __ \`__ \\
  / /_/ / / /_/ / /_/ /| |/ / /  __/ / / / / / / /_/ /  _    / /__/ /_/ / / / / / /
 / .___/_/\\__,_/\\__, / |___/_/\\___/_/ /_/_/ /_/\\__,_/  (_)   \\___/\\____/_/ /_/ /_/
/_/            /____/
`);

  console.time('playvienna.com/build');
  const publicDir = path.join(__dirname, '../public');
  await fsExtra.emptyDir(publicDir);

  const data = await source();

  await fsExtra.copy(path.join(__dirname, 'static/'), path.join(publicDir, '/'));

  await renderBackgrounds(data);

  for(let locale of ['de', 'en']) {
    const localeContext = {
      baseUrl: 'http://playvienna.com',
      data: data[locale],
      imprintUrl: locale === 'de' ? '/de/kontakt/' : '/contact/',
      indexUrl: locale === 'de' ? '/de/' : '/',
      locale: locale
    };

    let context;

    // index

    context = Object.assign({}, localeContext, {
      section: 'index',
      translateUrl: locale === 'de' ? '/' : '/de/',
      url: locale === 'de' ? '/de/' : '/'
    });

    await fsExtra.ensureDir(path.join(publicDir, context.url));
    await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), index(context));

    // site not found

    context = Object.assign({}, localeContext, {
      section: 'site-not-found',
      translateUrl: locale === 'de' ? '/site-not-found/' : '/de/seite-nicht-gefunden/',
      url: locale === 'de' ? '/de/seite-nicht-gefunden/' : '/site-not-found/'
    });

    await fsExtra.ensureDir(path.join(publicDir, context.url));
    await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), siteNotFound(context));

    // search

    context = Object.assign({}, localeContext, {
      section: 'search',
      translateUrl: locale === 'de' ? '/search/' : '/de/suche/',
      url: locale === 'de' ? '/de/suche/' : '/search/'
    });

    await fsExtra.ensureDir(path.join(publicDir, context.url));
    await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), search(context));

    // playvienna

    context = Object.assign({}, localeContext, {
      section: 'playvienna',
      translateUrl: locale === 'de' ? '/playvienna/' : '/de/playvienna/',
      url: locale === 'de' ? '/de/playvienna/' : '/playvienna/'
    });

    await fsExtra.ensureDir(path.join(publicDir, context.url));
    await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), playvienna(context));

    for(let page of context.data.playvienna) {
      context = Object.assign({}, localeContext, {
        page: page,
        section: 'playvienna',
        translateUrl: page.translateUrl,
        url: page.url
      });

      await fsExtra.ensureDir(path.join(publicDir, context.url));
      await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), playviennaPage(context));
    }

    // games

    context = Object.assign({}, localeContext, {
      section: 'games',
      translateUrl: locale === 'de' ? '/games/' : '/de/spiele/',
      url: locale === 'de' ? '/de/spiele/' : '/games/'
    });

    await fsExtra.ensureDir(path.join(publicDir, context.url));
    await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), games(context));

    for(let game of context.data.games) {
      context = Object.assign({}, localeContext, {
        game: game,
        section: 'games',
        translateUrl: game.translateUrl,
        url: game.url
      });

      await fsExtra.ensureDir(path.join(publicDir, context.url));
      await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), gamePage(context));
    }

    // events

    context = Object.assign({}, localeContext, {
      section: 'events',
      translateUrl: locale === 'de' ? '/events/' : '/de/veranstaltungen/',
      url: locale === 'de' ? '/de/veranstaltungen/' : '/events/'
    });

    await fsExtra.ensureDir(path.join(publicDir, context.url));
    await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), events(context));

    for(let year of context.data.years) {
      context = Object.assign({}, localeContext, {
        section: 'events',
        translateUrl: year.translateUrl,
        url: year.url,
        year: year
      });

      await fsExtra.ensureDir(path.join(publicDir, context.url));
      await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), yearPage(context));

      for(let event of year.events) {
        context = Object.assign({}, localeContext, {
          event: event,
          section: 'events',
          translateUrl: event.translateUrl,
          url: event.url,
          year: year
        });

        await fsExtra.ensureDir(path.join(publicDir, context.url));
        await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), yearPage(context));
      }
    }

    // journey
    context = Object.assign({}, localeContext, {
      section: 'journey',
      translateUrl: locale === 'de' ? '/journey/' : '/de/journey/',
      url: locale === 'de' ? '/de/journey/' : '/journey/'
    });

    await fsExtra.ensureDir(path.join(publicDir, context.url));
    await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), journey(context));

    for(let edition of context.data.journey.editions) {
      context = Object.assign({}, localeContext, {
        edition: edition,
        section: 'journey',
        translateUrl: edition.translateUrl,
        url: edition.url
      });

      await fsExtra.ensureDir(path.join(publicDir, context.url));
      await fs.promises.writeFile(path.join(publicDir, context.url, 'index.html'), editionPage(context));
    }
  }

  console.timeEnd('playvienna.com/build');
};

build();
