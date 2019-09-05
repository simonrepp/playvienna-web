const enolib = require('enolib');
const { date } = require('enotype');
const fastGlob = require('fast-glob');
const fsExtra = require('fs-extra');
const moment = require('moment');
const path = require('path');

const { download, eventType, link, markdown, media, stripped } = require('../loaders.js');

enolib.register({ date, eventType, link, markdown, stripped })

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
  const usedUrls = [];

  for(const file of files) {
    const event = enolib.parse(
      await fsExtra.readFile(file, 'utf-8'),
      { source: file }
    );

    const de = event.section('DE');
    const en = event.section('EN');

    const deDate = de.field('Date').requiredDateValue();
    const enDate = en.field('Date').requiredDateValue();
    const deYear = deDate.getFullYear();
    const enYear = enDate.getFullYear();

    const deYearUrl = `/de/${deYear}/`;
    const enYearUrl = `/${enYear}/`;

    const deUrl = `/de/${deDate.getFullYear()}/${de.field('Permalink').requiredStringValue()}/`;
    const enUrl = `/${enDate.getFullYear()}/${en.field('Permalink').requiredStringValue()}/`;

    if(usedUrls.hasOwnProperty(deUrl))
      throw de.field('Permalink').error(`The german version of the event '${usedUrls[deUrl]}' already uses the permalink '${de.field('Permalink').requiredStringValue()}' - permalinks must be unique inside each locale (de/en)!`);

    if(usedUrls.hasOwnProperty(enUrl))
      throw en.field('Permalink').error(`The english version of the event '${usedUrls[enUrl]}' already uses the permalink '${en.field('Permalink').requiredStringValue()}' - permalinks must be unique inside each locale (de/en)!`);

    usedUrls[deUrl] = file;
    usedUrls[enUrl] = file;

    for(const locale of [de, en]) {
      const eventData = {
        address: locale.field('Address').optionalStringValue(),
        city: locale.field('City').requiredStringValue(),
        country: locale.field('Country').requiredStringValue(),
        coordinates: locale.field('Coordinates').optionalLatLngValue(),
        date: locale.field('Date').requiredDateValue(),
        downloads: locale.list('Downloads').requiredValues(download(data)),
        end: locale.field('End').optionalDateValue(),
        links: locale.list('Links').requiredLinkValues(),
        media: locale.list('Media').requiredValues(media(data)),
        text: locale.field('Text').requiredMarkdownValue(),
        textStripped: locale.field('Text').requiredStrippedValue(),
        title: locale.field('Title').requiredStringValue(),
        translateUrl: locale === de ? enUrl : deUrl,
        types: locale.field('Type').requiredEventTypeValue(),
        url: locale === de ? deUrl : enUrl,
        venue: locale.field('Venue').optionalStringValue(),
        venueLink: locale.field('Venue Link').optionalStringValue()
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
