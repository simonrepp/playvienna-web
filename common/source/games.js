const enolib = require('enolib');
const fastGlob = require('fast-glob');
const fsExtra = require('fs-extra');
const path = require('path');
const { integer } = require('enotype');

const { download, link, markdown, media, stripped } = require('../loaders.js');

enolib.register({ integer, link, markdown, stripped });

module.exports = async data => {
  data.de.games = [];
  data.en.games = [];

  const directory = path.join(data.contentDir, 'games/*.eno');
  const files = await fastGlob(directory);

  for(const file of files) {
    const game = enolib.parse(
      await fsExtra.readFile(file, 'utf-8'),
      { source: file }
    );

    const de = game.section('DE');
    const en = game.section('EN');

    const deUrl = `/de/spiele/${de.field('Permalink').requiredStringValue()}/`;
    const enUrl = `/games/${en.field('Permalink').requiredStringValue()}/`;

    for(const locale of [de, en]) {
      data[locale === de ? 'de' : 'en'].games.push({
        credits: locale.field('Credits').requiredStringValue(),
        downloads: locale.list('Downloads').requiredValues(download(data)),
        links: locale.list('Links').requiredLinkValues(),
        media: locale.list('Media').requiredValues(media(data)),
        permalink: locale.field('Permalink').requiredStringValue(),
        text: locale.field('Text').requiredMarkdownValue(),
        textStripped: locale.field('Text').requiredStrippedValue(),
        title: locale.field('Title').requiredStringValue(),
        translateUrl: locale === de ? enUrl : deUrl,
        url: locale === de ? deUrl : enUrl,
        year: locale.field('Year').requiredIntegerValue()
      });
    }

    game.assertAllTouched();
  }

  data.de.games.sort((a, b) => a.year - b.year).reverse();
  data.en.games.sort((a, b) => a.year - b.year).reverse();
};
