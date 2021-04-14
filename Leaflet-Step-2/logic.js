// Get the Map Layers
let graymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

let satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

let outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
});

// Create a map object to place graymap, satellitemap and outdoorsmap layers to display on load
var myMap = L.map("map-id", {
    center: [39.8, -94.5],
    zoom: 3,
    layers: [graymap, satellitemap, outdoorsmap]
});

// Adding the 'graymap' as the tile layer to the map
graymap.addTo(myMap);

// Create the layers for the 2 different data sets
// USDA earthquake data and the GitHub Fraxen Tectonicplates
let earthquakes = new L.LayerGroup();
let tectonicPlates = new L.LayerGroup();

// Set up an object to hold all of the maps
let baseMaps = {
    Satellite: satellitemap,
    Outdoors: outdoorsmap,
    Grayscale: graymap,
};

// Set up an object to hold all overlays.
let overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonicPlates
};

// Provide a layer control to the map for the user to choose desires map layers
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L
    .control
    .layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

// Perform API call to USGS API to get earthquake data
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(link).then(function (data) {
    console.log(data)

    function styleInfo(feature) {
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
    // create function for getColor for the depth in miles of the earthquake
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
    // earthquakes with a 0 magnitude have been plotted with the wrong radius
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
        onEachFeature: function (feature, layer) {
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
            "tomato"
        ];

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

    d3.json("https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json").then(function (plateData) {
        // Adding the geoJSON data, along with the style information, to the tectonicplates layer
        L.geoJson(plateData, {
            color: "orange",
            weight: 2
        }).addTo(tectonicPlates);

        // Add tectonicplates layer to the map
        tectonicPlates.addTo(map);
    });
});

// var legend = L.control({position: 'topleft'});
//     legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div', 'info legend'),
//         grades = [50, 100, 150, 200, 250, 300],
//         labels = ['<strong> THE TITLE </strong>'],
//         from, to;

//     for (var i = 0; i < grades.length; i++) {
//         from = grades [i];
//         to = grades[i+1]-1;

//     labels.push(
//         '<i style="background:' + getColor(from + 1) + '"></i> ' +
//         from + (to ? '&ndash;' + to : '+'));
//         }
//         div.innerHTML = labels.join('<br>');
//         return div;

        // };
