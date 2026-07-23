import { geojsonToWKT, wktToGeoJSON } from "@terraformer/wkt";
import { addBufferLayer } from "../layers/vector";
import { computeArea } from "./areaTool";
import { fetchBuffer } from "../services/spatialApi";
import { showToast } from "../utils/toast";
import type { Map } from "maplibre-gl";
import type { FeatureEvent, BufferResponse } from "../types/spatial";

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
): Promise<BufferResponse | undefined> {
    if (showLoading) showLoading(true);
    try {
        const result = await fetchBuffer(wkt, distanceMeter);
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
            if (result.error) {
                showToast(`Gagal membuat buffer: ${result.error}`, 'error');
            }
        }

        return result;
    } catch (err: any) {
        if (showLoading) showLoading(false);
        showToast(`Gagal terhubung ke Spatial Engine: ${err.message || err}`, 'error');
        console.error("Buffer Tool Error:", err);
    }
}
