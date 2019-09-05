const googleMaps = require('../lib/google-maps.js');
const googleMapsStyles = require('../lib/google-maps-styles.js');
const translate = require('../lib/translate.js');

const COLORS = {
  primary: '#007381',
  secondary: '#ffa200'
};

class JourneyMapEngine {
  constructor(context, element) {
    this.context = context;
    this.element = element;

    this.map = null;
    this.markers = [];
    this.routes = [];
    this.safezones = [];

    googleMaps(() => this.initializeMap());
  }

  addMarker(checkpoint, label) {
    const marker = new google.maps.Marker({
      icon: this.checkpointIcon,
      label: {
        color: COLORS.primary,
        fontFamily: 'Open Sans Condensed',
        fontSize: '16px',
        fontWeight: '300',
        text: `${checkpoint.location} (${label})`
      },
      map: this.map,
      position: checkpoint.coordinates
    });

    google.maps.event.addListener(marker, 'click', () => {
      this.map.setZoom(16);
      this.map.panTo(marker.getPosition());
    });

    this.markers.push(marker);
  }

  addRoute(path) {
    const polyline = new google.maps.Polyline({
      map: this.map,
      path: path,
      icons: [
        { icon: this.dashSymbol, offset: '0', repeat: '10px' },
        { icon: this.arrowSymbol, offset: '0', repeat: '100px' }
      ],
      strokeColor: COLORS.primary,
      strokeOpacity: 0,
      strokeWeight: 1
    });

    this.routes.push(polyline);
  }

  addSafeZone(safezone) {
    if(safezone) {
      let shape;
      const options = {
        map: this.map,
        strokeColor: COLORS.secondary,
        strokeOpacity: 1.0,
        strokeWeight: 2,
        fillColor: COLORS.secondary,
        fillOpacity: 0.25
      };

      if(safezone.shape === 'polygon') {
        options.paths = safezone.path;
        shape = new google.maps.Polygon(options);
      } else if(safezone.shape === 'circle') {
        options.center = safezone.center;
        options.radius = safezone.radius;
        shape = new google.maps.Circle(options);
      }

      this.safezones.push(shape);
    }
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  clearRoutes() {
    this.routes.forEach(route => route.setMap(null));
    this.routes = [];
  }

  clearSafeZones() {
    this.safezones.forEach(safezone => safezone.setMap(null));
    this.safezones = [];
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
      center: { lat: 48.202541, lng: 16.368799 }, // Vienna
      mapTypeControl: false,
      panControl: false,
      streetViewControl: false,
      styles: googleMapsStyles,
      zoom: 15,
      zoomControl: false,
    };

    this.dashSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 2
    };

    this.arrowSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      fillOpacity: 1,
      scale: 4
    };

    this.checkpointIcon = {
      anchor: new google.maps.Point(16, 16),
      labelOrigin: new google.maps.Point(16, 42),
      origin: new google.maps.Point(0, 0),
      scaledSize: new google.maps.Size(32, 32),
      size: new google.maps.Size(32, 32),
      url: '/images/checkpoint_marker.png'
    };

    this.map = new google.maps.Map(this.element, mapOptions);

    this.updateMarkers();
    this.updateRoute();
    this.updateSafeZones();
    this.updateViewport();

    // window.addEventListener('resize', this.resizeMap);
  }

  resizeMap() {
    const map = document.querySelector('#journey-map');
    if(map && map.offsetParent !== null) {
      google.maps.event.trigger(this.map, 'resize');
      this.updateViewport();
    }
  }

  updateMarkers() {
    this.clearMarkers();

    for(const checkpoint of this.context.edition.route) {
      let label;

      if(checkpoint.special === 'start') {
        label = translate(this.context, 'Start');
      } else if(checkpoint.special === 'finish') {
        label = translate(this.context, 'Finish');
      } else {
        label = `CP ${checkpoint.number}`;
      }

      this.addMarker(checkpoint, label);
    }
  }

  updateRoute() {
    this.clearRoutes();

    const route = [];
    let alternativeRoute = null;

    for(const checkpoint of this.context.edition.route) {
      if(checkpoint.special === 'alternativeA') {
        alternativeRoute = [];
        alternativeRoute.push(route[route.length - 1]);

        route.push(checkpoint.coordinates);
      } else if(checkpoint.special === 'alternativeB') {
        alternativeRoute.push(checkpoint.coordinates);
      } else {
        route.push(checkpoint.coordinates);

        if(alternativeRoute) {
          alternativeRoute.push(checkpoint.coordinates);
          this.addRoute(alternativeRoute);
          alternativeRoute = null;
        }
      }
    }

    this.addRoute(route);
  }

  updateSafeZones() {
    this.clearSafeZones();

    for(const checkpoint of this.context.edition.route) {
      this.addSafeZone(checkpoint.safezone);
    }
  }

  updateViewport() {
    if(this.context.edition.route.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach(marker => bounds.extend(marker.getPosition()));

      this.map.fitBounds(bounds);
    } else {
      this.map.setOptions({
        center: this.markers[0].getPosition(),
        zoom: 15
      });
    }
  }
}

exports.handleLoad = () => {
  const map = document.querySelector('.edition__map');

  if(map) {
    const contextJSON = document.querySelector('.edition__map_context').innerText;
    const context = JSON.parse(contextJSON);

    new JourneyMapEngine(context, map);

    return true;
  }

  return false;
};
