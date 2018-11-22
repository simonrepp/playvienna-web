const fastGlob = require('fast-glob');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

module.exports = async data => {
  const publicDir = path.join(__dirname, '../../public');
  fsExtra.ensureDir(path.join(publicDir, 'backgrounds'));

  data.backgrounds = {};
  data.de.backgrounds = data.backgrounds;
  data.en.backgrounds = data.backgrounds;

  const files = await fastGlob(path.join(__dirname, '*'));

  for(let file of files) {
    if(path.extname(file) === '.js')
      continue;

    const section = path.basename(file).replace(/\.[^.]+$/, '');

    const background = {
      url: `/backgrounds/${section}.jpg`
    };

    const image = sharp(file);

    await image.resize({ width: 2560, withoutEnlargement: true })
               .grayscale()
               .toColorspace('b-w')
               .toFile(path.join(publicDir, background.url));

    data.backgrounds[section] = background;

    // const meta = await image.metadata();
    // const width = meta.width;
    // const height = meta.height;
    //
    // const widths = [144, 240, 360, 480, 720, 1080, 1280, 1920, 2560].filter(width => width < meta.width);
    //
    // // fsExtra.ensureDir(path.join(__dirname, 'public/media', path.dirname(sourceSlugged)));
    //
    // const sizes = {};
    // await Promise.all(
    //   widths.map(width => {
    //     const height = parseInt(sourceHeight * (width / sourceWidth));
    //     const sizedTarget = sourceSlugged.replace(/\.\w+$/, match => `-${width}${match}`);
    //     const sizedTargetAbsolute = path.join(__dirname, 'public/media', sizedTarget);
    //
    //     sizes[width] = `/media/${sizedTarget}`;
    //
    //     if(width < sourceWidth) {
    //       return image.resize(width, height)
    //                   .toFile(sizedTargetAbsolute);
    //     } else {
    //       return fsExtra.copy(sourceAbsolute, sizedTargetAbsolute);
    //     }
    //   })
    // );
  }
};
