const moment = require('moment');

const googleMaps = require('./google-maps.js');

module.exports = context => `
<section id="gist">
  <div class="flex-mid">
    <div class="pad">
      <h1>${context.latestJourney.title}</h1>
      <ul>
        <li><i class="icon-date"></i> ${moment(context.latestJourney.date).locale(context.locale).format('dddd, Do MMMM YYYY')}</li>
        <li><i class="icon-time"></i> ${context.latestJourney.time}</li>
        <li><i class="icon-address"></i> ${context.latestJourney.route[0].location}</li>
      </ul>
    </div>

    ${context.latestJourney.route[0].location !== 'TBA' ? `
      <div class="pad">
        <div class="responsive-embed">
          ${googleMaps(context)}
        </div>
      </div>
    ` : ''}

    <div class="responsive">
      <div class="pad">
        ${context.website['Home / The Game']}
      </div>
      <div class="pad">
        ${context.website['Home / The Task']}
      </div>
      <div class="pad">
        ${context.website['Home / How To Join']}
      </div>
    </div>
  </div>
</section>
`;
