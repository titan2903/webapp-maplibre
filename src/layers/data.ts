import { Map } from 'maplibre-gl';
import { addKotaLayer, addPulauLayer } from './vector';

const mapElement = document.createElement('div');
mapElement.id = 'map';
mapElement.style.height = "300px";
document.body.appendChild(mapElement);

const map = new Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/globe.json',
    center: [107.66, -7.14],
    zoom: 2,
});

map.on("load", () => {
    addKotaLayer(map);
    addPulauLayer(map);
});
