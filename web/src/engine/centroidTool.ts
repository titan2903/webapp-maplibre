import { geojsonToWKT, wktToGeoJSON } from "@terraformer/wkt";
import { addCentroidLayer } from "../layers/vector";
import type { Map, MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";

type FeatureEvent = MapMouseEvent & {
    features?: MapGeoJSONFeature[];
};

export function storeCentroidGeometry(map: Map, event: FeatureEvent, showLoading: (show: boolean) => void): void {
    if (!event.features || event.features.length === 0) return;
    const geometry = event.features[0].geometry;
    const wkt = geojsonToWKT(geometry as any);

    computeCentroid(map, wkt, showLoading);
}

export async function computeCentroid(map: Map, wkt: string, showLoading: (show: boolean) => void): Promise<any> {
    showLoading(true);
    try {
        const response = await fetch("http://127.0.0.1:5000/geometry_manipulation/centroid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ geometry: wkt })
        });

        const result = await response.json();
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
        }

        return result;
    } catch (err) {
        showLoading(false);
        console.error("Centroid Tool Error:", err);
    }
}
