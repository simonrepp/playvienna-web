const eno = require('enojs');
const { Fieldset, List } = require('enojs');
const fastGlob = require('fast-glob');
const fsExtra = require('fs-extra');
const path = require('path');

const { download, link, markdown, media, strip } = require('../loaders.js');

module.exports = async data => {
  data.de.journey = { editions: [], website: {} };
  data.en.journey = { editions: [], website: {} };

  const website = eno.parse(await fsExtra.readFile(path.join(data.contentDir, 'journey/website.eno'), 'utf-8'), { locale: 'de', reporter: 'terminal' });

  for(let locale of [website.section('DE'), website.section('EN')]) {
    for(let block of locale.elements()) {
      data[locale.name.toLowerCase()].journey.website[block.name] = block.value(markdown);
    }
  }

  const directory = path.join(data.contentDir, 'journey/editions/*.eno');
  const files = await fastGlob(directory);

  for(let file of files) {
    const edition = eno.parse(
      await fsExtra.readFile(file, 'utf-8'),
      { sourceLabel: file }
    );

    const deUrl = `/de/journey/${edition.string('Permalink', { required: true })}/`;
    const enUrl = `/journey/${edition.string('Permalink', { required: true })}/`;

    for(let locale of ['de', 'en']) {
      let checkpointNumber = 0;

      // TODO: (-ish): No possibilty for locale specific download/link/media/labels for journeys because of unique layout

      data[locale].journey.editions.push({
        abstract: edition.string('Abstract', { required: true }),
        date: edition.date('Date', { required: true }),
        downloads: edition.list('Downloads', download(data)),
        length: edition.string('Length', { enforceElement: true }),
        links: edition.list('Links', link),
        media: edition.list('Media', media(data)),
        route: edition.section('Route').elements().map(checkpoint => ({
          coordinates: checkpoint.latLng('Coordinates'),
          hint: checkpoint.string(`Hint/${locale.toUpperCase()}`) || checkpoint.string('Hint'),
          location: checkpoint.string('Location', { required: true }),
          number: (() => {
            if(checkpoint.name === 'Checkpoint') {
              checkpointNumber++;
              return checkpointNumber.toString();
            } else if(checkpoint.name === 'Checkpoint Alternative A') {
              checkpointNumber++;
              return `${checkpointNumber}a`;
            } else if(checkpoint.name === 'Checkpoint Alternative B') {
              return `${checkpointNumber}b`;
            } else {
              return null;
            }
          })(),
          safezone: (() => {
            const safezone = checkpoint.element('Safezone', { required: false });

            if(safezone instanceof Fieldset) {
              return {
                center: safezone.latLng('Center', { required: true }),
                radius: safezone.integer('Radius', { required: true }),
                shape: 'circle'
              };
            } else if(safezone instanceof List) {
              return {
                path: safezone.latLngItems(),
                shape: 'polygon'
              };
            } else {
              return null;
            }
          })(),
          special: (() => {
            switch(checkpoint.name) {
              case 'Checkpoint': return null;
              case 'Checkpoint Alternative A': return 'alternativeA';
              case 'Checkpoint Alternative B': return 'alternativeB';
              case 'Finish': return 'finish';
              case 'Start': return 'start';
            }
          })()
        })),
        text: edition.field(`Text/${locale.toUpperCase()}`, markdown) ||
              edition.field('Text', markdown),
        textStripped: edition.field(`Text/${locale.toUpperCase()}`, strip) ||
                      edition.field('Text', strip),
        time: edition.string('Time', { required: true }),
        title: edition.string('Title', { required: true }),
        translateUrl: locale === 'de' ? enUrl : deUrl,
        url: locale === 'de' ? deUrl : enUrl
      });
    }

    edition.assertAllTouched();
  }

  for(let locale of ['de', 'en']) {
    data[locale].journey.latest = data[locale].journey.editions.reduce((pick, candidate) =>
      candidate.date > pick.date ? candidate : pick
    );
  }

  data.en.journey.editions.sort((a, b) => b.date - a.date);
  data.en.journey.editions.sort((a, b) => b.date - a.date);
};
