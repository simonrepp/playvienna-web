const translate = require('../lib/translate.js');

const copy = context => {
  const element = document.querySelector('[data-share-url]');

  element.focus();
  element.setSelectionRange(0, element.value.length);

  document.execCommand('copy');

  document.querySelector('.share__container').classList.add('confirmed');
  document.querySelector('.share__notification').innerHTML = translate(context, 'Notification: Copied to clipboard');

  setTimeout(() => {
    document.querySelector('.share__container').classList.remove('confirmed');
    document.querySelector('.share__notification').innerHTML = `${translate(context, 'Notification: Click to copy')} – ${context.baseUrl + context.url}`;
  }, 1500);
}

exports.handleClick = event => {
  const button = document.querySelector('.share__link');

  if(button && button.contains(event.target)) {
    const contextJSON = document.querySelector('.share__context').innerText;
    const context = JSON.parse(contextJSON);

    copy(context);

    return true;
  }

  return false;
}
