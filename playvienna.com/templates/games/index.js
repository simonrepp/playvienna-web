const layout = require('../layout/layout.js');
const menu = require('../common/menu.js');
const translate = require('../../lib/translate.js');

module.exports = context => {
  const menuItems = context.data.games.map(game => ({
    active: false,
    label: `${game.title} (${game.year})`,
    url: game.url
  }));

  const html = `
<div>
  ${menu(context, menuItems, 'select', translate(context, 'Select a game'))}

  <img class="background" src="${context.data.backgrounds.games.url}" />
</div>
  `;

  return layout(context, html, { title: translate(context, 'Games') });
};
