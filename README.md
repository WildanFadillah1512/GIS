# Map Projection Comparison: Web Mercator vs. EPSG:4326

A simple web project to visually demonstrate and compare the differences between the Web Mercator projection (the web standard) and the EPSG:4326 geographic coordinate system, using GeoJSON data for Sukabumi, Indonesia.

---

### **[➡️ View Live Demo](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/)**

---

### Map Preview
![Screenshot of the map comparison](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO_NAME/main/screenshot.jpg)

*The screenshot above provides a direct comparison between the two maps. Notice how the EPSG:4326 map (bottom) appears "squashed" or vertically compressed.*

---

### Key Features
* **Dual Maps:** Displays two maps side-by-side for easy comparison.
* **Different Projections:** The first map uses Web Mercator (EPSG:3857), while the second uses EPSG:4326.
* **GeoJSON Data:** Loads point, line, and polygon features from an external `map.geojson` file.
* **Interactive Popups:** Each map feature includes a popup with detailed information.
* **WMS Basemap:** Utilizes a WMS service to correctly display the basemap on the EPSG:4326 map.

---

### Tech Stack
* ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
* ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
* ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
* ![Leaflet](https://img.shields.io/badge/Leaflet-1EB300?style=for-the-badge&logo=leaflet&logoColor=white)
