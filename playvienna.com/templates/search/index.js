const layout = require('../layout/layout.js');
const translate = require('../../lib/translate.js');

module.exports = context => {
  const html = `
<div class="layout__canvas" data-scroll="canvas">
  <div class="layout__marginReducedY" data-search-container></div>
</div>

<script class="search__context" type="application/json">
  ${JSON.stringify({
    baseUrl: context.baseUrl,
    data: {
      events: context.data.events.map(event => ({
        address: event.address,
        city: event.city,
        country: event.country,
        date: event.date,
        downloads: event.downloads,
        end: event.end,
        links: event.links,
        media: event.media,
        textStripped: event.textStripped,
        title: event.title,
        types: event.types,
        venue: event.venue,
        venueLink: event.venueLink,
        url: event.url
      })),
      games: context.data.games.map(game => ({
        credits: game.credits,
        downloads: game.downloads,
        links: game.links,
        media: game.media,
        textStripped: game.textStripped,
        title: game.title,
        year: game.year,
        url: game.url
      })),
      journey: {
        editions: context.data.journey.editions.map(edition => ({
          date: edition.date,
          downloads: edition.downloads,
          links: edition.links,
          media: edition.media,
          route: edition.route.map(checkpoint => ({
            location: checkpoint.location,
            special: checkpoint.special
          })),
          // textStripped: edition.textStripped, // TODO: Unlock when content is presentable enough
          time: edition.time,
          title: edition.title,
          url: edition.url
        }))
      },
      playvienna: context.data.playvienna.map(page => ({
        downloads: page.downloads,
        links: page.links,
        media: page.media,
        textStripped: page.textStripped,
        title: page.title,
        url: page.url
      }))
    },
    locale: context.locale
  })}
</script>
  `;

  return layout(context, html, { title: translate(context, 'Search') });
};
