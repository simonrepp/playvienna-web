const translate = require('../../lib/translate.js');

const SECTION_URLS = {
  de: {
    'Events': '/veranstaltungen/',
    'Games': '/spiele/',
    'Journey': '/journey/',
    'play:vienna': '/playvienna/'
  },
  en: {
    'Events': '/en/events/',
    'Games': '/en/games/',
    'Journey': '/en/journey/',
    'play:vienna': '/en/playvienna/'
  }
};

const logo = context => `
<a class="header__link" href="${context.indexUrl}">
  <img class="header__logo"
       src="${context.section === 'index' ? '/images/logo_secondary.svg' : '/images/logo.svg'}" />
</a>
`;

const sectionLink = (context, active, label) => `
<a class="header__navItem header__link ${active ? 'header__navItemActive' : ''}"
   href="${SECTION_URLS[context.locale][label]}">
  ${translate(context, label)}
</a>
`;

const searchBox = context => `
<form class="header__navItem header__search ${context.section === 'search' ? 'header__searchActive' : ''}"
      data-locale="${context.locale}"
      data-search>
  <span class="icon-search header__searchIcon"></span>
  <input class="header__searchbox"
         name="query"
         type="text"
         placeholder="${translate(context, 'Search')}" />
</form>
`;

const headerCompact = context => {
  const { locale, url } = context;
  let activeItem;

  if(context.section === 'playvienna') {
    activeItem = sectionLink(context, true, 'play:vienna')
  } else if(context.section === 'games') {
    activeItem = sectionLink(context, true, 'Games')
  } else if(context.section === 'events') {
    activeItem = sectionLink(context, true, 'Events')
  } else if(context.section === 'journey') {
    activeItem = sectionLink(context, true, 'Journey')
  } else if(context.section === 'search') {
    activeItem = searchBox(context);
  } else if(context.section === 'index') {
    activeItem = logo(context);
  }

  return(`
    <div class="header__compact">
      <a class="header__link header__sidebar_toggle">
        <span class="icon-menu header__menuicon"></span>
      </a>

      ${activeItem}
    </div>
  `);
};

const headerWide = context => `
<div class="header__wide">
  ${logo(context)}

  <nav>
    ${sectionLink(context, context.section === 'playvienna', 'play:vienna')}
    ${sectionLink(context, context.section === 'games', 'Games')}
    ${sectionLink(context, context.section === 'events', 'Events')}
    ${sectionLink(context, context.section === 'journey', 'Journey')}

    ${searchBox(context)}
  </nav>
</div>
`;

module.exports = context => `
<header class="header__container">
  <div class="layout__xPadding layout__xRestraint">
    ${headerCompact(context)}
    ${headerWide(context)}
  </div>
</header>
`;
