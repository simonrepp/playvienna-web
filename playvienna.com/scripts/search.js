const result = require('../templates/search/result.js');
const Search = require('../lib/search.js');
const translate = require('../lib/translate.js');

const linkSearchString = link => link.label ? `${link.url} – ${link.label}` : link.url;
const mediaSearchString = media => {
  if(media.type === 'image' || media.type === 'video') {
    return media.label ? `${media.file.name} – ${media.label}` : media.file.name;
  } else {
    return media.label ? `${media.url} – ${media.label}` : media.url;
  }
};

exports.handleSubmit = event => {
  const form = event.target;

  if('search' in form.dataset) {
    const query = form.query.value;
    const url = `${form.dataset.locale === 'de' ? '/suche/?begriff' : '/en/search/?query'}=${encodeURI(query)}`;

    event.preventDefault();
    Turbolinks.visit(url);

    return true;
  }

  return false;
};

exports.handleLoad = () => {
  if(!location.pathname.match(/^(\/suche\/|\/en\/search\/)/))
    return false;

  const contextJSON = document.querySelector('.search__context').innerText;
  const context = JSON.parse(contextJSON);

  const query = decodeURI(location.search.split(context.locale === 'de' ? '?begriff=' : '?query=').pop());

  for(const searchbox of document.querySelectorAll('.header__searchbox')) {
    searchbox.value = query;
  }

  for(const link of document.querySelectorAll('[data-translate-link]')) {
    link.href = context.locale === 'de' ? `/en/search/?query=${query}` : `/suche/?begriff=${query}`;
  }

  let notification = null;
  const results = [];

  if(query.length < 3) {
    notification = translate(context, 'Notification: Search length requirement');
  } else {
    const search = new Search(query, context.locale);

    if(search.dateQuery.validated) {
      notification = translate(context, 'Notification: Calendar search performed');
    } else if(search.dateQuery.suspected) {
      notification = translate(context, 'Notification: Calendar search instructions');
    }

    for(const page of context.data.playvienna) {
      search.matchText(page.title, translate(context, 'Title'));
      search.matchText(page.textStripped, translate(context, 'Text'));
      search.matchList(page.downloads, mediaSearchString, translate(context, 'Download'));
      search.matchList(page.links, linkSearchString, translate(context, 'Link'));
      search.matchList(page.media, mediaSearchString, translate(context, 'Media file'));

      if(search.matches.length > 0) {
        results.push({
          matches: search.flushMatches(),
          title: page.title,
          url: page.url
        });
      }
    }

    for(const game of context.data.games) {
      search.matchYear(game.year, translate(context, 'Year'));
      search.matchText(game.title, translate(context, 'Title'));
      search.matchText(game.textStripped, translate(context, 'Text'));
      search.matchText(game.credits, translate(context, 'Credits'));
      search.matchList(game.downloads, mediaSearchString, translate(context, 'Download'));
      search.matchList(game.links, linkSearchString, translate(context, 'Link'));
      search.matchList(game.media, mediaSearchString, translate(context, 'Media file'));

      if(search.matches.length > 0) {
        results.push({
          matches: search.flushMatches(),
          title: `${game.title} (${translate(context, 'Game')})`,
          url: game.url
        });
      }
    }

    for(const event of context.data.events) {
      if(event.end) {
        search.matchDateRange(event.date, event.end, translate(context, 'Date'));
      } else {
        search.matchDate(event.date, translate(context, 'Date'));
      }

      search.matchText(event.title, translate(context, 'Title'));
      search.matchText(event.textStripped, translate(context, 'Text'));
      search.matchText(event.city, translate(context, 'City'));
      search.matchText(event.country, translate(context, 'Country'));
      search.matchText(event.address, translate(context, 'Address'));
      search.matchText(event.venue, translate(context, 'Venue'));
      search.matchText(event.venueLink, translate(context, 'Venue Link'));

      if(event.types) {
        event.types.forEach(type =>
          search.matchText(translate(context, type), translate(context, 'Event type'))
        );
      }

      search.matchList(event.downloads, mediaSearchString, translate(context, 'Download'));
      search.matchList(event.links, linkSearchString, translate(context, 'Link'));
      search.matchList(event.media, mediaSearchString, translate(context, 'Media file'));

      if(search.matches.length > 0) {
        results.push({
          matches: search.flushMatches(),
          title: `${event.title} (${translate(context, 'Event in')} ${event.date.substr(0,4)})`,
          url: event.url
        });
      }
    }

    for(const edition of context.data.journey.editions) {
      search.matchDate(edition.date, translate(context, 'Date'));
      search.matchText(edition.title, translate(context, 'Title'));
      // search.matchText(edition.textStripped, translate(context, 'Text')); // TODO: Unlock when the content is presentable enough
      search.matchText(edition.time, translate(context, 'Start time'));
      search.matchList(edition.downloads, mediaSearchString, translate(context, 'Download'));
      search.matchList(edition.links, linkSearchString, translate(context, 'Link'));
      search.matchList(edition.media, mediaSearchString, translate(context, 'Media file'));

      for(const checkpoint of edition.route) {
        let locationLabel;
        if(checkpoint.special === 'start') {
          locationLabel = translate(context, 'Gathering point');
        } else if(checkpoint.special === 'finish') {
          locationLabel = translate(context, 'Finish');
        } else {
          locationLabel = translate(context, 'Checkpoint location');
        }

        search.matchText(checkpoint.location, locationLabel);
        // search.matchText(checkpoint.hint, translate(context, 'Checkpoint hint')); // TODO: Unlock when the content is presentable enough
      }

      if(search.matches.length > 0) {
        results.push({
          matches: search.flushMatches(),
          title: edition.title,
          url: edition.url
        });
      }
    }
  }

  const container = document.querySelector('div[data-search-container]');

  container.innerHTML = `
<div class="theme__a theme__h1 layout__xPadding layout__xRestraint">
<h1 class="theme__header">
  ${results.length} ${translate(context, 'Results for')} '${query}'
</h1>

${notification ? `
  <span class="search__notification">
    <span class="icon-notification"></span> ${notification}
  </span>
`:''}

${results.map(result).join('')}
</div>
  `;

  return true;
};
