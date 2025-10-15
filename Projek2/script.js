// Inisialisasi peta
var map = L.map('map').setView([-6.9245, 106.9284], 13);

// 2 Base map (OSM dan Satellite)
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
});

var satellite = L.tileLayer.provider('Esri.WorldImagery');

// Tambahkan base map default
osm.addTo(map);

// GeoJSON Data Sukabumi
var geojsonData = {
  "type": "FeatureCollection",
  "features": [
    // MARKER
    {
      "type": "Feature",
      "properties": { "name": "Universitas Nusa Putra" },
      "geometry": { "type": "Point", "coordinates": [106.9339, -6.9247] }
    },
    {
      "type": "Feature",
      "properties": { "name": "Terminal Sukabumi" },
      "geometry": { "type": "Point", "coordinates": [106.9310, -6.9360] }
    },
    // POLYLINE
    {
      "type": "Feature",
      "properties": { "name": "Jalan Utama Sukabumi" },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [106.9195, -6.9172],
          [106.9302, -6.9238],
          [106.9410, -6.9300]
        ]
      }
    },
    // POLYGON
    {
      "type": "Feature",
      "properties": { "name": "Area Macet Suryakencana" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [106.9270, -6.9230],
          [106.9305, -6.9230],
          [106.9305, -6.9260],
          [106.9270, -6.9260],
          [106.9270, -6.9230]
        ]]
      }
    }
  ]
};

// Pisahkan berdasarkan tipe geometri
var markerLayer = L.geoJSON(geojsonData, {
  filter: f => f.geometry.type === "Point",
  onEachFeature: (f, layer) => layer.bindPopup(f.properties.name)
});

var lineLayer = L.geoJSON(geojsonData, {
  filter: f => f.geometry.type === "LineString",
  style: { color: "blue", weight: 3 },
  onEachFeature: (f, layer) => layer.bindPopup(f.properties.name)
});

var polygonLayer = L.geoJSON(geojsonData, {
  filter: f => f.geometry.type === "Polygon",
  style: { color: "red", fillOpacity: 0.3 },
  onEachFeature: (f, layer) => layer.bindPopup(f.properties.name)
});

// Layer Control
var baseMaps = {
  "OpenStreetMap": osm,
  "Satellite": satellite
};

var overlayMaps = {
  "Marker": markerLayer,
  "Polyline": lineLayer,
  "Polygon": polygonLayer
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

// Tambahkan semua overlay secara default
markerLayer.addTo(map);
lineLayer.addTo(map);
polygonLayer.addTo(map);
