import pureMoment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(pureMoment);

/**
 * Like localeCompare but without the performance impact.
 */
const compare = (a, b) => a < b ? -1 : (a > b ? 1 : 0);

/**
 * Upcoming event order is visually like: On Monday ...
 *                                        On Tuesday ...
 *                                        On Wednesday ...
 */
 const sortUpcoming = events =>
  events.sort((a, b) => compare(a.date, b.date));
;

/**
 * Events can be classified under both 'thisWeek' and 'nextWeek'; they can only
 * get classified as 'soon' if they are not already classified under 'thisWeek'
 * or 'nextWeek'.
 */
export const calculateUpcoming = context => {
  context.data.upcoming.nextWeek = [];
  context.data.upcoming.soon = [];
  context.data.upcoming.thisWeek = [];

  const today = moment().startOf('day');

  const thisWeek = moment.range(
    moment().startOf('isoWeek'),
    moment().endOf('isoWeek')
  );

  const nextWeek = moment.range(
    moment().add(1, 'weeks').startOf('isoWeek'),
    moment().add(1, 'weeks').endOf('isoWeek')
  );

  for(let event of context.data.upcoming.precalculated) {
    if(event.end) {
      const begin = moment(event.date);
      const end = moment(event.end);

      if(begin.isAfter(nextWeek.end, 'day')) {
        context.data.upcoming.soon.push(event);
      } else {
        const timeframe = moment.range(begin, end);

        if(timeframe.overlaps(thisWeek, { adjacent: true })) {
          context.data.upcoming.thisWeek.push(event);
        }

        if(timeframe.overlaps(nextWeek, { adjacent: true })) {
          context.data.upcoming.nextWeek.push(event);
        }
      }
    } else {
      const date = moment(event.date);

      if(thisWeek.contains(date)) {
        context.data.upcoming.thisWeek.push(event);
      } else if(nextWeek.contains(date)) {
        context.data.upcoming.nextWeek.push(event);
      } else {
        context.data.upcoming.soon.push(event);
      }
    }
  }

  sortUpcoming(context.data.upcoming.nextWeek);
  sortUpcoming(context.data.upcoming.soon);
  sortUpcoming(context.data.upcoming.thisWeek);
};
