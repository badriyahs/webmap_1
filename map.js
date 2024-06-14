'use strict'
console.log('Loaded map.js');
mapboxgl.accessToken = 'pk.eyJ1IjoiYmFkcml5YWgiLCJhIjoiY2x4ZXplbzcxMG81MDJqc2o5d29zcWY2NiJ9.dFLAOk67vE3UgjERiDYoxA';

// Initialize the map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-73.93324, 40.80877],
    zoom: 14
});

var blocks_url = "./data/blocks_joined_trees_um.geojson";
var trees_url = "./data/2015_Street_Tree_Census_subset_um.geojson";

// Wait until the map is loaded before adding data
map.on('load', function() {
    // Define a 'source' for your polygons dataset
    map.addSource('blocks_data', {
        'type': 'geojson',
        'data': blocks_url,
    });

    // Add a new layer with your polygons and fill-color steps
    map.addLayer({
        'id': 'blocks',
        'type': 'fill',
        'source': 'blocks_data',
        'paint': {
            'fill-color': [
                'case',
                ['==', ['get', 'avg_diamet'], null],
                'white',
                ['step', ['get', 'avg_diamet'],
                    '#ffffff',
                    2.615, '#edf8e9',
                    6.444, '#bae4b3',
                    9.379, '#74c476',
                    15.036, '#31a354',
                    26.000, '#006d2c'
                ]
            ],
            'fill-outline-color': '#000000',
            'fill-opacity': 0.5
        }
    });

    // Define a 'source' for your point dataset
    map.addSource('trees_data', {
        'type': 'geojson',
        'data': trees_url
    });

    // Add a new layer with your points using bucket-based circle-radius
    map.addLayer({
        'id': 'trees',
        'type': 'circle',
        'source': 'trees_data',
        'paint': {
            'circle-color': '#349f27',
            'circle-opacity': 0.7,
            'circle-radius': [
                'step',
                ['get', 'tree_dbh'],
                4,        // Default radius
                10, 6,
                20, 8,
                30, 10,
                40, 12
            ]
        }
    });

    // Add interaction for displaying a popup on click
    map.on('click', 'trees', function(e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var species = e.features[0].properties.spc_common;

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(species)
            .addTo(map);
    });
});

