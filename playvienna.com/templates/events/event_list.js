const moment = require('moment');

const translate = require('../../lib/translate.js');

const eventDate = (context, event) => {
  const begin = moment(event.date).locale(context.locale);

  let formatted;
  if(event.end) {
    const end = moment(event.end).locale(context.locale);

    if(begin.month() == end.month()) {
      formatted = `${begin.format('Do')} - ${end.format('Do MMM')}`;
    } else if(begin.year() == end.year()) {
      formatted = `${begin.format('Do MMM')} - ${end.format('Do MMM')}`;
    } else {
      formatted = `${begin.format('Do MMM YYYY')} - ${end.format('Do MMM YYYY')}`;
    }
  } else {
    formatted = begin.format('Do MMM');
  }

  return `<span class="year__date">${formatted}</span>`;
};

const eventRow = (context, event) => `
<div class="year__row">
  <a class="year__link ${context.event === event ? 'year__linkActive' : ''}"
     data-retain-scroll
     href="${event.url}">
    <div class="year__rowAlignment layout__xPaddingBelow960">
      <div class="theme__strong">
        <strong>
          ${event.title}
        </strong>

        ${event.types.map(type => `
          <span class="year__type year__type-${type.replace(/ /g, '-').toLowerCase()}">
            ${translate(context, type)}
          </span>
        `).join('')}

        <div class="year__subtitle">
          ${event.venue ? event.venue : `${event.city}, ${event.country}`}
        </div>
      </div>
      ${eventDate(context, event)}
    </div>
  </a>
</div>
`;

module.exports = (context, events, heading = null) => {
  if(events.length === 0)
    return '';

  let header = '';
  if(heading) {
    header = `
      <div class="year__listHeader">
        <div class="year__rowAlignment layout__xPaddingBelow960">
          ${heading}
        </div>
      </div>
    `;
  }

  return(`
    <div>
      ${header}
      ${events.sort((a, b) => b.date - a.date).map(event => eventRow(context, event)).join('')}
    </div>
  `);
};

// TODO analyze and port or discard
//   constructor(props) {
//     super(props);
//
//     const transitionEvent = receiveState('transitionEvent');
//
//     if(transitionEvent !== null) {
//       this.state = {
//         showEvent: false,
//         transitionEvent: true
//       };
//     } else {
//       const showEvent = receiveState('showEvent');
//
//       if(showEvent !== null) {
//         this.state = { showEvent: showEvent };
//       } else {
//         this.state = { showEvent: this.props.event !== undefined };
//       }
//     }
//   }
//
//   toggleEvent = (to) => {
//     if(to === null) {
//       // Move back to year
//       this.setState({ showEvent: false });
//     } else if(to !== this.props.path) {
//       // Move to a (different) event
//       const yearScroll = document.querySelector('[data-scroll="year"]').scrollTop;
//       passState({
//         transitionEvent: true,
//         yearScroll: yearScroll
//       });
//     } else {
//       // Move back to already loaded event
//       this.setState({ showEvent: true });
//     }
//   }
//
//   componentDidMount() {
//     if(this.state.transitionEvent) {
//       this.setState({
//         showEvent: true,
//         transitionEvent: false
//       });
//     }
//   }
