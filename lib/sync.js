const path = require('path');
const { spawn } = require('child_process');

module.exports = (context, site) => new Promise((resolve, reject) => {
  const siteConfig = context.config[site];

  try {
    context.rsync = {};

    const rsync = spawn(
      'rsync',
      [
        '-avz',
        '--delete',
        path.join(context.buildDir, '/'),
        '-e', 'ssh -o StrictHostKeyChecking=no',
        `${siteConfig.user}@${siteConfig.host}:${siteConfig.directory}`
      ]
    );

    rsync.stdout.on('data', payload => {
      context.rsync.log = payload.toString();
    });

    rsync.stderr.on('data', payload => {
      context.rsync.log = payload.toString();
    });

    rsync.on('close', code => {
      context.rsync = null;

      if(code === 0) {
        resolve();
      } else {
        reject();
      }
    });

    context.rsync.process = rsync;
  } catch(err) {
    atom.notifications.addWarning(
      'Deployment via rsync failed.',
      { detail: err }
    );
  }
});
