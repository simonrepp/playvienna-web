const footer = require('./footer.js');
const header = require('./header.js');
const sidebar = require('./sidebar.js');
const translate = require('../../lib/translate.js');

const DEFAULT_TITLE = 'play:vienna';

module.exports = (context, content, options = {}) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${translate(context, 'Meta: Description')}" />

    <title>${options.title || DEFAULT_TITLE}</title>

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    <meta name="theme-color" content="#ffffff" />

    <meta property="og:title" content="${options.title || DEFAULT_TITLE}" />
    <meta property="og:url" content="${context.baseUrl}" />
    <meta property="og:description" content="${translate(context, 'Meta: Description')}" />
    <meta property="og:image" content="${context.baseUrl + '/images/social_graph_logo.png'}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta name="turbolinks-cache-control" content="no-preview">

    <link rel="stylesheet" href="/styles.css" />
    <script src="/scripts.js"></script>
  </head>

  <body>
    <div id="application">
      ${options.slim ? content : `
        ${sidebar(context)}

        <div class="layout__wrapper">
          ${header(context)}
          ${content}
          ${footer(context)}
        </div>
      `}
    </div>
  </body>
</html>
`;
