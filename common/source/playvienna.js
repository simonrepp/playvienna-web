const eno = require('enojs');
const fastGlob = require('fast-glob');
const fs = require('fs');
const path = require('path');

const { download, link, markdown, media, strip } = require('../loaders.js');

module.exports = async data => {
  data.de.playvienna = [];
  data.en.playvienna = [];

  const directory = path.join(data.contentFolder, 'playvienna/*.eno');
  const files = await fastGlob(directory);

  for(let file of files) {
    const page = eno.parse(
      await fs.promises.readFile(file, 'utf-8'),
      { locale: 'de', reporter: 'terminal', sourceLabel: file }
    );

    const de = page.section('DE');
    const en = page.section('EN');

    const deUrl = `/de/${de.string('Permalink', { required: true })}/`;
    const enUrl = `/${en.string('Permalink', { required: true })}/`;

    for(let locale of [de, en]) {
      data[locale === de ? 'de' : 'en'].playvienna.push({
        downloads: locale.list('Downloads', download(data)),
        links: locale.list('Links', link),
        media: locale.list('Media', media(data)),
        menuPosition: locale.integer('Menu Position', { required: true }),
        text: locale.field('Text', markdown, { required: true }),
        textStripped: locale.field('Text', strip, { required: true }),
        title: locale.string('Title', { required: true }),
        translateUrl: locale === de ? enUrl : deUrl,
        url: locale === de ? deUrl : enUrl
      });
    }

    page.assertAllTouched();
  }

  data.de.playvienna.sort((a, b) => a.menuPosition - b.menuPosition);
  data.en.playvienna.sort((a, b) => a.menuPosition - b.menuPosition);
};
