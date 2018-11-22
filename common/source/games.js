const eno = require('enojs');
const fastGlob = require('fast-glob');
const fs = require('fs');
const path = require('path');

const { download, link, markdown, media, strip } = require('../loaders.js');

module.exports = async data => {
  data.de.games = [];
  data.en.games = [];

  const directory = path.join(data.contentFolder, 'games/*.eno');
  const files = await fastGlob(directory);

  for(let file of files) {
    const game = eno.parse(
      await fs.promises.readFile(file, 'utf-8'),
      { locale: 'de', reporter: 'terminal', sourceLabel: file }
    );

    const de = game.section('DE');
    const en = game.section('EN');

    const deUrl = `/de/spiele/${de.string('Permalink', { required: true })}/`;
    const enUrl = `/games/${en.string('Permalink', { required: true })}/`;

    for(let locale of [de, en]) {
      data[locale === de ? 'de' : 'en'].games.push({
        credits: locale.string('Credits', { required: true }),
        downloads: locale.list('Downloads', download(data)),
        links: locale.list('Links', link),
        media: locale.list('Media', media(data)),
        permalink: locale.string('Permalink', { required: true }),
        text: locale.field('Text', markdown, { required: true }),
        textStripped: locale.field('Text', strip, { required: true }),
        title: locale.string('Title', { required: true }),
        translateUrl: locale === de ? enUrl : deUrl,
        url: locale === de ? deUrl : enUrl,
        year: locale.integer('Year', { required: true })
      });
    }

    game.assertAllTouched();
  }

  data.de.games.sort((a, b) => a.year - b.year).reverse();
  data.en.games.sort((a, b) => a.year - b.year).reverse();
};
