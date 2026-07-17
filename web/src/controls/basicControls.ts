import { AttributionControl, Map } from "maplibre-gl";

export function addAttribution(map: Map, att: string): void {
    map.addControl(new AttributionControl({
        compact: true,
        customAttribution: att
    }));
}
