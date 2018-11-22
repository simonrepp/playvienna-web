const layout = require('./layout.js');

module.exports = context => {
  const html = `
<div id="application">
  <section id="elaboration">
    <div class="wrapper">
      <div>
        ${context.locale === 'de' ? `
          <h1>Fehler</h1>
          <p>Diese Seite existiert nicht.</p>
        ` : `
          <h1>Error</h1>
          <p>This page does not exist.</p>
        `}
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
