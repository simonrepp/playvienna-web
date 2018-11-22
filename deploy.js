const eno = require('enojs');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const deploy = async () => {
  const DEPLOY_TARGET = process.argv[2];
  const CONTENT_FOLDER = process.env.npm_config_playvienna_web_content;

  if(!DEPLOY_TARGET) {
    console.log(`Please supply a deploy target (playvienna.com or journeyvienna.at).`);
    process.exit(-1);
  }

  if(!CONTENT_FOLDER) {
    console.log(`Please run 'npm config set playvienna_web_content /your/absolute/path/to/content' in a terminal to configure where the playvienna.com content folder is located.`);
    process.exit(-1);
  } else {
    console.log(`Deploying the playvienna.com website from folder ${CONTENT_FOLDER}.`);
  }

  const settingsFile = await fs.promises.readFile(path.join(CONTENT_FOLDER, 'deployment_settings.eno'), 'utf-8');
  const settings = eno.parse(settingsFile, { locale: 'de' }).section(DEPLOY_TARGET);

  const rsync = spawn(
    'rsync',
    [
      '-avz',
      '--delete',
      'public/',
      `${settings.string('user', { required: true })}@${settings.string('host', { required: true })}:${settings.string('directory', { required: true })}`
    ]
  );

  rsync.stdout.on('data', data => { console.log(data.toString()) });
  rsync.stderr.on('data', data => { console.log(data.toString()) });
  rsync.on('close', (code, signal) => { if(code === 0) { /* success */ } });
};

deploy();
