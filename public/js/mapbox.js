export const displayMap = function (locations) {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYmFraHRpeW9yam9uIiwiYSI6ImNsM2VscDgxczBqYnczZHB2NnVlNGVmNDgifQ.yjnHf7OIh1IzChbb1lakag';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bakhtiyorjon/cl3f544lp000614mayn9wm9qp',
    scrollZoom: false,
    // center: [-118.113491, 34.11745],
    // zoom: 8,
  });
  const bounds = new mapboxgl.LngLatBounds(); //
  locations.forEach((loc) => {
    // Create marker
    const htmlEl = document.createElement('div');
    htmlEl.className = 'marker';
    // Add marker
    new mapboxgl.Marker({
      element: htmlEl,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 28,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>${loc.day}:${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
