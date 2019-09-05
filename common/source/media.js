const fastGlob = require('fast-glob');
const fsExtra = require('fs-extra');
const path = require('path');

const KB = 1024;
const MB = KB * KB;

module.exports = async data => {
  data.media = {};

  const directory = path.join(data.contentDir, 'media/**/*');
  const files = await fastGlob(directory);

  for(const file of files) {
    const relativePath = path.relative(data.contentDir, file);
    const stats = await fsExtra.stat(file);

    fileData = {
      name: path.basename(file),
      size: stats.size > MB ? `${Math.floor(stats.size / MB)}MB` : `${Math.floor(stats.size / KB)}KB`,
      url: path.join('/', relativePath)
    };

    await fsExtra.copy(file, path.join(data.buildDir, fileData.url));

    data.media[relativePath] = fileData;
  }
};
