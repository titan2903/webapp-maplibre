import { geojsonToWKT, wktToGeoJSON } from "@terraformer/wkt";
import { addBufferLayer } from "../layers/vector";
import { computeArea } from "./areaTool";
import type { Map, MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";

type FeatureEvent = MapMouseEvent & {
    features?: MapGeoJSONFeature[];
};

export function storeBufferGeometry(map: Map, event: FeatureEvent): void {
    if (!event.features || event.features.length === 0) return;
    const geometry = event.features[0].geometry;
    const wkt = geojsonToWKT(geometry as any);

    computeBuffer(map, wkt);
}

export async function computeBuffer(map: Map, wkt: string): Promise<any> {
    const response = await fetch("http://127.0.0.1:5000/geometry_manipulation/buffer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            geometry: wkt,
            distance_m: 1000000
        })
    });

    const result = await response.json();
    if (result.wkt) {
        const data = wktToGeoJSON(result.wkt);
        addBufferLayer(map, data);

        const areaResult = await computeArea(result.wkt);

        const output = document.getElementById("buffer");
        if (output && areaResult && areaResult.area_ha !== undefined) {
            output.textContent = `Luas Buffer: ${areaResult.area_ha.toLocaleString("ID-id")} ${areaResult.unit}`;
        }
    }

    return result;
}
