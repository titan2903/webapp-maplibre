import naturalEarthData from "../data/ne.geojson?url";
import areaData from "../data/area.geojson?url";
import type { Map } from "maplibre-gl";

const activeAnalysisLayers: string[] = [];
const activeAnalysisSources: string[] = [];

export function addKotaLayer(map: Map): void {
    if (map.getSource('kota')) return;
    map.addSource('kota', {
        type: 'geojson',
        data: naturalEarthData
    });

    map.addLayer({
        id: "titik-kota",
        type: "circle",
        source: "kota",
        paint: {
            "circle-radius": 6,
            "circle-color": "#3b82f6",
            "circle-stroke-width": 1.5,
            "circle-stroke-color": "#ffffff"
        }
    });
}

export function addPulauLayer(map: Map): void {
    if (map.getSource('pulau')) return;
    map.addSource('pulau', {
        type: "geojson",
        data: areaData
    });

    map.addLayer({
        id: "area-pulau",
        type: "fill",
        source: "pulau",
        paint: {
            "fill-color": "#f97316",
            "fill-outline-color": "#ffffff",
            "fill-opacity": 0.7
        }
    });
}

export function addBufferLayer(map: Map, data: any): void {
    const fid = `buffer-${getRandomInt(1000, 9999)}`;
    const layerId = `layer-${fid}`;

    map.addSource(fid, {
        type: "geojson",
        data: data
    });

    map.addLayer({
        id: layerId,
        type: "fill",
        source: fid,
        paint: {
            "fill-color": "#ef4444",
            "fill-outline-color": "#eab308",
            "fill-opacity": 0.45
        }
    });

    activeAnalysisLayers.push(layerId);
    activeAnalysisSources.push(fid);
}

export function addDistanceLineLayer(map: Map, data: any): void {
    const fid = `distance-${getRandomInt(1000, 9999)}`;
    const layerId = `layer-${fid}`;

    map.addSource(fid, {
        type: "geojson",
        data: data
    });

    map.addLayer({
        id: layerId,
        type: "line",
        source: fid,
        paint: {
            "line-color": "#a855f7",
            "line-width": 4,
            "line-dasharray": [2, 1]
        }
    });

    activeAnalysisLayers.push(layerId);
    activeAnalysisSources.push(fid);
}

export function addCentroidLayer(map: Map, data: any): void {
    const fid = `centroid-${getRandomInt(1000, 9999)}`;
    const layerId = `layer-${fid}`;

    map.addSource(fid, {
        type: "geojson",
        data: data
    });

    map.addLayer({
        id: layerId,
        type: "circle",
        source: fid,
        paint: {
            "circle-radius": 8,
            "circle-color": "#10b981",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff"
        }
    });

    activeAnalysisLayers.push(layerId);
    activeAnalysisSources.push(fid);
}

export function clearAllAnalysisLayers(map: Map): void {
    activeAnalysisLayers.forEach(layerId => {
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
    });
    activeAnalysisSources.forEach(sourceId => {
        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }
    });
    activeAnalysisLayers.length = 0;
    activeAnalysisSources.length = 0;
}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}