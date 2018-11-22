const momentPure = require('moment');
const momentRange = require('moment-range');
const moment = momentRange.extendMoment(momentPure);

// Both contains our allowed date formats (keys) and their granularity (values)
const DATE_FORMATS = {
  'D MMMM YYYY': 'day',
  'D MMM YYYY': 'day',
  'Do MMMM YYYY': 'day',
  'Do MMM YYYY': 'day',
  'MMMM YYYY': 'month',
  'MMM YYYY': 'month',
  'YYYY': 'year'
};

const DATE_CLUE_REGEX = /20\d{2}|jan|jän|feb|mar|mär|apr|may|mai|jun|jul|aug|sep|oct|okt|nov|dec|dez/i;

class Search {
  constructor(query, locale) {
    this.locale = locale;
    this.unescapedQuery = query;
    this.escapedQuery = this.escapeRegex(query);
    this.matches = [];

    this.initializeDateQuery();
  }

  // Initializes the dateQuery object if the query string matches the syntax
  initializeDateQuery() {
    const formats = Object.keys(DATE_FORMATS);
    const parts = this.unescapedQuery.split('-');

    if(parts.length === 2) {
      const from = moment(parts[0].trim(), formats, this.locale, true);
      const to = moment(parts[1].trim(), formats, this.locale, true);

      if(from.isValid() && to.isValid()) {
        const fromGranularity = DATE_FORMATS[from.creationData().format];
        const toGranularity = DATE_FORMATS[to.creationData().format];

        if(fromGranularity === toGranularity) {
          this.dateQuery = {
            granularity: fromGranularity,
            from: from,
            to: to,
            validated: true
          };
        }
      }
    } else if(parts.length === 1) {
      const date = moment(parts[0].trim(), formats, this.locale, true);

      if(date.isValid()) {
        const granularity = DATE_FORMATS[date.creationData().format];

        this.dateQuery = {
          granularity: granularity,
          on: date,
          validated: true
        };
      }
    }

    // If we land here it's not a format we allow for date queries,
    // so we check if it at least looks like a date query attempt
    if(!this.dateQuery && this.unescapedQuery.match(DATE_CLUE_REGEX)) {
      this.dateQuery = { suspected: true };
    }

    if(!this.dateQuery) {
      this.dateQuery = {};
    }
  }

  // Escape regex special characters in string (e.g. turns ".*" into "\.\*")
  escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  flushMatches() {
    return this.matches.splice(0);
  }

  // rawDate (string) - the (ISO formatted) date in which to find matches
  // field (string) - meta information where the match occured
  matchDate(rawDate, field) {
    const q = this.dateQuery;

    if(q.validated) {
      const date = moment(rawDate).locale(this.locale);

      if('on' in q && date.isSame(q.on, q.granularity) ||
         'from' in q && 'to' in q &&
         date.isBetween(q.from, q.to, q.granularity, '[]')) {
        if(q.granularity === 'year') {
          this.matches.push({
            pre: date.format('Do MMMM '),
            match: date.year().toString(),
            field: field
          });
        } else if(q.granularity === 'month') {
          this.matches.push({
            pre: date.format('Do '),
            match: date.format('MMMM YYYY'),
            field: field
          });
        } else if(q.granularity === 'day') {
          this.matches.push({
            match: date.format('Do MMMM YYYY'),
            field: field
          });
        }
      }
    }
  }

  // rawBegin (string) - the (ISO formatted) begin date against which to match
  // rawEnd (string) - the (ISO formatted) end date against which to match
  // field (string) - meta information where the match occured
  matchDateRange(rawBegin, rawEnd, field) {
    const q = this.dateQuery;

    if(q.validated) {
      const begin = moment(rawBegin).locale(this.locale);
      const end = moment(rawEnd).locale(this.locale);

      if('on' in q && q.on.isBetween(begin, end, q.granularity, '[]') ||
         'from' in q && 'to' in q &&
         (begin.isBetween(q.from, q.to, q.granularity, '[]') ||
          end.isBetween(q.from, q.to, q.granularity, '[]') ||
          q.from.isBetween(begin, end, q.granularity, '[]') ||
          q.to.isBetween(begin, end, q.granularity, '[]'))) {
        this.matches.push({
          match: `${begin.format('Do MMMM YYYY')} - ${end.format('Do MMMM YYYY')}`,
          field: field
        });
      }
    }
  }

  // year (number) - the year against which to match, as a number
  // field (string) - meta information where the match occured
  matchYear(year, field) {
    const q = this.dateQuery;

    if(q.validated && q.granularity === 'year') {
      if('on' in q && year === q.on.year() ||
         'from' in q && year >= q.from.year() &&
         'to' in q && year <= q.to.year()) {
        this.matches.push({ match: year.toString(), field: field });
      }
    }
  }

  // content (string) - the string in which to find matches
  // field (string) - meta information where the match occured
  matchText(content, field) {
    if(content) {
      const excerptLength = 200;
      const re = new RegExp(this.escapedQuery, 'gi');

      let match = re.exec(content);

      while(match !== null) {
        const data = {
          match: match[0],
          field: field
        };

        if(content.length > excerptLength) {
          const excerptBegin = re.lastIndex - match[0].length / 2 - excerptLength / 2;
          const excerptEnd = excerptBegin + excerptLength;

          if(excerptBegin <= 0) {
            // "preMATCHpost..."
            data.pre = `"${content.substring(0, re.lastIndex - match[0].length)}`;
            data.post = `${content.substring(re.lastIndex, excerptEnd - excerptBegin - 3)}..."`;
          } else if(excerptEnd >= content.length - 1) {
            // "...preMATCHpost"
            data.pre = `"...${content.substring(excerptBegin - (excerptEnd - content.length + 1) + 3, re.lastIndex - match[0].length)}`;
            data.post = `${content.substring(re.lastIndex)}"`;
          } else {
            // "...preMATCHpost..."
            data.pre = `"...${content.substring(excerptBegin + 3, re.lastIndex - match[0].length)}`;
            data.post = `${content.substring(re.lastIndex, excerptEnd - 3)}..."`;
          }
        } else {
          data.pre = content.substring(0, re.lastIndex - match[0].length);
          data.post = content.substr(re.lastIndex);
        }

        this.matches.push(data);

        match = re.exec(content);
      }
    }
  }

  // list (array) - the list in which to find matches
  // unpack (function) - a function to convert each item's properties into a searchable string
  // field (string) - meta information where the match occured
  matchList(list, unpack, field) {
    if(list) {
      list.forEach(item => this.matchText(unpack(item), field));
    }
  }
}

module.exports = Search;
