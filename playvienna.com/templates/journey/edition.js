const moment = require('moment');

const downloads = require('../common/downloads.js');
const layout = require('../layout/layout.js');
const links = require('../common/links.js');
const media = require('../common/media.js');
const menu = require('../common/menu.js');
const share = require('../common/share.js');
const translate = require('../../lib/translate.js');

const checkpoint = (context, { hint, location, number, special }) => {
  let title;
  if(special === 'start') {
    title = translate(context, 'Start');
  } else if(special === 'finish') {
    title = translate(context, 'Finish');
  } else {
    title = `CP ${number}`;
  }

  return(`
    <div class="theme__margin">
      <span class="icon-location" />
      <span class="edition__checkpointTitle">${title}</span>
      <span> » </span>
      <span>${location}</span>
      <div class="edition__checkpointHint">${hint}</div>
    </div>
  `);
};

module.exports = context => {
  const menuItems = context.data.journey.editions.map(edition => ({
    active: edition === context.edition,
    label: `${edition.abstract} ${moment(edition.date).locale(context.locale).format('MMMM YYYY')}`,
    url: edition.url
  }));

  const html = `
<div>
  ${menu(context, menuItems, 'select', translate(context, 'Select a journey'))}
  <div class="layout__canvas" data-scroll="canvas">
    <div class="layout__marginY">
      <div class="layout__xPadding layout__xRestraint">
        <div class="theme__margin">
          <h1 class="theme__header theme__noMargin">
            ${context.edition.title}
          </h1>
          ${moment(context.edition.date).locale(context.locale).format('dddd, Do MMMM YYYY')}, ${context.edition.time}
        </div>

        ${''/*TODO Unlock when presentable
        <div class="theme__markdown theme__text">
          ${context.edition.text}
        </div>*/
        }

        <div class="edition__map layout__block2x"></div>

        <script class="edition__map_context" type="application/json">
          ${JSON.stringify({
            edition: {
              route: context.edition.route.map(checkpoint => ({
                coordinates: checkpoint.coordinates,
                location: checkpoint.location,
                number: checkpoint.number,
                safezone: checkpoint.safezone,
                special: checkpoint.special
              }))
            },
            locale: context.locale
          })}
        </script>

        ${''/*TODO Unlock when presentable
        context.edition.route.map(checkpointData => checkpoint(context, checkpointData)).join('')*/
        }

        ${links(context, context.edition.links)}
        ${media(context, context.edition.media)}
        ${downloads(context, context.edition.downloads)}
        ${share(context)}
      </div>
    </div>
  </div>
</div>
  `;
  return layout(context, html, { title: context.edition.title });
};
