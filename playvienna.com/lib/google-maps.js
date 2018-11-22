module.exports = callback => {
  if(window.google === undefined) {
    const script = document.createElement('script');

    window.initMaps = callback;

    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?callback=initMaps&key=AIzaSyBxDq4ak_Zsxi8kAdCCJk1yNGASutuO-1w';

    document.head.appendChild(script);
  } else {
    callback();
  }
};
