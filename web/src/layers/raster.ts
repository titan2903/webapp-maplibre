import { Map } from 'maplibre-gl';

export function addMonasImage(map: Map): void {
    // Layer raster
    map.addSource("monas", {
        type: "image",
        url: "https://upload.wikimedia.org/wikipedia/id/b/b1/Merdeka_Square_Monas_02.jpg",
        coordinates: [
            [107.44, -5.691], // top-left
            [110.16, -6.32], // top-right
            [111.11, -9.34], // bottom-right
            [106.38, -9.14] // bottom-left
        ]
    });

    map.addLayer({
        id: "monas-image",
        type: "raster",
        source: "monas",
    });
}
