const enolib = require('enolib');
const fastGlob = require('fast-glob');
const fsExtra = require('fs-extra');
const path = require('path');
const { latLng } = require('enotype');

const { download, link, markdown, media, stripped } = require('../loaders.js');

enolib.register({ latLng, link, markdown, stripped });

module.exports = async data => {
  data.de.journey = { editions: [], website: {} };
  data.en.journey = { editions: [], website: {} };

  const website = enolib.parse(await fsExtra.readFile(path.join(data.contentDir, 'journey/website.eno'), 'utf-8'));

  for(const locale of [website.section('DE'), website.section('EN')]) {
    for(const block of locale.fields()) {
      data[locale.stringKey().toLowerCase()].journey.website[block.stringKey()] = block.requiredMarkdownValue();
    }
  }

  const directory = path.join(data.contentDir, 'journey/editions/*.eno');
  const files = await fastGlob(directory);

  for(const file of files) {
    const edition = enolib.parse(
      await fsExtra.readFile(file, 'utf-8'),
      { source: file }
    );

    const deUrl = `/de/journey/${edition.field('Permalink').requiredStringValue()}/`;
    const enUrl = `/journey/${edition.field('Permalink').requiredStringValue()}/`;

    for(const locale of ['de', 'en']) {
      let checkpointNumber = 0;

      // TODO: (-ish): No possibilty for locale specific download/link/media/labels for journeys because of unique layout

      data[locale].journey.editions.push({
        abstract: edition.field('Abstract').requiredStringValue(),
        date: edition.field('Date').requiredDateValue(),
        downloads: edition.list('Downloads').requiredValues(download(data)),
        length: edition.requiredField('Length').optionalStringValue(),
        links: edition.list('Links').requiredLinkValues(),
        media: edition.list('Media').requiredValues(media(data)),
        route: edition.section('Route').sections().map(checkpoint => ({
          coordinates: checkpoint.field('Coordinates').optionalLatLngValue(),
          hint: checkpoint.field(`Hint/${locale.toUpperCase()}`).optionalStringValue() || checkpoint.field('Hint').optionalStringValue(),
          location: checkpoint.field('Location').requiredStringValue(),
          number: (() => {
            if(checkpoint.stringKey() === 'Checkpoint') {
              checkpointNumber++;
              return checkpointNumber.toString();
            } else if(checkpoint.stringKey() === 'Checkpoint Alternative A') {
              checkpointNumber++;
              return `${checkpointNumber}a`;
            } else if(checkpoint.stringKey() === 'Checkpoint Alternative B') {
              return `${checkpointNumber}b`;
            } else {
              return null;
            }
          })(),
          safezone: (() => {
            const safezone = checkpoint.optionalElement('Safezone');

            if(safezone === null)
              return null;

            if(safezone.yieldsFieldset()) {
              return {
                center: safezone.toFieldset().entry('Center').requiredLatLngValue(),
                radius: safezone.toFieldset().entry('Radius').requiredIntegerValue(),
                shape: 'circle'
              };
            } else if(safezone.yieldsList()) {
              return {
                path: safezone.toList().requiredLatLngValues(),
                shape: 'polygon'
              };
            } else {
              throw safezone.error('Safezones must either be specified as a fieldset or a list.');
            }
          })(),
          special: (() => {
            switch(checkpoint.stringKey()) {
              case 'Checkpoint': return null;
              case 'Checkpoint Alternative A': return 'alternativeA';
              case 'Checkpoint Alternative B': return 'alternativeB';
              case 'Finish': return 'finish';
              case 'Start': return 'start';
            }
          })()
        })),
        text: edition.field(`Text/${locale.toUpperCase()}`).optionalMarkdownValue() ||
              edition.field('Text').optionalMarkdownValue(),
        textStripped: edition.field(`Text/${locale.toUpperCase()}`).optionalStrippedValue() ||
                      edition.field('Text').optionalStrippedValue(),
        time: edition.field('Time').requiredStringValue(),
        title: edition.field('Title').requiredStringValue(),
        translateUrl: locale === 'de' ? enUrl : deUrl,
        url: locale === 'de' ? deUrl : enUrl
      });
    }

    edition.assertAllTouched();
  }

  for(const locale of ['de', 'en']) {
    data[locale].journey.latest = data[locale].journey.editions.reduce((pick, candidate) =>
      candidate.date > pick.date ? candidate : pick
    );
  }

  data.en.journey.editions.sort((a, b) => b.date - a.date);
  data.en.journey.editions.sort((a, b) => b.date - a.date);
};
