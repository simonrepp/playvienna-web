const Turbolinks = require('turbolinks');

const edition = require('./edition.js');
const _event = require('./event.js');
const menu = require('./menu.js');
const scroll = require('./scroll.js');
const search = require('./search.js');
const share = require('./share.js');
const sidebar = require('./sidebar.js');
const upcoming = require('./upcoming.js');

Turbolinks.start();

document.addEventListener('click', event => {
  scroll.handleClick(event);

  if(menu.handleClick(event)) return;
  if(_event.handleClick(event)) return;
  if(sidebar.handleClick(event)) return;
  if(share.handleClick(event)) return;
});

document.addEventListener('submit', event => {
  if(search.handleSubmit(event)) return;
});

// TODO: Wrap and possibly move all to :load hook (and go with now enabled no-preview thing (at least for events/*)?)
document.addEventListener('turbolinks:before-render', event => {
  if(window.keepSidebarOpen) {
    event.data.newBody.querySelector('.layout__wrapper').classList.add('displaced');

    const preview = event.target.documentElement.hasAttribute('data-turbolinks-preview');

    if(!preview) {
      delete window.keepSidebarOpen;
    }
  }
});

document.addEventListener('turbolinks:load', () => {
  scroll.handleLoad();

  if(_event.handleLoad()) return;
  if(edition.handleLoad()) return;
  if(upcoming.handleLoad()) return;
  if(search.handleLoad()) return;
});
