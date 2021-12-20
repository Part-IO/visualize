import regierungsbezirke from "../data/regierungsbezirke.json";
import landkreise from "../data/landkreise.json";
import { GeoJSON, MapContainer, useMap, LayersControl } from "react-leaflet";
import { Feature, FeatureCollection } from "geojson";
import L, { LatLngBoundsLiteral, Layer } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback, useState } from "react";
import DataLoader, { GroupBy, IDataEntry } from "../utils/DataLoader";
import { Colors, getTint } from "../utils/Colors";

const InteractiveMap: () => JSX.Element = () => {
    const [getGeoJson, setGeoJson] = useState(landkreise as FeatureCollection);

    const getBoundingBox = (data): LatLngBoundsLiteral => {
        let coordinates, latitude, longitude;
        const latList: number[] = [];
        const longList: number[] = [];

        // Loop through each "feature"
        for (let i = 0; i < data.features.length; i++) {
            coordinates = data.features[i].geometry.coordinates;

            if (coordinates.length === 1) {
                // It's only a single Polygon
                // For each individual coordinate in this feature's coordinates...
                for (let j = 0; j < coordinates[0].length; j++) {
                    longitude = coordinates[0][j][0];
                    latitude = coordinates[0][j][1];
                    latList.push(latitude);
                    longList.push(longitude);
                }
            } else {
                // It's a MultiPolygon
                // Loop through each coordinate set
                for (let j = 0; j < coordinates.length; j++) {
                    // For each individual coordinate in this coordinate set...
                    for (let k = 0; k < coordinates[j][0].length; k++) {
                        longitude = coordinates[j][0][k][0];
                        latitude = coordinates[j][0][k][1];
                        latList.push(latitude);
                        longList.push(longitude);
                    }
                }
            }
        }

        // Returns an object that contains the bounds of this GeoJSON data.
        // The keys describe a box formed by the northwest (xMin, yMin) and southeast (xMax, yMax) coordinates.
        return [
            [latList.sort((a, c) => a - c)[0], longList.sort((a, c) => c - a)[0]],
            [latList.sort((a, c) => c - a)[0], longList.sort((a, c) => a - c)[0]],
        ] as LatLngBoundsLiteral;
    };

    function GeoContainer() {
        const map = useMap();
        const [featureProps, setFeaturePros] = useState<Feature>();

        const onEachFeature = useCallback(
            (feature: Feature, layer: Layer): void => {
                layer.on({
                    click: (event) => {
                        if ((feature.properties as { [p: string]: string | number | boolean | null }).selected) {
                            // unselect if click the same
                            //event.target.setStyle(defaultCountryStyle);
                            setFeaturePros(undefined);
                            const data = getGeoJson;
                            data.features.forEach((f: Feature) => {
                                (f.properties as { [p: string]: string | number | boolean | null }).selected = false;
                            });
                            setGeoJson(data);
                            const center = getBoundingBox(getGeoJson);
                            map.flyToBounds(center, { duration: 0.5, padding: [10, 10] });
                            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                                event.target.bringToBack();
                            }
                        } else {
                            // Select if nothing is selected
                            //event.target.setStyle(selectedFeatureStyle);
                            setFeaturePros(feature);
                            const data = getGeoJson;
                            data.features.forEach((f: Feature) => {
                                (f.properties as { [p: string]: string | number | boolean | null }).selected =
                                    f === feature;
                            });
                            setGeoJson(data);
                            const center = event.target.getBounds();
                            map.flyToBounds(center, { duration: 0.5, padding: [10, 10] });
                            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                                event.target.bringToFront();
                            }
                        }
                    },
                });
            },
            [map]
        );

        function colorize(feature, relative = true) {
            const currentDate = 1980;
            const data: { [p: string]: IDataEntry[] } = new DataLoader(GroupBy.AGS).GetGovernmentDistricts();

            function parseDate(input) {
                const parts = input.match(/(\d+)/g);
                // note parts[1]-1
                return new Date(parts[2], parts[1] - 1, parts[0]);
            }

            const usedAreaMinMax = () => {
                const keys: string[] = Object.keys(data);
                let minValue = Infinity;
                let maxValue = -Infinity;
                keys.forEach((key: string) => {
                    const value = (
                        data[key].find(
                            (entry: IDataEntry) => parseDate(entry.date).getFullYear() === currentDate
                        ) as IDataEntry
                    ).used_area_percent;
                    minValue = minValue > value ? value : minValue;
                    maxValue = maxValue < value ? value : maxValue;
                });
                return [0, maxValue];
            };

            const [min, max] = relative ? usedAreaMinMax() : [0, 1];

            const percentage: number = Math.round(
                (((
                    data[parseInt(feature.properties.AGS).toString()].find(
                        (entry: IDataEntry) => parseDate(entry.date).getFullYear() === currentDate
                    ) as IDataEntry
                ).used_area_percent -
                    min) *
                    100) /
                    (max - min)
            );

            const color = getTint(Colors.Red, percentage);
            return {
                fillColor: color,
                fillOpacity: 1,
                color: "white",
                weight: 1,
            };
        }

        return (
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name={"100% -> Land mit dem höchsten Flächenverbrauch"}>
                    <GeoJSON
                        data={getGeoJson}
                        style={(feature) => {
                            if (featureProps) {
                                return featureProps === feature
                                    ? { ...colorize(feature), weight: 5, color: Colors.Black }
                                    : { ...colorize(feature), fillOpacity: 0.2 };
                            } else {
                                return colorize(feature);
                            }
                        }}
                        onEachFeature={onEachFeature}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name={"100% -> 100% FLächenverbrauch"}>
                    <GeoJSON
                        data={getGeoJson}
                        style={(feature) => {
                            if (featureProps) {
                                return featureProps === feature
                                    ? colorize(feature, false)
                                    : { ...colorize(feature, false), fillOpacity: 0.7 };
                            } else {
                                return colorize(feature, false);
                            }
                        }}
                        onEachFeature={onEachFeature}
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
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
