const translate = require('../../lib/translate.js');

module.exports = context => {
  const url = context.baseUrl + context.url;

  const html = `
<div class="share__container">
  <a class="theme__link share__link">
    <span class="icon-share"></span> ${translate(context, 'Share')}
  </a>

  <span class="share__notification">
    ${translate(context, 'Notification: Click to copy')} – ${url}
  </span>

  <textarea class="share__textarea" data-share-url>${url}</textarea>
</div>

<script class="share__context" type="application/json">
  ${JSON.stringify({
    baseUrl: context.baseUrl,
    locale: context.locale,
    url: context.url
  })}
</script>
  `;

  return html;
};
