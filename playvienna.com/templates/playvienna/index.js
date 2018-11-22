const layout = require('../layout/layout.js');
const menu = require('../common/menu.js');
const translate = require('../../lib/translate.js');

module.exports = context => {
  const menuItems = context.data.playvienna.map(page => ({
    active: false,
    label: page.title,
    url: page.url
  }));

  const html = `
<div>
  ${menu(context, menuItems, 'adaptive', translate(context, 'Select a page'))}

  <img class="background" src="${context.data.backgrounds.playvienna.url}" />
</div>
  `;

  return layout(context, html, { title: translate(context, 'play:vienna') });
};
