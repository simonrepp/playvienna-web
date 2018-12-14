const express = require('express');
const http = require('http');

module.exports = context => {
  const app = express();
  const server = http.createServer(app).listen();

  app.set('port', server.address().port);
  app.use(express.static(context.buildDir));

  // TODO: Integrate for fast previews at some point
  // app.use('/__content/', express.static(context.contentDir));

  context.server = {
    instance: server,
    url: `http://localhost:${server.address().port}`
  };
};
