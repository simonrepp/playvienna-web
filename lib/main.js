const atomPackageDeps = require('atom-package-deps');
const { CompositeDisposable } = require('atom');
const enolib = require('enolib');
const fsExtra = require('fs-extra');
const os = require('os');
const path = require('path');
const remote = require('remote');

const preview = require('./preview.js');
const serve = require('./serve.js');
const update = require('./update.js');

module.exports = {
  activate() {
    atomPackageDeps.install('playvienna-web');

    this.load(atom.config.get('playvienna-web.contentDir'));

    this.subscriptions = new CompositeDisposable();

    const commands = {
      'playvienna-web:configure': () => this.configure(),
      'playvienna-web:journeyvienna.at:preview': () => preview(this.context, 'journeyvienna.at'),
      'playvienna-web:journeyvienna.at:update': () => update(this.context, 'journeyvienna.at'),
      'playvienna-web:playvienna.com:preview': () => preview(this.context, 'playvienna.com'),
      'playvienna-web:playvienna.com:update': () => update(this.context, 'playvienna.com')
    };

    const commandsSubscription = atom.commands.add('atom-workspace', commands);

    this.subscriptions.add(commandsSubscription);

    serve(this.context);
  },
  config: {
    contentDir: {
      default: '',
      title: 'Content directory for playvienna-web',
      type: 'string'
    }
  },
  configure() {
    const files = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
      buttonLabel: 'Set as content directory',
      properties: ['openDirectory']
    });

    if(files && files.length) {
      const contentDir = files[0];

      atom.config.set('playvienna-web.contentDir', contentDir);
      this.load(contentDir);
    }
  },
  deactivate() {
    if(this.context.rsync) {
      this.context.rsync.process.kill();
    }

    if(this.context.server) {
      this.context.server.instance.close();
    }

    this.subscriptions.dispose();
  },
  context: {
    buildDir: path.join(os.tmpdir(), 'playvienna-web/build')
  },
  async load(contentDir) {
    const configPath = path.join(contentDir, 'deployment_settings.eno');

    if(await fsExtra.pathExists(configPath)) {
      const config = enolib.parse(await fsExtra.readFile(configPath, 'utf-8'));
      this.context.contentDir = contentDir;
      this.context.config = {};

      for(const site of config.sections()) {
        this.context.config[site.stringKey()] = {
          directory: site.field('directory').requiredStringValue(),
          host: site.field('host').requiredStringValue(),
          user: site.field('user').requiredStringValue()
        };
      }
    }
  },
  subscriptions: null
};
