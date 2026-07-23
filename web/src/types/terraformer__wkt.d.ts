declare module "@terraformer/wkt" {
    export function geojsonToWKT(geojson: any): string;
    export function wktToGeoJSON(wkt: string): any;
}
