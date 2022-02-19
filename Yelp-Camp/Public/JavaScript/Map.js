mapboxgl.accessToken = MapToken;
const Map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: camp.coordinates,
    zoom: 10

})
map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker()
    .setLngLat(camp.coordinates)
    .setPopup(
        new mapboxgl.Popup({
            offset: 25
        })
        .setHTML(
            `<h3>${Campground.title}</h3><p>${Campground.location}</p>`
        )

    ).addTo(Map)