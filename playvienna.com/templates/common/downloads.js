const translate = require('../../lib/translate.js');

module.exports = (context, downloads) => downloads.length > 0 ? `
<div class="theme__margin">
  <strong class="theme__strong">
    ${translate(context, 'Downloads')}
  </strong>

  <ul class="theme__list">
    ${downloads.map(download => `
      <li>
        <a class="theme__link" href="${download.file.url}" download>
           ${download.label || download.file.name} (${download.file.size})
        </a>
      </li>
    `).join('')}
  </ul>
</div>
` : '';
