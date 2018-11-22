const fastGlob = require('fast-glob');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const KB = 1024;
const MB = KB * KB;

module.exports = async data => {
  const publicDir = path.join(__dirname, '../../public');

  data.media = {};

  const directory = path.join(data.contentFolder, 'media/**/*');
  const files = await fastGlob(directory);

  for(let file of files) {
    const relativePath = path.relative(data.contentFolder, file);
    const stats = await fs.promises.stat(file);

    fileData = {
      name: path.basename(file),
      size: stats.size > MB ? `${Math.floor(stats.size / MB)}MB` : `${Math.floor(stats.size / KB)}KB`,
      url: path.join('/', relativePath)
    };

    await fsExtra.copy(file, path.join(publicDir, fileData.url));

    data.media[relativePath] = fileData;
  }
};
