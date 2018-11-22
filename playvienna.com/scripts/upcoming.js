const { calculateUpcoming } = require('../lib/upcoming.js');
const translate = require('../lib/translate.js');

const teaserBubble = (className, events, heading) => {
  if(events.length === 0)
    return '';

  return(`
    <div class="upcoming__bubble ${className}">
      <div class="upcoming__heading">${heading}:</div>

      <div class="upcoming__links">
        ${events.map((event, index) => `
          <span>
            ${index == 0 ? '' : ' / '}
            <a class="upcoming__link" href="${event.url}">
              ${event.title}
            </a>
          </span>
        `).join('')}
      </div>
    </div>
  `);
};

exports.handleLoad = () => {
  if(!location.pathname.match(/^(\/|\/de\/)$/))
    return false;

  const container = document.querySelector('.upcoming__container');
  const contextJSON = document.querySelector('.upcoming__context').innerText;
  const context = JSON.parse(contextJSON);

  calculateUpcoming(context);

  container.innerHTML = `
    <div class="upcoming__bubbles">
      ${teaserBubble('upcoming__bubbleThisWeek', context.data.upcoming.thisWeek, translate(context, 'This Week'))}
      ${teaserBubble('upcoming__bubbleNextWeek', context.data.upcoming.nextWeek, translate(context, 'Next Week'))}
      ${teaserBubble('upcoming__bubbleSoon', context.data.upcoming.soon, translate(context, 'Coming Soon'))}
    </div>
  `;

  return true;
};
