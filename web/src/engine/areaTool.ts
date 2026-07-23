import { geojsonToWKT } from "@terraformer/wkt";
import type { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";

type FeatureEvent = MapMouseEvent & {
    features?: MapGeoJSONFeature[];
};

export function storeAreaGeometry(event: FeatureEvent, showLoading?: (show: boolean) => void): void {
    if (!event.features || event.features.length === 0) return;
    const geometry = event.features[0].geometry;
    const wkt = geojsonToWKT(geometry as any);

    computeArea(wkt, showLoading);
}

export async function computeArea(wkt: string, showLoading?: (show: boolean) => void): Promise<any> {
    if (showLoading) showLoading(true);
    try {
        const response = await fetch("http://127.0.0.1:5000/spatial_computation/area", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ geometry: wkt })
        });

        const result = await response.json();
        if (showLoading) showLoading(false);

        const output = document.getElementById("luas");
        if (output && result.area_ha !== undefined) {
            output.classList.remove("hidden");
            output.textContent = `Luas Poligon: ${result.area_ha.toLocaleString("ID-id", { maximumFractionDigits: 2 })} ${result.unit}`;
        }

        return result;
    } catch (err) {
        if (showLoading) showLoading(false);
        console.error("Area Tool Error:", err);
    }
}
