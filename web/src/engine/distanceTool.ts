import { geojsonToWKT } from "@terraformer/wkt";
import { addDistanceLineLayer } from "../layers/vector";
import { fetchDistance } from "../services/spatialApi";
import { showToast } from "../utils/toast";
import type { Map } from "maplibre-gl";
import type { FeatureEvent, DistanceResponse } from "../types/spatial";

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
        showToast("Titik 1 terpilih. Klik titik kedua pada peta untuk mengukur jarak.", "info");
    } else {
        const secondPoint = { lng: lngLat.lng, lat: lngLat.lat, wkt };
        computeDistance(map, firstPoint, secondPoint, showLoading);
        firstPoint = null;
    }
}

export async function computeDistance(
    map: Map,
    p1: { lng: number; lat: number; wkt: string },
    p2: { lng: number; lat: number; wkt: string },
    showLoading: (show: boolean) => void
): Promise<DistanceResponse | undefined> {
    showLoading(true);
    try {
        const result = await fetchDistance(p1.wkt, p2.wkt);
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
        } else if (result.error) {
            showToast(`Gagal menghitung jarak: ${result.error}`, "error");
        }

        return result;
    } catch (err: any) {
        showLoading(false);
        showToast(`Gagal terhubung ke Spatial Engine: ${err.message || err}`, "error");
        console.error("Distance Tool Error:", err);
    }
}

export function resetDistanceState(): void {
    firstPoint = null;
}
