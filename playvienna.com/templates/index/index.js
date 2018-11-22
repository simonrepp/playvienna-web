const layout = require('../layout/layout.js');
const upcoming = require('./upcoming.js');

module.exports = context => {
  const html = `
<div>
  ${upcoming(context)}
  <img class="background" src="${context.data.backgrounds.index.url}" />
</div>
  `;

  return layout(context, html, { title: 'play:vienna' });
};
