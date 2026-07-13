import { Map } from 'maplibre-gl';
import naturalEarthData from "../data/ne.geojson?url";
import areaData from "../data/area.geojson?url";

export function addKotaLayer(map: Map): void {
    // Layer vector titik
    map.addSource('kota', {
        type: 'geojson',
        data: naturalEarthData
    });

    map.addLayer({
        id: "titik-kota",
        type: "circle",
        source: "kota",
        paint: {
            "circle-radius": 7,
            "circle-color": "purple",
            "circle-stroke-width": 1,
            "circle-stroke-color": "black"
        }
    });
}

export function addPulauLayer(map: Map): void {
    // Layer vector polygon
    map.addSource('pulau', {
        type: "geojson",
        data: areaData,
    });

    map.addLayer({
        id: "area-pulau",
        type: "fill",
        source: "pulau",
        paint: {
            "fill-color": "rgba(0, 102, 255, 0.56)",
            "fill-outline-color": "black"
        }
    });
}
