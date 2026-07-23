import { geojsonToWKT } from "@terraformer/wkt";
import type { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";

type FeatureEvent = MapMouseEvent & {
    features?: MapGeoJSONFeature[];
};

export function storeAreaGeometry(event: FeatureEvent): void {
    if (!event.features || event.features.length === 0) return;
    const geometry = event.features[0].geometry;
    const wkt = geojsonToWKT(geometry as any);

    computeArea(wkt);
}

export async function computeArea(wkt: string): Promise<any> {
    const response = await fetch("http://127.0.0.1:5000/spatial_computation/area", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geometry: wkt })
    });

    const result = await response.json();

    const output = document.getElementById("luas");
    if (output && result.area_ha !== undefined) {
        output.textContent = `${result.area_ha.toLocaleString("ID-id")} ${result.unit}`;
    }

    return result;
}
