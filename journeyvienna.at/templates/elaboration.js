const layout = require('./layout.js');

module.exports = (context, page) => {
  const html = `
<div id="application">
  <section id="elaboration">
    <div class="wrapper">
      <div>
        ${context.website[page]}
      </div>

      <p>
        <a href="${context.locale === 'de' ? '/de/' : '/'}">
          ${context.locale === 'de' ? 'Zurück zur Hauptseite' : 'Back to main page'}
        </a>
      </p>
    </div>
  </section>
</div>
  `;

  return layout(context, html);
};
