const shell = require('shell');

const buildJourneyviennaAt = require('../journeyvienna.at/build.js');
const buildPlayviennaCom = require('../playvienna.com/build.js');
const sync = require('./sync.js');

const perform = async (context, site) => {
  atom.notifications.addInfo(`Deploying ${site} to the server`);

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

  await sync(context, site);

  const notification = atom.notifications.addSuccess(
    `**${site}**\n\nThe site was updated successfully!`,
    {
      buttons: [{
        onDidClick: () => {
          shell.openExternal(`http://${site}`);
          notification.dismiss();
        },
        text: 'Open in browser'
      }],
      dismissable: true
    }
  );
};

module.exports = async (context, site) => {
  if(!context.contentDir) {
    atom.notifications.addError(`Content directory not configured, please run 'Configure content directory' first.`);
    return;
  }

  atom.confirm({
    message: `You are about to deploy the publicly available, live version of ${site}`,
    detail: 'Do you want to continue?',
    buttons: ['Continue', 'Cancel']
  }, async response => {
    if(response === 0) {
      await perform(context, site);
    }
  });
};
