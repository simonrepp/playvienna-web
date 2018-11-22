module.exports = context => `
<header>
  <div id="menu">
    <span>Journey Vienna ${context.latestJourney.date.getFullYear()}</span>

    <span>/</span>

    <a href="${context.locale === 'de' ? '/' : '/de/'}">
      ${context.locale === 'en' ? 'Deutsch' : 'English'}
    </a>
  </div>
</header>
`;
