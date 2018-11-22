const translate = require('../../lib/translate.js');

module.exports = context => `
<div class="upcoming__container"></div>

<script class="upcoming__context" type="application/json">
  ${JSON.stringify({
    data: {
      upcoming: {
        precalculated: context.data.upcoming.precalculated.map(event => ({
          date: event.date,
          end: event.end,
          title: event.title,
          url: event.url
        }))
      }
    },
    locale: context.locale
  })}
</script>
`;
