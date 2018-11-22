const translate = require('../../lib/translate.js');

const externalLink = (context, url, icon, tooltip) => `
  <a class="footer__link" href="${url}" title="${translate(context, tooltip)}" target="_blank">
    <span class="icon-${icon}"></span>
  </a>
`;

module.exports = context => `
<footer class="footer__container">
  <div class="layout__xPadding layout__xRestraint">
    <div class="footer__alignment">
      ${externalLink(context, 'https://facebook.com/playvienna', 'facebook', 'Tooltip: Facebook')}
      ${externalLink(context, 'https://twitter.com/playvienna', 'twitter', 'Tooltip: Twitter')}
      ${externalLink(context, 'https://www.flickr.com/search/?q=playvienna', 'flickr', 'Tooltip: Flickr')}
      ${externalLink(context, 'https://www.instagram.com/playvienna', 'instagram', 'Tooltip: Instagram')}
      ${externalLink(context, 'http://playvienna.us5.list-manage.com/subscribe?u=8fc4d80010f46adf7a3197c8e&id=7562b58dee', 'newsletter', 'Tooltip: Newsletter')}

      <div class="footer__spacer"></div>

      <a class="footer__link" href="${context.imprintUrl}" title="${translate(context, 'Tooltip: Imprint')}">
        <span class="icon-imprint"></span>
        <span class="footer__optional">${translate(context, 'Imprint')}</span>
      </a>

      <a class="footer__link"
         data-retain-scroll
         data-translate-link
         href="${context.translateUrl}"
         title="${translate(context, 'Tooltip: Language')}">
        <span class="icon-locale"></span>
        <span class="footer__optional">${context.locale === 'de' ? 'English' : 'Deutsch'}</span>
      </a>
    </div>
  </div>
</footer>
`;
