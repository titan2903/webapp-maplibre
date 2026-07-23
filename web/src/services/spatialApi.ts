import type { AreaResponse, BufferResponse, DistanceResponse, CentroidResponse } from "../types/spatial";

const BASE_URL = (import.meta && import.meta.env && import.meta.env.VITE_SPATIAL_ENGINE_URL) || 'http://127.0.0.1:5000';

async function postJSON<T>(endpoint: string, body: object): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText || response.statusText}`);
    }

    return response.json() as Promise<T>;
}

export async function fetchArea(wkt: string): Promise<AreaResponse> {
    return postJSON<AreaResponse>("/spatial_computation/area", { geometry: wkt });
}

export async function fetchBuffer(wkt: string, distanceMeters: number): Promise<BufferResponse> {
    return postJSON<BufferResponse>("/geometry_manipulation/buffer", {
        geometry: wkt,
        distance_m: distanceMeters
    });
}

export async function fetchDistance(wkt1: string, wkt2: string): Promise<DistanceResponse> {
    return postJSON<DistanceResponse>("/spatial_computation/distance", {
        geometry_1: wkt1,
        geometry_2: wkt2
    });
}

export async function fetchCentroid(wkt: string): Promise<CentroidResponse> {
    return postJSON<CentroidResponse>("/geometry_manipulation/centroid", { geometry: wkt });
}

export async function checkHealth(): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_URL}/spatial_computation/area`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ geometry: "POLYGON((110 -7, 111 -7, 111 -8, 110 -8, 110 -7))" })
        });
        return res.ok;
    } catch {
        return false;
    }
}
