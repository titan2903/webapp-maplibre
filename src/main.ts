import { Map } from 'maplibre-gl';
import { addKotaLayer, addPulauLayer } from './layers/vektor';
import { addRasterLayer } from './layers/raster';

const mapElement = document.createElement('div');
mapElement.id = 'map';
mapElement.style.height = "100vh";
mapElement.style.width = "100vw";
mapElement.style.margin = "0";
document.body.style.margin = "0";
document.body.appendChild(mapElement);

const map = new Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/globe.json',
  center: [107.66, -7.14],
  zoom: 1,
});

map.on("load", () => {
  addKotaLayer(map);
  addPulauLayer(map);
  addRasterLayer(map);

  map.addSource("monas", {
    type: "image",
    url: "https://upload.wikimedia.org/wikipedia/id/b/b1/Merdeka_Square_Monas_02.jpg",
    coordinates: [
      [106.822, -6.172], // top-left
      [106.832, -6.172], // top-right
      [106.832, -6.182], // bottom-right
      [106.822, -6.182] // bottom-left
    ]
  });

  map.addLayer({
    id: "monas-image",
    type: "raster",
    source: "monas",
  });
});
