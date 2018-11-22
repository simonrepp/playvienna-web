const credits = require('./components/credits.js');
const gist = require('./components/gist.js');
const impressions = require('./components/impressions.js');
const menu = require('./components/menu.js');
const opener = require('./components/opener.js');
const layout = require('./layout.js');

module.exports = context => {
  const html = `
  <div id="application">
    <div id="index">
      ${menu(context)}
      ${opener(context)}
      ${gist(context)}
      ${impressions(context)}
      ${credits(context)}
    </div>
  </div>
  `;

  return layout(context, html);
};
