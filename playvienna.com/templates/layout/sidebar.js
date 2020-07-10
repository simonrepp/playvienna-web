const translate = require('../../lib/translate.js');

// TODO: Deduplicate? (Almost identical construct in header.js)
const SECTION_URLS = {
  de: {
    'Events': '/veranstaltungen/',
    'Games': '/spiele/',
    'Home': '/',
    'Imprint': '/kontakt/',
    'Journey': '/journey/',
    'play:vienna': '/playvienna/'
  },
  en: {
    'Events': '/en/events/',
    'Games': '/en/games/',
    'Home': '/en/',
    'Imprint': '/en/contact/',
    'Journey': '/en/journey/',
    'play:vienna': '/en/playvienna/'
  }
};

const sidebarLink = (context, label) => `
  <div class="sidebar__row">
    <a class="sidebar__link" href="${SECTION_URLS[context.locale][label]}">
      ${translate(context, label)}
    </a>
  </div>
`;

module.exports = context => `
<nav class="sidebar__container">
  <div class="sidebar__row">
    <form class="sidebar__search"
          data-locale="${context.locale}"
          data-search>
      <span class="icon-search"></span>
      <input class="sidebar__searchbox"
             name="query"
             type="text"
             placeholder="${translate(context, 'Search')}" />
    </form>
  </div>

  ${sidebarLink(context, 'Home')}
  ${sidebarLink(context, 'play:vienna')}
  ${sidebarLink(context, 'Games')}
  ${sidebarLink(context, 'Events')}
  ${sidebarLink(context, 'Journey')}
  ${sidebarLink(context, 'Imprint')}

  <div class="sidebar__row">
    <a class="sidebar__link"
       data-retain-scroll
       data-translate-link
       href="${context.translateUrl}"
       onclick="window.keepSidebarOpen = true;">
       ${context.locale === 'de' ? 'English' : 'Deutsch'}
    </a>
  </div>
</nav>
`;
