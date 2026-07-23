import { geojsonToWKT } from "@terraformer/wkt";
import { fetchArea } from "../services/spatialApi";
import { showToast } from "../utils/toast";
import type { FeatureEvent, AreaResponse } from "../types/spatial";

export function storeAreaGeometry(event: FeatureEvent, showLoading?: (show: boolean) => void): void {
    if (!event.features || event.features.length === 0) return;
    const geometry = event.features[0].geometry;
    const wkt = geojsonToWKT(geometry as any);

    computeArea(wkt, showLoading);
}

export async function computeArea(wkt: string, showLoading?: (show: boolean) => void): Promise<AreaResponse | undefined> {
    if (showLoading) showLoading(true);
    try {
        const result = await fetchArea(wkt);
        if (showLoading) showLoading(false);

        if (result.error) {
            showToast(`Gagal menghitung luas: ${result.error}`, 'error');
            return result;
        }

        const output = document.getElementById("luas");
        if (output && result.area_ha !== undefined) {
            output.classList.remove("hidden");
            const formattedHa = result.area_ha.toLocaleString("ID-id", { maximumFractionDigits: 2 });
            output.textContent = `Luas Poligon: ${formattedHa} ${result.unit}`;
        }

        return result;
    } catch (err: any) {
        if (showLoading) showLoading(false);
        showToast(`Gagal terhubung ke Spatial Engine: ${err.message || err}`, 'error');
        console.error("Area Tool Error:", err);
    }
}
