import { describe, it } from 'node:test';
import assert from 'node:assert';
import { geojsonToWKT, wktToGeoJSON } from '@terraformer/wkt';

describe('Spatial Data Conversion Service', function () {
    describe('GeoJSON to WKT Conversion', function () {
        it('When a Point GeoJSON is passed, then it returns valid WKT Point string', () => {
            const pointGeoJSON = {
                type: "Point",
                coordinates: [110.3644, -7.7956]
            };
            const wkt = geojsonToWKT(pointGeoJSON as any);

            assert.strictEqual(typeof wkt, 'string');
            assert.ok(wkt.includes('POINT'));
            assert.ok(wkt.includes('110.3644'));
            assert.ok(wkt.includes('-7.7956'));
        });

        it('When a Polygon GeoJSON is passed, then it returns valid WKT Polygon string', () => {
            const polygonGeoJSON = {
                type: "Polygon",
                coordinates: [[[110, -7], [111, -7], [111, -8], [110, -8], [110, -7]]]
            };
            const wkt = geojsonToWKT(polygonGeoJSON as any);

            assert.strictEqual(typeof wkt, 'string');
            assert.ok(wkt.includes('POLYGON'));
        });
    });

    describe('WKT to GeoJSON Conversion', function () {
        it('When a WKT Point string is passed, then it converts back to GeoJSON Point object', () => {
            const wktPoint = "POINT (110.36 -7.79)";
            const geojson = wktToGeoJSON(wktPoint);

            assert.strictEqual(geojson.type, 'Point');
            assert.strictEqual(geojson.coordinates[0], 110.36);
            assert.strictEqual(geojson.coordinates[1], -7.79);
        });

        it('When a WKT Polygon string is passed, then it converts back to GeoJSON Polygon object', () => {
            const wktPolygon = "POLYGON ((110 -7, 111 -7, 111 -8, 110 -8, 110 -7))";
            const geojson = wktToGeoJSON(wktPolygon);

            assert.strictEqual(geojson.type, 'Polygon');
            assert.ok(Array.isArray(geojson.coordinates));
        });
    });
});
