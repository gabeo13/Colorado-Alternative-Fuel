// Create our map object
var myMap = L.map("mapid", {
    center: [
        39.0501, -105.7821
    ],
    zoom: 7
});

d3.json(`/login`).then(function (info) {

    // Define street view map layer
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: info
    }).addTo(myMap);

});

// // Store our API endpoint inside queryUrl
// var queryUrl = "http://localhost:5000/api/v1.0/Charging_Stations";

// Perform a GET request to the query URL
function buildMap(mapData) {

    d3.json(`/login`).then(function (info) {

        // Define street view map layer
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: info
        }).addTo(myMap);

        var markerGroup = L.layerGroup().addTo(myMap);

        console.log('received map data', mapData);

        // Iterate through json and construct markers
        mapData.forEach(d => {

            //Build Color Map for coloring on station fuel type
            var color_arr = ""
            if (d['fuel_type_code'] == 'BD') {
                color_arr = '#16a085'
            }
            else if (d['fuel_type_code'] == 'CNG') {
                color_arr = '#2980b9'
            }
            else if (d['fuel_type_code'] == 'E85') {
                color_arr = '#c0392b'
            }
            else if (d['fuel_type_code'] == 'ELEC') {
                color_arr = '#f1c40f'
            }
            else {
                color_arr = '#34495e'
            }

            //Add Circle Markers, size on magnitude, color on depth, bind info popup on click
            L.circleMarker([d['latitude'], d['longitude']], { color: color_arr }).bindPopup(`Location: ${d['City']}<br>Station: ${d['station_name']}`).openPopup().addTo(markerGroup);

        });

    });

};

// Add legend, see CSS for Styling
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Alternative Fuel Station Type</h4>";
    div.innerHTML += '<i style="background: #34495e"></i><span>LPG</span><br>';
    div.innerHTML += '<i style="background: #f1c40f"></i><span>ELEC</span><br>';
    div.innerHTML += '<i style="background: #c0392b"></i><span>E85</span><br>';
    div.innerHTML += '<i style="background: #2980b9"></i><span>CNG</span><br>';
    div.innerHTML += '<i style="background: #16a085"></i><span>BD</span><br>';

    return div;
};

legend.addTo(myMap);
