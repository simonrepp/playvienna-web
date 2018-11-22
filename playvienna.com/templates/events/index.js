const layout = require('../layout/layout.js');
const menu = require('../common/menu.js');
const translate = require('../../lib/translate.js');

module.exports = context => {
  const menuItems = context.data.years.map(year => ({
    active: false,
    label: year.label,
    url: year.url
  }));

  const html = `
<div>
  ${menu(context, menuItems, 'adaptive', translate(context, 'Select a year'))}
  <img class="background" src="${context.data.backgrounds.events.url}" />
</div>
  `;

  return layout(context, html, { title: translate(context, 'Events') });
};
