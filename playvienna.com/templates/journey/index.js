const moment = require('moment');

const layout = require('../layout/layout.js');
const menu = require('../common/menu.js');
const translate = require('../../lib/translate.js');

module.exports = context => {
  const menuItems = context.data.journey.editions.map(edition => ({
    active: false,
    label: `${edition.abstract} ${moment(edition.date).locale(context.locale).format('MMMM YYYY')}`,
    url: edition.url
  }));

  const html = `
<div>
  ${menu(context, menuItems, 'select', translate(context, 'Select a journey'))}
  <img class="background" src="${context.data.backgrounds.journey.url}" />
</div>
  `;

  return layout(context, html, { title: translate(context, 'Journey') });
};
