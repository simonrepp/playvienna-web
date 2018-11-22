const downloads = require('../common/downloads.js');
const layout = require('../layout/layout.js');
const links = require('../common/links.js');
const media = require('../common/media.js');
const share = require('../common/share.js');

module.exports = (context, special) => {
  const html = `
<div class="layout__canvas">
  <div class="layout__xPadding layout__xRestraint">
    <h1 class="theme__header">
      ${special.title}
    </h1>

    ${media(context, context.special.media)}

    <div class="theme__markdown theme__text">
      ${special.text}
    </div>

    ${media(context, context.special.media, 'compact')}
    ${downloads(context, context.special.downloads)}
    ${links(context, context.special.links)}
    ${share(context)}
  </div>
</div>
  `;

  return layout(context, html, { slim: true, title: special.title });
};
