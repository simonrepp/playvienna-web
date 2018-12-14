const eno = require('enojs');
const fastGlob = require('fast-glob');
const fsExtra = require('fs-extra');
const moment = require('moment');
const path = require('path');

const { download, eventType, link, markdown, media, strip } = require('../loaders.js');

module.exports = async data => {
  const today = moment().startOf('day');

  data.de.years = [];
  data.en.years = [];

  data.de.events = [];
  data.en.events = [];

  data.de.upcoming = { precalculated: [] };
  data.en.upcoming = { precalculated: [] };

  const directory = path.join(data.contentDir, 'events/**/*.eno');
  const files = await fastGlob(directory);

  for(let file of files) {
    const event = eno.parse(
      await fsExtra.readFile(file, 'utf-8'),
      { reporter: 'terminal', sourceLabel: file }
    );

    const de = event.section('DE');
    const en = event.section('EN');

    const deDate = de.date('Date', { required: true });
    const enDate = en.date('Date', { required: true });
    const deYear = deDate.getFullYear();
    const enYear = enDate.getFullYear();

    const deYearUrl = `/de/${deYear}/`;
    const enYearUrl = `/${enYear}/`;

    const deUrl = `/de/${deDate.getFullYear()}/${de.string('Permalink', { required: true })}/`;
    const enUrl = `/${enDate.getFullYear()}/${en.string('Permalink', { required: true })}/`;

    for(let locale of [de, en]) {
      const eventData = {
        address: locale.string('Address'),
        city: locale.string('City', { required: true }),
        country: locale.string('Country', { required: true }),
        coordinates: locale.latLng('Coordinates'),
        date: locale.date('Date', { required: true }),
        downloads: locale.list('Downloads', download(data)),
        end: locale.date('End'),
        links: locale.list('Links', link),
        media: locale.list('Media', media),
        text: locale.field('Text', markdown, { required: true }),
        textStripped: locale.field('Text', strip, { required: true }),
        title: locale.string('Title', { required: true }),
        translateUrl: locale === de ? enUrl : deUrl,
        types: locale.string('Type', eventType, { required: true }),
        url: locale === de ? deUrl : enUrl,
        venue: locale.string('Venue'),
        venueLink: locale.string('Venue Link')
      };

      data[locale === de ? 'de' : 'en'].events.push(eventData);

      if(today.isSameOrBefore(eventData.end ? eventData.end : eventData.date, 'day')) {
        data[locale === de ? 'de' : 'en'].upcoming.precalculated.push(eventData);
      }

      const year = data[locale === de ? 'de' : 'en'].years.find(year => year.numeric === eventData.date.getFullYear());

      if(year) {
        year.events.push(eventData);
      } else {
        data[locale === de ? 'de' : 'en'].years.push({
          events: [eventData],
          label: eventData.date.getFullYear().toString(),
          numeric: eventData.date.getFullYear(),
          translateUrl: locale === de ? enYearUrl : deYearUrl,
          url: locale === de ? deYearUrl : enYearUrl
        });
      }
    }

    event.assertAllTouched();
  }

  data.de.years.sort((a, b) => b.numeric - a.numeric);
  data.en.years.sort((a, b) => b.numeric - a.numeric);
};
