import { geojsonToWKT } from "@terraformer/wkt";
import { addDistanceLineLayer } from "../layers/vector";
import type { Map, MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";

type FeatureEvent = MapMouseEvent & {
    features?: MapGeoJSONFeature[];
};

let firstPoint: { lng: number; lat: number; wkt: string } | null = null;

export function handleDistanceClick(map: Map, event: FeatureEvent, showLoading: (show: boolean) => void): void {
    const lngLat = event.lngLat;
    const pointGeoJSON = {
        type: "Point",
        coordinates: [lngLat.lng, lngLat.lat]
    };
    const wkt = geojsonToWKT(pointGeoJSON as any);

    if (!firstPoint) {
        firstPoint = { lng: lngLat.lng, lat: lngLat.lat, wkt };
        const distElement = document.getElementById("distance");
        if (distElement) {
            distElement.classList.remove("hidden");
            distElement.textContent = `Titik 1 dipilih: (${lngLat.lng.toFixed(2)}, ${lngLat.lat.toFixed(2)}). Klik titik 2...`;
        }
    } else {
        const secondPoint = { lng: lngLat.lng, lat: lngLat.lat, wkt };
        computeDistance(map, firstPoint, secondPoint, showLoading);
        firstPoint = null; // Reset for next measurement
    }
}

export async function computeDistance(
    map: Map,
    p1: { lng: number; lat: number; wkt: string },
    p2: { lng: number; lat: number; wkt: string },
    showLoading: (show: boolean) => void
): Promise<any> {
    showLoading(true);
    try {
        const response = await fetch("http://127.0.0.1:5000/spatial_computation/distance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                geometry_1: p1.wkt,
                geometry_2: p2.wkt
            })
        });

        const result = await response.json();
        showLoading(false);

        if (result.distance_m !== undefined) {
            const distanceKm = (result.distance_m / 1000).toLocaleString("ID-id", { maximumFractionDigits: 2 });
            const lineGeoJSON = {
                type: "Feature",
                geometry: {
                    type: "LineString",
                    coordinates: [
                        [p1.lng, p1.lat],
                        [p2.lng, p2.lat]
                    ]
                },
                properties: {
                    distance: `${distanceKm} km`
                }
            };

            addDistanceLineLayer(map, lineGeoJSON);

            const distElement = document.getElementById("distance");
            if (distElement) {
                distElement.classList.remove("hidden");
                distElement.textContent = `Jarak Geodesi: ${distanceKm} km (${Math.round(result.distance_m).toLocaleString("ID-id")} m)`;
            }
        }

        return result;
    } catch (err) {
        showLoading(false);
        console.error("Distance Tool Error:", err);
    }
}

export function resetDistanceState(): void {
    firstPoint = null;
}
