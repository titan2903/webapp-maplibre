import type { MapGeoJSONFeature, MapMouseEvent } from "maplibre-gl";

export interface AreaResponse {
    area_ha?: number;
    unit?: string;
    geometry_type?: string;
    error?: string;
}

export interface BufferResponse {
    wkt?: string;
    input_geometry_type?: string;
    output_geometry_type?: string;
    error?: string;
}

export interface DistanceResponse {
    distance_m?: number;
    unit?: string;
    nearest_point_1?: { lon: number; lat: number };
    nearest_point_2?: { lon: number; lat: number };
    geometry_1_type?: string;
    geometry_2_type?: string;
    error?: string;
}

export interface CentroidResponse {
    wkt?: string;
    input_geometry_type?: string;
    output_geometry_type?: string;
    error?: string;
}

export type FeatureEvent = MapMouseEvent & {
    features?: MapGeoJSONFeature[];
};

export type AnalysisToolType = 'buffer' | 'area' | 'distance' | 'centroid';
