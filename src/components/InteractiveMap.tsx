import regierungsbezirke from "../data/regierungsbezirke.json";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import { Feature, FeatureCollection } from "geojson";
import { LatLngBoundsLiteral, Layer } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback, useState } from "react";
import L from "leaflet";

interface ICountryStyle {
    fillColor: string;
    fillOpacity: number;
    color: string;
    weight: number;
}

const InteractiveMap: () => JSX.Element = () => {
    const [getGeoJson, setGeoJson] = useState(regierungsbezirke as FeatureCollection);

    const defaultCountryStyle: ICountryStyle = {
        fillColor: "red",
        fillOpacity: 1,
        color: "white",
        weight: 1,
    };
    const selectedFeatureStyle: ICountryStyle = {
        fillColor: "red",
        fillOpacity: 1,
        color: "white",
        weight: 3,
    };

    const getBoundingBox = (data): LatLngBoundsLiteral => {
        const b = { xMin: Infinity, xMax: -Infinity, yMin: Infinity, yMax: -Infinity };
        let coordinates, latitude, longitude;

        const calcLngLat = (): void => {
            b.xMin = b.xMin < longitude ? b.xMin : longitude;
            b.xMax = b.xMax > longitude ? b.xMax : longitude;
            b.yMin = b.yMin < latitude ? b.yMin : latitude;
            b.yMax = b.yMax > latitude ? b.yMax : latitude;
        };

        if (data.hasOwnProperty("features")) {
            // Loop through each "feature"
            for (let i = 0; i < data.features.length; i++) {
                coordinates = data.features[i].geometry.coordinates;

                if (coordinates.length === 1) {
                    // It's only a single Polygon
                    // For each individual coordinate in this feature's coordinates...
                    for (let j = 0; j < coordinates[0].length; j++) {
                        longitude = coordinates[0][j][0];
                        latitude = coordinates[0][j][1];
                        calcLngLat();
                    }
                } else {
                    // It's a MultiPolygon
                    // Loop through each coordinate set
                    for (let j = 0; j < coordinates.length; j++) {
                        // For each individual coordinate in this coordinate set...
                        for (let k = 0; k < coordinates[j][0].length; k++) {
                            longitude = coordinates[j][0][k][0];
                            latitude = coordinates[j][0][k][1];
                            calcLngLat();
                        }
                    }
                }
            }
        } else if (data.geometry) {
            coordinates = data.geometry.coordinates;
            for (let j = 0; j < coordinates[0].length; j++) {
                longitude = coordinates[0][j][0];
                latitude = coordinates[0][j][1];
                calcLngLat();
            }
        }

        // Returns an object that contains the bounds of this GeoJSON data.
        // The keys describe a box formed by the northwest (xMin, yMin) and southeast (xMax, yMax) coordinates.
        return [
            [b.yMin, b.xMax],
            [b.yMax, b.xMin],
        ] as LatLngBoundsLiteral;
    };

    function GeoContainer() {
        const map = useMap();
        const [featureProps, setFeaturePros] = useState<Feature>();

        const onEachFeature = useCallback(
            (feature: Feature, layer: Layer): void => {
                layer.on({
                    click: () => {
                        if ((feature.properties as { [p: string]: any }).selected) {
                            // unselect if click the same
                            //event.target.setStyle(defaultCountryStyle);
                            setFeaturePros(undefined);
                            const data = getGeoJson;
                            data.features.forEach((f: Feature) => {
                                (f.properties as { [p: string]: any }).selected = false;
                            });
                            setGeoJson(data);
                            const center = getBoundingBox(getGeoJson);
                            map.flyToBounds(center, { duration: 0.5, padding: [10, 10] });
                        } else {
                            // Select if nothing is selected
                            //event.target.setStyle(selectedFeatureStyle);
                            setFeaturePros(feature);
                            const data = getGeoJson;
                            data.features.forEach((f: Feature) => {
                                (f.properties as { [p: string]: any }).selected = f === feature;
                            });
                            setGeoJson(data);
                            const center = getBoundingBox(feature);
                            map.flyToBounds(center, { duration: 0.5, padding: [10, 10] });
                        }
                    },
                });
            },
            [map]
        );

        return (
            <>
                <GeoJSON
                    data={getGeoJson}
                    style={(feature) => {
                        if (featureProps) {
                            return featureProps === feature
                                ? selectedFeatureStyle
                                : { ...selectedFeatureStyle, fillOpacity: 0.1 };
                        } else {
                            return selectedFeatureStyle;
                        }
                    }}
                    onEachFeature={onEachFeature}
                />
            </>
        );
    }

    return (
        <MapContainer
            zoomSnap={0}
            zoomDelta={0.25}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(m: L.Map) => {
                const center = getBoundingBox(getGeoJson);
                m.fitBounds(center);
            }}
            zoomAnimation={true}
            fadeAnimation={true}
        >
            <GeoContainer />
        </MapContainer>
    );
};

export default InteractiveMap;
