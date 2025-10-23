// --- Inisialisasi Peta ---
const mapMercator = L.map("mapMercator").setView([-6.925, 106.92], 13);
const map4326 = L.map("map4326", {
  crs: L.CRS.EPSG4326,
}).setView([-6.925, 106.92], 13);

// --- CUSTOM ICON ---
// Menggunakan ikon merah khusus untuk membedakan Titik Penting Lalu Lintas
const trafficIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// --- BASEMAPS ---
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

const satellite = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    attribution: "Map data &copy; Google Satellite",
  }
);

// Layer WMS OSM (EPSG:4326)
const wms4326 = L.tileLayer.wms("http://ows.mundialis.de/services/service?", {
  layers: "OSM-WMS",
  format: "image/png",
  transparent: true,
  attribution:
    "Map data © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
});

osm.addTo(mapMercator);
wms4326.addTo(map4326);

// --- FUNGSI GAYA DAN POPUP ---
function styleFeature(feature) {
  switch (feature.geometry.type) {
    case "LineString":
      // Gaya untuk Jalur Macet
      return { color: "#ff0000", weight: 4, opacity: 0.8 };
    case "Polygon":
      // Gaya untuk Area Macet
      return {
        color: "#ff7800",
        weight: 2,
        fillColor: "#ff7800",
        fillOpacity: 0.4,
      };
    default:
      return {};
  }
}

// FUNGSI INTI UNTUK INTERAKTIVITAS (Popup, Tooltip, Events)
function onEachFeature(feature, layer) {
  if (feature.properties) {
    let popupText = '<div class="popup-content">';
    let name =
      feature.properties.nama ||
      feature.properties.nama_jalan ||
      "Lokasi Tak Dikenal";

    // 1. TOOLTIP (Info singkat saat kursor hover)
    layer.bindTooltip(name, {
      permanent: false,
      direction: "top",
    });

    // 2. POPUP DENGAN INTERACTIVE HTML (Detail saat diklik)
    if (feature.geometry.type === "Point") {
      // Konten interaktif hanya untuk Marker (Titik Penting)
      popupText += `<h3>${name}</h3>`;
      if (feature.properties.kategori) {
        popupText += `<p><strong>Kategori:</strong> ${feature.properties.kategori}</p>`;
      }
      if (feature.properties.deskripsi) {
        popupText += `<p>${feature.properties.deskripsi}</p>`;
      }

      // Menambahkan tombol interaktif/event (Modul 3 & 4)
      if (feature.properties.kategori.includes("Pemerintahan")) {
        // Contoh interaktivitas: Tombol untuk Simulasi Penempatan Petugas
        popupText += `<hr><button class="btn-action" onclick="console.log('--- EVENT LOG --- Simulasi penempatan petugas diarahkan ke ${name}'); layer._map.setView(layer.getLatLng(), 15);">Simulasi Penempatan Petugas</button>`;
      } else {
        // Tombol aksi umum
        popupText += `<hr><button class="btn-action" onclick="alert('Laporan data lalu lintas real-time dari ${name} sedang dimuat...');">Tarik Data Live</button>`;
      }
    } else {
      // Konten untuk Line/Polygon (Kemacetan)
      popupText += `<h3>${name}</h3>`;
      popupText += `<p><strong>Status:</strong> ${feature.properties.status_jam_sibuk}</p>`;
      popupText += `<span>Sumber: ${feature.properties.sumber_data}</span>`;
    }

    popupText += "</div>";
    layer.bindPopup(popupText);

    // 3. EVENT HANDLING (Click Event pada Marker)
    if (feature.geometry.type === "Point") {
      layer.on("click", function (e) {
        console.log(
          `--- EVENT LOG --- Marker ${name} diklik pada koordinat ${e.latlng.lat.toFixed(
            4
          )}, ${e.latlng.lng.toFixed(4)}.`
        );
        // Anda bisa menambahkan logika peringatan di sini (Modul 4)
      });
    }
  }
}

// --- FUNGSI UTAMA MUAT GEOJSON ---
function loadGeoJsonToMap(mapInstance) {
  fetch("map.geojson")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Inisialisasi Layer Group untuk Overlay
      const pointMarkers = L.featureGroup();
      const polylineLayers = L.featureGroup();
      const polygonLayers = L.featureGroup();

      L.geoJSON(data, {
        // 4. CUSTOM ICON (Digunakan di sini)
        pointToLayer: function (feature, latlng) {
          if (feature.properties.kategori) {
            return L.marker(latlng, { icon: trafficIcon });
          }
          return L.marker(latlng);
        },
        style: styleFeature,
        onEachFeature: function (feature, layer) {
          onEachFeature(feature, layer);
          switch (feature.geometry.type) {
            case "Point":
              pointMarkers.addLayer(layer);
              break;
            case "LineString":
              polylineLayers.addLayer(layer);
              break;
            case "Polygon":
              polygonLayers.addLayer(layer);
              break;
          }
        },
      });

      // Tambahkan semua overlay default ke peta
      pointMarkers.addTo(mapInstance);
      polylineLayers.addTo(mapInstance);
      polygonLayers.addTo(mapInstance);

      // --- LAYER CONTROL ---
      const overlayMaps = {
        "Marker Penting (Point)": pointMarkers,
        "Jalur Macet (LineString)": polylineLayers,
        "Area Macet (Polygon)": polygonLayers,
      };

      let baseMaps;

      if (mapInstance === mapMercator) {
        baseMaps = {
          "OpenStreetMap (3857)": osm,
          "Satelit Google (3857)": satellite,
        };
      } else {
        // Hanya WMS Layer yang kompatibel dengan CRS 4326
        baseMaps = {
          "OSM-WMS (4326)": wms4326,
        };
      }

      L.control.layers(baseMaps, overlayMaps).addTo(mapInstance);
    })
    .catch((error) => {
      console.error("Error memuat atau menampilkan data GeoJSON:", error);
      mapInstance.getContainer().innerHTML = `<div style="padding: 20px;"><h1>Error</h1><p>Gagal memuat file <strong>map.geojson</strong>. Pastikan file tersebut ada di folder yang sama.</p></div>`;
    });
}

loadGeoJsonToMap(mapMercator);
loadGeoJsonToMap(map4326);
