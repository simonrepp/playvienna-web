const layout = require('./layout/layout.js');
const translate = require('../lib/translate.js');

module.exports = context => {
  const html = `
<div style="background-color: '#fff'; min-height: 100vh;">
  <h1>${translate(context, 'Error')}</h1>
  <p>
    ${translate(context, 'This page does not exist')}
  </p>
</div>
  `;

  return layout(context, html, { title: '404' });
};
