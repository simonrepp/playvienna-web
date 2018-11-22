const downloads = require('../common/downloads.js');
const layout = require('../layout/layout.js');
const links = require('../common/links.js');
const media = require('../common/media.js');
const menu = require('../common/menu.js');
const share = require('../common/share.js');
const translate = require('../../lib/translate.js');

module.exports = context => {
  const menuItems = context.data.playvienna.map(page => ({
    active: page === context.page,
    label: page.title,
    url: page.url
  }));

  const html = `
<div>
  ${menu(context, menuItems, 'adaptive', translate(context, 'Select a page'))}
  <div class="layout__canvas" data-scroll="canvas">
    <div class="layout__marginY">
      <div class="layout__xPadding layout__xRestraint">
        ${media(context, context.page.media)}

        <div class="theme__markdown theme__text">
          ${context.page.text}
        </div>

        ${media(context, context.page.media, 'compact')}
        ${downloads(context, context.page.downloads)}
        ${links(context, context.page.links)}
        ${share(context)}
      </div>
    </div>
  </div>
</div>
  `;

  return layout(context, html, { title: context.page.title });
};
