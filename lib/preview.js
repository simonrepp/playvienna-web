const shell = require('shell');

const buildJourneyviennaAt = require('../journeyvienna.at/build.js');
const buildPlayviennaCom = require('../playvienna.com/build.js');

module.exports = async (context, site) => {
  if(!context.contentDir || context.contentDir === '') {
    atom.notifications.addError(`Content location not configured, please check playvienna-web settings.`);
    return;
  }

  atom.notifications.addInfo(`Preparing ${site}`);

  try {
    if(site === 'journeyvienna.at') {
      await buildJourneyviennaAt(context);
    } else {
      await buildPlayviennaCom(context);
    }
  } catch(err) {
    atom.notifications.addError('Invalid data found, please solve the problem described below.', { detail: err.message, dismissable: true });
    return;
  }

  const notification = atom.notifications.addSuccess(
    `**${site}**\n\nThe preview was prepared successfully!`,
    {
      buttons: [{
        onDidClick: () => {
          shell.openExternal(context.server.url);
          notification.dismiss();
        },
        text: 'Open in browser'
      }],
      dismissable: true
    }
  );
};
