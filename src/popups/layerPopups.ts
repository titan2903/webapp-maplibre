import { Popup, type Map, type MapMouseEvent, type MapGeoJSONFeature } from "maplibre-gl";

const popup = new Popup();

type FeatureEvent = MapMouseEvent & {
    features?: MapGeoJSONFeature[];
};

export function addKotaPopup(map: Map, event: FeatureEvent): Popup | undefined {
    if (!event.features || event.features.length === 0) return;
    
    const coordinate = event.lngLat;
    const longitude = coordinate.lng.toFixed(2);
    const latitude = coordinate.lat.toFixed(2);

    const properties = event.features[0].properties;
    const cityName = properties.NAME;

    console.log(properties);

    return popup
        .setLngLat(event.lngLat)
        .setHTML(`
            <div>
                <h3>${cityName}</h3>
                <div>Bujur: ${longitude}</div>
                <div>Lintang: ${latitude}</div>
            </div>    
        `)
        .addTo(map);
}
