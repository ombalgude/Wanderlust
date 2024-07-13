
	mapboxgl.accessToken = mapToken 
    // console.log(mapboxgl.accessToken)
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

const marker1 = new mapboxgl.Marker({color : "red"})
.setLngLat(listing.geometry.coordinates)
.setPopup( new mapboxgl.Popup({offset: 25})
.setHTML(`<h4><b>${listing.title}</b></h4> <p>Exact location will be provided after booking</p>`))
.addTo(map);
