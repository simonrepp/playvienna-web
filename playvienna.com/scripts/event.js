const googleMaps = require('../lib/google-maps.js');
const googleMapsStyles = require('../lib/google-maps-styles.js');

class EventMapEngine {
  constructor(context, element) {
    this.context = context;
    this.element = element;

    this.map = null;
    this.marker = null;

    googleMaps(() => this.initializeMap());
  }

  componentDidUpdate() {
    if(this.map && this.markers.length > 0) {
      google.maps.event.trigger(this.map, 'resize');
      this.updateMarkers();
      this.updateRoute();
      this.updateSafeZones();
      this.updateViewport();
    }
  }

  componentWillUnmount() { // TODO
    window.removeEventListener('resize', this.resizeMap);
  }

  initializeMap() {
    const mapOptions = {
      center: this.context.event.coordinates,
      mapTypeControl: false,
      panControl: false,
      streetViewControl: false,
      styles: googleMapsStyles,
      zoom: 15,
      zoomControl: false,
    };

    this.map = new google.maps.Map(this.element, mapOptions);

    const eventIcon = {
      anchor: new google.maps.Point(32, 32),
      origin: new google.maps.Point(0, 0),
      scaledSize: new google.maps.Size(64, 64),
      size: new google.maps.Size(128, 128),
      url: '/markers/event.png'
    };

    this.marker = new google.maps.Marker({
      icon: eventIcon,
      map: this.map,
      position: this.context.event.coordinates,
      title: this.context.event.title
    });

    // window.addEventListener('resize', this.resizeMap);
  }

  resizeMap() { // TODO
    const map = document.querySelector('#event-map');
    if(map && map.offsetParent !== null) {
      google.maps.event.trigger(this.map, 'resize');
      this.map.setCenter(this.marker.getPosition());
    }
  }
}

exports.handleClick = event => {
  const hide = document.querySelector('.event__hideButton');

  if(hide && hide.contains(event.target)) {
    const panels = document.querySelector('.year__panels');

    panels.classList.remove('displaced');

    return true;
  }

  return false;
};

exports.handleLoad = () => {
  const map = document.querySelector('.event__map');

  if(map) {
    const contextJSON = document.querySelector('.event__map_context').innerText;
    const context = JSON.parse(contextJSON);

    new EventMapEngine(context, map);

    return true;
  }

  return false;
};
