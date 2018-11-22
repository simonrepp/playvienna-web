const moment = require('moment');

const downloads = require('../common/downloads.js');
const links = require('../common/links.js');
const media = require('../common/media.js');
const share = require('../common/share.js');

const location = context => `
<div class="theme__margin">
  ${context.event.venue ? `
    <div>
      ${context.event.venueLink ? `
        <a class="theme__link" href=${context.event.venueLink} target="_blank">
          ${context.event.venue}
        </a>
      `:`
        <strong class="theme__strong">${context.event.venue}</strong>
      `}
    </div>
  `:''}
  ${context.event.address ? `<div>${context.event.address}</div>` : ''}
  <div>${context.event.city}, ${context.event.country}</div>
</div>
`;

const date = context => {
  if(context.event.end) {
    const format = (d) => moment(d).locale(context.locale).format('Do MMMM');
    return `<div>${format(context.event.date)} - ${format(context.event.end)}</div>`;
  } else {
    const date = moment(context.event.date).locale(context.locale).format('dddd, Do MMMM');
    return `<div>${date}</div>`;
  }
};

module.exports = context => `
<div>
  <a class="theme__link event__hideButton"
     data-retain-scroll
     href="${context.year.url}">
    <span class="icon-media-previous" />
  </a>

  ${context.event.coordinates ? `
    <div class="event__map"></div>

    <script class="event__map_context" type="application/json">
      ${JSON.stringify({
        event: {
          coordinates: context.event.coordinates,
          title: context.event.title
        }
      })}
    </script>
  ` : ''}

  <div class="theme__margin">
    <h1 class="theme__header theme__noMargin">
      ${context.event.title}
    </h1>
    ${date(context)}
  </div>

  ${location(context)}

  <div class="theme__markdown theme__text">
    ${context.event.text}
  </div>

  ${media(context, context.event.media, 'compact')}
  ${downloads(context, context.event.downloads)}
  ${links(context, context.event.links)}
  ${share(context)}
</div>
`;
