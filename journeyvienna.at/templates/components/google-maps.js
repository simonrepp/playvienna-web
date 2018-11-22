// this.statics = {
//   gatheringTitle: {
//     de: 'Treffpunkt',
//     en: 'Gathering point',
//   },
//   gatheringText: {
//     de: 'Hier beginnt das Spiel, komm nicht zu spät!',
//     en: 'This is from where the game starts, don\'t be late!'
//   }
// };

module.exports = context => `
<div id="map"></div>

<script>
  window.route = ${JSON.stringify(context.latestJourney.route)};
  window.map = null;
  window.markers = [];

  function updateMarkers() {
    window.route.forEach(function(point, index, route) {
      var label = index.toString();

      if(index === 0) {
        label = 'S';
      } else if(index === route.length - 1) {
        label = 'E';
      }

      if(index < window.markers.length) {
        window.markers[index].setOptions({
          label: label,
          map: window.map,
          position: {
            lat: point.coordinates.lat,
            lng: point.coordinates.lng
          },
        });
      } else {
        window.markers.push(new google.maps.Marker({
          label: label,
          map: window.map,
          position: {
            lat: point.coordinates.lat,
            lng: point.coordinates.lng
          },
        }));
      }
    });

    if(window.markers.length > route.length) {
      for(var i = route.length; i < window.markers.length; i++) {
        window.markers[i].setMap(null);
      }
    }
  }

  function updateViewport() {
    if(window.route.length > 1) {
      const bounds = new google.maps.LatLngBounds();

      window.markers.forEach(function(marker) {
        bounds.extend(marker.getPosition());
      });

      window.map.fitBounds(bounds);
    } else {
      window.map.setOptions({
        center: window.markers[0].getPosition(),
        zoom: 15
      });
    }
  }

  function initializeMaps() {
    var mapOptions = {
      center: { lat: 48.202541, lng: 16.368799 }, // Vienna
      mapTypeControl: false,
      panControl: false,
      streetViewControl: false,
      zoom: 15,
      zoomControl: false,
    };

    window.map = new google.maps.Map(document.querySelector('#map'), mapOptions);

    this.updateMarkers();
    this.updateViewport();

    window.addEventListener('resize', function() {
      // Only resize map if it is not hidden through display: none
      if(document.querySelector('#map').offsetParent !== null) {
        google.maps.event.trigger(window.map, 'resize');
        this.updateViewport();
      }
    }.bind(this));
  }

  window.timer = setInterval(function() {
    if(window.google !== undefined) {
      clearInterval(window.timer);
      initializeMaps();
    }
  }, 50);
</script>
`;
