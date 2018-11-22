exports.handleClick = event => {
  const links = document.querySelectorAll('[data-retain-scroll]');

  for(let link of links) {
    if(link.contains(event.target)) {
      const containers = document.querySelectorAll('[data-scroll]');

      if(containers.length > 0 ) {
        window.retainScroll = {};
        for(let container of containers) {
          window.retainScroll[container.dataset.scroll] = container.scrollTop;
        }
      }

      return true;
    }
  }

  return false;
};

exports.handleLoad = () => {
  if(window.retainScroll) {
    const preview = document.documentElement.hasAttribute('data-turbolinks-preview');

    for(let [type, value] of Object.entries(window.retainScroll)) {
      const container = document.querySelector(`[data-scroll="${type}"]`);

      if(container) {
        container.scrollTop = value;
      }
    }

    if(!preview) {
      delete window.retainScroll;
    }
  }
};
