import { geojsonToWKT, wktToGeoJSON } from "@terraformer/wkt";
import { addCentroidLayer } from "../layers/vector";
import { fetchCentroid } from "../services/spatialApi";
import { showToast } from "../utils/toast";
import type { Map } from "maplibre-gl";
import type { FeatureEvent, CentroidResponse } from "../types/spatial";

export function storeCentroidGeometry(map: Map, event: FeatureEvent, showLoading: (show: boolean) => void): void {
    if (!event.features || event.features.length === 0) return;
    const geometry = event.features[0].geometry;
    const wkt = geojsonToWKT(geometry as any);

    computeCentroid(map, wkt, showLoading);
}

export async function computeCentroid(map: Map, wkt: string, showLoading: (show: boolean) => void): Promise<CentroidResponse | undefined> {
    showLoading(true);
    try {
        const result = await fetchCentroid(wkt);
        showLoading(false);

        if (result.wkt) {
            const data = wktToGeoJSON(result.wkt);
            addCentroidLayer(map, data);

            const centroidElement = document.getElementById("centroid");
            if (centroidElement) {
                centroidElement.classList.remove("hidden");
                const [lng, lat] = data.coordinates;
                centroidElement.textContent = `Centroid Titik Pusat: (${lng.toFixed(4)}, ${lat.toFixed(4)})`;
            }
        } else if (result.error) {
            showToast(`Gagal mencari centroid: ${result.error}`, "error");
        }

        return result;
    } catch (err: any) {
        showLoading(false);
        showToast(`Gagal terhubung ke Spatial Engine: ${err.message || err}`, "error");
        console.error("Centroid Tool Error:", err);
    }
}
