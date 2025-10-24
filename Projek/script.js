// Inisialisasi Peta
const map = L.map("map", {
  zoomControl: false,
}).setView([-6.92, 106.925], 13);

L.control
  .zoom({
    position: "bottomright",
  })
  .addTo(map);

// Layer Peta Dasar
const osmLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "© OpenStreetMap contributors",
  }
).addTo(map);

const satelliteLayer = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "© Esri",
  }
);

let pointsLayer;
let roadsLayer;

// FUNGSI UTAMA: Memuat data GeoJSON dari map.geojson
fetch("./map.geojson")
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        "Gagal memuat map.geojson. Pastikan file ada di direktori yang sama."
      );
    }
    return response.json();
  })
  .then((geojsonData) => {
    // Custom icons
    const pointIcon = L.divIcon({
      className: "custom-marker",
      html: '<div style="background: linear-gradient(135deg, #ef4444, #dc2626); width: 14px; height: 14px; border-radius: 50%; border: 3px solid rgba(239, 68, 68, 0.3); box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Layer Titik Bangkitan (Points)
    pointsLayer = L.geoJSON(geojsonData, {
      filter: (f) => f.geometry.type === "Point",
      pointToLayer: (f, latlng) => L.marker(latlng, { icon: pointIcon }),
      onEachFeature: (f, layer) => {
        if (f.properties.nama) {
          layer.bindPopup(`
                        <div class="popup-title">${f.properties.nama}</div>
                        <div class="popup-category">${f.properties.kategori}</div>
                        <div class="popup-desc">${f.properties.deskripsi}</div>
                    `);
        }
      },
    }).addTo(map);

    // Layer Jalan Macet (LineStrings/Polygons)
    roadsLayer = L.geoJSON(geojsonData, {
      filter: (f) =>
        f.geometry.type === "LineString" || f.geometry.type === "Polygon",
      style: {
        color: "#f59e0b",
        weight: 4,
        opacity: 0.8,
        fillColor: "#f59e0b",
        fillOpacity: 0.3,
      },
      onEachFeature: (f, layer) => {
        if (f.properties.nama_jalan) {
          layer.bindPopup(`
                        <div class="popup-title">${f.properties.nama_jalan}</div>
                        <div class="popup-category">${f.properties.status_jam_sibuk}</div>
                        <div class="popup-desc">Sumber: ${f.properties.sumber_data}</div>
                    `);
        }
      },
    }).addTo(map);

    // Set batas peta agar sesuai dengan data
    const bounds = L.geoJSON(geojsonData).getBounds();
    map.fitBounds(bounds, { padding: [50, 50] });
  })
  .catch((error) => {
    console.error("Error memuat data GeoJSON:", error);
    alert("Gagal memuat data peta: " + error.message);
  });

// Functions
function changeBasemap(type) {
  document
    .querySelectorAll(".basemap-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.closest(".basemap-btn").classList.add("active");

  if (type === "osm") {
    map.removeLayer(satelliteLayer);
    map.addLayer(osmLayer);
  } else {
    map.removeLayer(osmLayer);
    map.addLayer(satelliteLayer);
  }
}

function toggleLayer(layer) {
  const checkbox = document.getElementById(layer + "-check");
  const item = event.target.closest(".layer-item");

  // Memastikan layer sudah dimuat sebelum toggle
  if (layer === "points" && pointsLayer) {
    if (map.hasLayer(pointsLayer)) {
      map.removeLayer(pointsLayer);
      checkbox.checked = false;
      item.classList.remove("active");
    } else {
      map.addLayer(pointsLayer);
      checkbox.checked = true;
      item.classList.add("active");
    }
  } else if (layer === "roads" && roadsLayer) {
    if (map.hasLayer(roadsLayer)) {
      map.removeLayer(roadsLayer);
      checkbox.checked = false;
      item.classList.remove("active");
    } else {
      map.addLayer(roadsLayer);
      checkbox.checked = true;
      item.classList.add("active");
    }
  }
}
