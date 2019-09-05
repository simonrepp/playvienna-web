const enolib = require('enolib');
const fastGlob = require('fast-glob');
const fsExtra = require('fs-extra');
const path = require('path');
const { integer } = require('enotype');

const { download, link, markdown, media, stripped } = require('../loaders.js');

enolib.register({ integer, link, markdown, stripped });

module.exports = async data => {
  data.de.playvienna = [];
  data.en.playvienna = [];

  const directory = path.join(data.contentDir, 'playvienna/*.eno');
  const files = await fastGlob(directory);

  for(const file of files) {
    const page = enolib.parse(
      await fsExtra.readFile(file, 'utf-8'),
      { source: file }
    );

    const de = page.section('DE');
    const en = page.section('EN');

    const deUrl = `/de/${de.field('Permalink').requiredStringValue()}/`;
    const enUrl = `/${en.field('Permalink').requiredStringValue()}/`;

    for(const locale of [de, en]) {
      data[locale === de ? 'de' : 'en'].playvienna.push({
        downloads: locale.list('Downloads').requiredValues(download(data)),
        links: locale.list('Links').requiredLinkValues(),
        media: locale.list('Media').requiredValues(media(data)),
        menuPosition: locale.field('Menu Position').requiredIntegerValue(),
        text: locale.field('Text').requiredMarkdownValue(),
        textStripped: locale.field('Text').requiredStrippedValue(),
        title: locale.field('Title').requiredStringValue(),
        translateUrl: locale === de ? enUrl : deUrl,
        url: locale === de ? deUrl : enUrl
      });
    }

    page.assertAllTouched();
  }

  data.de.playvienna.sort((a, b) => a.menuPosition - b.menuPosition);
  data.en.playvienna.sort((a, b) => a.menuPosition - b.menuPosition);
};
