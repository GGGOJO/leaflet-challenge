# leaflet-challenge
USGS (United States Geological Survey) Earthquake Data Visualized through Leaflet Maps

The USGS provides earthquake data in a number of different formats, updated every 5 minutes. For this coding project, I visited the USGS GeoJSON Feed page and ‘All Earthquakes from the Past 7 Days’ dataset. Using D3.json to do an API request for the USGS geoJSON data. 

<b>Step 1:</b>
I used three overlay Mapbox maps: g to map out each earthquake by latitude, longitude, and depth of the earthquake by color. Earthquakes with higher magnitudes will appear larger and earthquakes with greater depth will appear darker in color. 

Popups are included to provide additional information about the earthquke when the marker is clicked. 

I also created a "Earthquake Depth (miles)" legend to provide context for the map data. 

<b>Step 2: </b>
I added the tectonicplates boundaries (a second group of data) to visually see the relationship of the earthquakes location with the boundaries. I added three more base maps (aka overlays): grayscale, satellite, and outdoors. Because there are more basemaps to chose from, I added a layer controls for the user to choose a base map to view the earthquake and tectonicplate data.

It makes sense that the earthquakes follow the boundaries. Thus, if you live near/in a tectonic plate, you will have a higher chance of experiencing many earthquakes. This is the case of many Californians!


