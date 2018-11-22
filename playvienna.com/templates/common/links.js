const translate = require('../../lib/translate.js');

module.exports = (context, links) => links.length > 0 ? `
<div class="theme__margin">
  <strong class="theme__strong">
    ${translate(context, 'Links')}
  </strong>

  <ul class="theme__list">
    ${links.map(link => `
      <li>
        <a class="theme__link" href="${link.url}" target="_blank">
          ${link.label || link.url}
        </a>
      </li>
    `).join('')}
  </ul>
</div>
` : '';
