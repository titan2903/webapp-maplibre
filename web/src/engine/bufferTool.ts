import { geojsonToWKT, wktToGeoJSON } from "@terraformer/wkt";
import { addBufferLayer } from "../layers/vector";
import { computeArea } from "./areaTool";
import type { Map, MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";

type FeatureEvent = MapMouseEvent & {
    features?: MapGeoJSONFeature[];
};

export function storeBufferGeometry(
    map: Map,
    event: FeatureEvent,
    distanceMeter: number = 1000000,
    showLoading?: (show: boolean) => void
): void {
    if (!event.features || event.features.length === 0) return;
    const geometry = event.features[0].geometry;
    const wkt = geojsonToWKT(geometry as any);

    computeBuffer(map, wkt, distanceMeter, showLoading);
}

export async function computeBuffer(
    map: Map,
    wkt: string,
    distanceMeter: number = 1000000,
    showLoading?: (show: boolean) => void
): Promise<any> {
    if (showLoading) showLoading(true);
    try {
        const response = await fetch("http://127.0.0.1:5000/geometry_manipulation/buffer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                geometry: wkt,
                distance_m: distanceMeter
            })
        });

        const result = await response.json();
        if (result.wkt) {
            const data = wktToGeoJSON(result.wkt);
            addBufferLayer(map, data);

            const areaResult = await computeArea(result.wkt);

            if (showLoading) showLoading(false);

            const output = document.getElementById("buffer");
            if (output && areaResult && areaResult.area_ha !== undefined) {
                output.classList.remove("hidden");
                const formattedHa = areaResult.area_ha.toLocaleString("ID-id", { maximumFractionDigits: 2 });
                const distKm = (distanceMeter / 1000).toLocaleString("ID-id");
                output.textContent = `Buffer (${distKm} km): ${formattedHa} ${areaResult.unit}`;
            }
        } else {
            if (showLoading) showLoading(false);
        }

        return result;
    } catch (err) {
        if (showLoading) showLoading(false);
        console.error("Buffer Tool Error:", err);
    }
}
