const downloads = require('../common/downloads.js');
const layout = require('../layout/layout.js');
const links = require('../common/links.js');
const media = require('../common/media.js');
const menu = require('../common/menu.js');
const share = require('../common/share.js');
const translate = require('../../lib/translate.js');

module.exports = context => {
  const menuItems = context.data.games.map(game => ({
    active: game === context.game,
    label: `${game.title} (${game.year})`,
    url: game.url
  }));

  const html = `
<div>
  ${menu(context, menuItems, 'select', translate(context, 'Select a game'))}

  <div class="layout__canvas" data-scroll="canvas">
    <div class="layout__marginY">
      <div class="layout__xPadding layout__xRestraint">
        ${media(context, context.game.media)}

        <strong class="theme__header">
          ${context.game.title}
        </strong>

        <div>
          ${context.game.credits}, ${context.game.year}
        </div>

        <div class="theme__markdown theme__text">
          ${context.game.text}
        </div>

        ${media(context, context.game.media, 'compact')}
        ${downloads(context, context.game.downloads)}
        ${links(context, context.game.links)}
        ${share(context)}
      </div>
    </div>
  </div>
</div>
  `;

  return layout(context, html, { title: context.game.title });
};
