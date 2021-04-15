// Get the Map Layers
let graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

// Create a map object to place graymap, satellitemap and outdoorsmap layers to display on load
var myMap = L.map("map-id", {
    center: [39.8, -94.5],
    zoom: 3,
    layers: [graymap]
});

// Adding the 'graymap' as the tile layer to the map
graymap.addTo(myMap);

// Create the layers for the data set
// USDA earthquake data
let earthquakes = new L.LayerGroup();

// Set up an object to hold all of the maps
let baseMaps = {
    Grayscale: graymap
};

// Set up an object to hold all overlays.
let overlayMaps = {
    "Earthquakes": earthquakes
};

// Add a layer control for user to choose map layers
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Do an API request to USGS API for earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function (data) {
    console.log(data)

    function styleInfo(features) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(features.geometry.coordinates[2]),
            color: "black",
            radius: getRadius(features.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    // function for getcolor of the depth in miles for each earthquake
    function getColor(miles) {
        switch (true) {
            case miles > 90:
                return "tomato";
            case miles > 70:
                return "lightsalmon";
            case miles > 50:
                return "orange";
            case miles > 30:
                return "gold";
            case miles > 10:
                return "yellowgreen";
            default:
                return "lightgreen";
        }
    }

    // create a function for the radius of the earthquake marker base on magnitude
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        // scale the magnitude
        return magnitude * 4;
    }
    // Add the GeoJSON layer to the map once the file is loaded
    L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        //set the style for each circleMarker using our styleInfo function.
        style: styleInfo,

        // Set up a Popup for each marker with the info of magnitude and location
        onEachFeature: function (features, layer) {
            layer.bindPopup(
                "Magnitude: "
                + features.properties.mag
                + "<br>Depth: "
                + features.geometry.coordinates[2]
                + "<br>Location: "
                + features.properties.place
            );
        }
        // We add the data to the earthquake layer instead of directly to the map.
    }).addTo(earthquakes);

    // Create a legend control object.
    let legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");

        let grades = [10, 10, 30, 50, 70, 90];
        let colors = [
            "lightgreen",
            "yellowgreen",
            "gold",
            "orange",
            "lightsalmon",
            "tomato"];
        div.innerHTML += "<text>Depth of Earthquake " + "<br>" + "(in miles)</text><br>";

        // loop through the intervals and generate a label with a colored square for each interval
        for (let index = 0; index < grades.length; index++) {
            div.innerHTML += "<i style = 'background: "
                + colors[index]
                + "'></i>"
                + grades[index]
                + (grades[index + 1] ? "&ndash;" + grades[index + 1] + "<br>" : "+");
        }
        return div;
    };

    // Add the legend to the map
    legend.addTo(myMap);


});
