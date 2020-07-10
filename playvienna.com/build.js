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

module.exports = async context => {
  const { buildDir, contentDir } = context;

  await fsExtra.emptyDir(buildDir);

  const data = await source(contentDir, buildDir);

  await fsExtra.copy(path.join(__dirname, 'static/'), path.join(buildDir, '/'));

  await renderBackgrounds(data);

  for(const locale of ['de', 'en']) {
    const localeContext = {
      baseUrl: 'http://playvienna.com',
      data: data[locale],
      imprintUrl: locale === 'de' ? '/kontakt/' : '/en/contact/',
      indexUrl: locale === 'de' ? '/' : '/en/',
      locale: locale
    };

    let context;

    // index

    context = Object.assign({}, localeContext, {
      section: 'index',
      translateUrl: locale === 'de' ? '/en/' : '/',
      url: locale === 'de' ? '/' : '/en/'
    });

    await fsExtra.ensureDir(path.join(buildDir, context.url));
    await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), index(context));

    // site not found

    context = Object.assign({}, localeContext, {
      section: 'site-not-found',
      translateUrl: locale === 'de' ? '/en/site-not-found/' : '/seite-nicht-gefunden/',
      url: locale === 'de' ? '/seite-nicht-gefunden/' : '/en/site-not-found/'
    });

    await fsExtra.ensureDir(path.join(buildDir, context.url));
    await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), siteNotFound(context));

    // search

    context = Object.assign({}, localeContext, {
      section: 'search',
      translateUrl: locale === 'de' ? '/en/search/' : '/suche/',
      url: locale === 'de' ? '/suche/' : '/en/search/'
    });

    await fsExtra.ensureDir(path.join(buildDir, context.url));
    await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), search(context));

    // playvienna

    context = Object.assign({}, localeContext, {
      section: 'playvienna',
      translateUrl: locale === 'de' ? '/en/playvienna/' : '/playvienna/',
      url: locale === 'de' ? '/playvienna/' : '/en/playvienna/'
    });

    await fsExtra.ensureDir(path.join(buildDir, context.url));
    await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), playvienna(context));

    for(const page of context.data.playvienna) {
      context = Object.assign({}, localeContext, {
        page: page,
        section: 'playvienna',
        translateUrl: page.translateUrl,
        url: page.url
      });

      await fsExtra.ensureDir(path.join(buildDir, context.url));
      await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), playviennaPage(context));
    }

    // games

    context = Object.assign({}, localeContext, {
      section: 'games',
      translateUrl: locale === 'de' ? '/en/games/' : '/spiele/',
      url: locale === 'de' ? '/spiele/' : '/en/games/'
    });

    await fsExtra.ensureDir(path.join(buildDir, context.url));
    await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), games(context));

    for(const game of context.data.games) {
      context = Object.assign({}, localeContext, {
        game: game,
        section: 'games',
        translateUrl: game.translateUrl,
        url: game.url
      });

      await fsExtra.ensureDir(path.join(buildDir, context.url));
      await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), gamePage(context));
    }

    // events

    context = Object.assign({}, localeContext, {
      section: 'events',
      translateUrl: locale === 'de' ? '/en/events/' : '/veranstaltungen/',
      url: locale === 'de' ? '/veranstaltungen/' : '/en/events/'
    });

    await fsExtra.ensureDir(path.join(buildDir, context.url));
    await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), events(context));

    for(const year of context.data.years) {
      context = Object.assign({}, localeContext, {
        section: 'events',
        translateUrl: year.translateUrl,
        url: year.url,
        year: year
      });

      await fsExtra.ensureDir(path.join(buildDir, context.url));
      await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), yearPage(context));

      for(const event of year.events) {
        context = Object.assign({}, localeContext, {
          event: event,
          section: 'events',
          translateUrl: event.translateUrl,
          url: event.url,
          year: year
        });

        await fsExtra.ensureDir(path.join(buildDir, context.url));
        await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), yearPage(context));
      }
    }

    // journey
    context = Object.assign({}, localeContext, {
      section: 'journey',
      translateUrl: locale === 'de' ? '/en/journey/' : '/journey/',
      url: locale === 'de' ? '/journey/' : '/en/journey/'
    });

    await fsExtra.ensureDir(path.join(buildDir, context.url));
    await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), journey(context));

    for(const edition of context.data.journey.editions) {
      context = Object.assign({}, localeContext, {
        edition: edition,
        section: 'journey',
        translateUrl: edition.translateUrl,
        url: edition.url
      });

      await fsExtra.ensureDir(path.join(buildDir, context.url));
      await fsExtra.writeFile(path.join(buildDir, context.url, 'index.html'), editionPage(context));
    }
  }

  await Promise.all(data.asyncProcessing);
};
