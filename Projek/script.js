const map = L.map('map').setView([-6.925, 106.92], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function styleFeature(feature) {
    switch (feature.geometry.type) {
        case 'LineString':
            return { color: "#ff0000", weight: 4, opacity: 0.8 }; 
        case 'Polygon':
            return { color: "#ff7800", weight: 2, fillColor: '#ff7800', fillOpacity: 0.4 }; 
        default:
            return {}; 
    }
}
function onEachFeature(feature, layer) {
    if (feature.properties) {
        let popupText = '<div class="popup-content">';

        if (feature.properties.nama) {
            popupText += `<h3>${feature.properties.nama}</h3>`;
        } else if (feature.properties.nama_jalan) {
            popupText += `<h3>${feature.properties.nama_jalan}</h3>`;
        }

        if (feature.properties.kategori) {
            popupText += `<p><strong>Kategori:</strong> ${feature.properties.kategori}</p>`;
        }
        if (feature.properties.deskripsi) {
            popupText += `<p>${feature.properties.deskripsi}</p>`;
        }
        if (feature.properties.status_jam_sibuk) {
            popupText += `<p><strong>Status:</strong> ${feature.properties.status_jam_sibuk}</p>`;
            popupText += `<span>${feature.properties.sumber_data}</span>`;
        }

        popupText += '</div>';
        layer.bindPopup(popupText);
    }
}

fetch('map.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        L.geoJSON(data, {
            style: styleFeature,
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(error => {
        console.error('Error memuat atau menampilkan data GeoJSON:', error);
        document.getElementById('map').innerHTML = `<div style="padding: 20px;"><h1>Error</h1><p>Gagal memuat file <strong>map.geojson</strong>. Pastikan file tersebut ada di folder yang sama dengan index.html.</p></div>`;
    });