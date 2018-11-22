const event = require('./event.js');
const eventList = require('./event_list.js');
const layout = require('../layout/layout.js');
const menu = require('../common/menu.js');
const share = require('../common/share.js');
const translate = require('../../lib/translate.js');

module.exports = context => {
  const menuItems = context.data.years.map(year => ({
    active: year === context.year,
    label: year.label,
    url: year.url
  }));

  let eventPanel = '';
  if(context.event) {
    eventPanel = `
      <div class="year__eventPanel layout__xPadding" data-scroll="event">
        ${event(context)}
      </div>
    `;
  }

  const html = `
<div>
  ${menu(context, menuItems, 'adaptive', translate(context, 'Select a year'))}

  <div class="layout__canvas">
    <div class="layout__marginY">
      <div class="layout__xRestraintFromRestraint">
        <div class="year__panels ${context.event ? 'year__split displaced' : ''}"
             data-TODO-state="{ showEvent: true }">

          <div class="year__listPanel layout__xPaddingFrom960" data-scroll="year">
            ${eventList(context, context.year.events)}
          </div>

          ${eventPanel}
        </div>
      </div>
    </div>
  </div>
</div>
  `;

  const title = context.event ? context.event.title : context.year.label;

  return layout(context, html, { title: title });
};
