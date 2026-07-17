import {
  Map,
  FullscreenControl,
  GlobeControl,
  LogoControl,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { addKotaLayer, addPulauLayer } from './layers/vector';
import { addMonasImage } from './layers/raster';
import { addAttribution } from './controls/basicControls';
import { logoMitsubishiControl } from './controls/customLogoControls'
import { addKotaPopup } from './popups/layerPopups';


const map = new Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/globe.json',
  center: [106.83, -6.19],
  zoom: 1,
  attributionControl: false,
  cooperativeGestures: true
});

map.on("load", () => {
  addKotaLayer(map);
  addPulauLayer(map);
  addMonasImage(map);

});

map.on("click", "titik-kota", function (event) {
  addKotaPopup(map, event);
});

map.on("mouseenter", "titik-kota", () => {
  map.getCanvas().style.cursor = "pointer";
});

map.on("mouseleave", "titik-kota", () => {
  map.getCanvas().style.cursor = "";
});

map.doubleClickZoom.disable();


// Controls setting
addAttribution(map, "Natural Earth, Monas");
map.addControl(new FullscreenControl())
map.addControl(new GlobeControl())
map.addControl(new LogoControl({ compact: false }))
map.addControl(new logoMitsubishiControl(), "top-left")