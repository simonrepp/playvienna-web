module.exports = (context, content, options = {}) => `
<!doctype html>
<html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Journey to the end of the night vienna">

    <title>Journey to the End of the Night Vienna</title>

    <meta property="og:title" content="Journey Vienna" />
    <meta property="og:url" content="http://journeyvienna.at" />
    <meta property="og:description" content="A streetgame of massive scale in vienna!" />
    <meta property="og:image" content="http://playvienna.com/images/social_graph_logo.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <link rel="stylesheet" href="/styles.css" />
    <script defer src="/scripts.js"></script>
    
    <script defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBxDq4ak_Zsxi8kAdCCJk1yNGASutuO-1w"></script>
  </head>

  <body>
    <div id="application">
      ${content}
    </div>
  </body>
</html>
`;
