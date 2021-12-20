import landkreise from "../data/landkreise.json";
import { GeoJSON, LayersControl, MapContainer, useMap } from "react-leaflet";
import { Feature, FeatureCollection } from "geojson";
import L, { LatLngBoundsLiteral, Layer, LayersControlEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataLoader, { groupBy, GroupBy, IDataEntry } from "../utils/DataLoader";
import { Colors, getTint } from "../utils/Colors";

const InteractiveMap: () => JSX.Element = () => {
    const [getGeoJson] = useState(landkreise as FeatureCollection);

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

    const [getMapCenter] = useState(getBoundingBox(getGeoJson));

    function GeoContainer({ year }: { year: number }) {
        const geoJsonRef = useRef<L.GeoJSON>(null);
        const geoJsonRefRelative = useRef<L.GeoJSON>(null);
        const map = useMap();
        const groupByAGSFunc = groupBy(GroupBy.AGS);
        const [getData] = useState<{ [p: string | number]: IDataEntry[] }>(
            groupByAGSFunc(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(year))
        );
        const [getRelative, setRelative] = useState<boolean>(true);

        useEffect(() => {
            map.on("baselayerchange", (event: LayersControlEvent) => {
                switch (event.name) {
                    case "100% -> Land mit dem höchsten Flächenverbrauch":
                        setRelative(true);
                        break;
                    case "100% -> 100% FLächenverbrauch":
                        setRelative(false);
                        break;
                }
            });
        }, [map]);

        const [min, max] = useMemo(() => {
            let minValue = Infinity;
            let maxValue = -Infinity;
            Object.values(getData).forEach((dataEntry) => {
                const value = dataEntry[0].used_area_percent;
                minValue = minValue > value ? value : minValue;
                maxValue = maxValue < value ? value : maxValue;
            });
            return [0, maxValue];
        }, [getData]);

        const lastClickedLayer = useRef<Layer>();

        const onEachFeature = useCallback(
            (feature: Feature, layer: Layer): void => {
                layer.on({
                    click: (event) => {
                        if (lastClickedLayer) {
                            (geoJsonRef as RefObject<L.GeoJSON>).current?.resetStyle(lastClickedLayer.current);
                        }
                        if (lastClickedLayer.current === layer) {
                            (geoJsonRef as RefObject<L.GeoJSON>).current?.resetStyle(event.target);
                            lastClickedLayer.current = undefined;
                            map.flyToBounds(getMapCenter, { duration: 0.5, padding: [10, 10] });
                            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                                event.target.bringToFront();
                            }
                        } else {
                            // Select if nothing is selected
                            event.target.setStyle({
                                ...event.target.style,
                                weight: 5,
                            });
                            lastClickedLayer.current = layer;
                            map.flyToBounds(event.target.getBounds(), { duration: 0.5, padding: [10, 10] });
                            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                                event.target.bringToFront();
                            }
                        }
                    },
                });
            },
            [map]
        );
        const colorize = useCallback(
            (feature) => {
                const [minValue, maxValue] = getRelative ? [min, max] : [0, 1];
                const data = Object.values(getData).flat(1);
                const AGS: number = parseInt(feature.properties.AGS);

                const percentage = Math.round(
                    (((data.find((dataEntry: IDataEntry) => dataEntry.AGS === AGS) as IDataEntry).used_area_percent -
                        minValue) *
                        100) /
                        (maxValue - minValue)
                );

                const color = getTint(Colors.Red, percentage);
                return {
                    fillColor: color,
                    fillOpacity: 1,
                    color: "white",
                    weight: 1,
                };
            },
            [getData, getRelative, max, min]
        );

        return (
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name={"100% -> Land mit dem höchsten Flächenverbrauch"}>
                    <GeoJSON
                        data={getGeoJson}
                        onEachFeature={onEachFeature}
                        style={(feature) => colorize(feature)}
                        ref={geoJsonRefRelative}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name={"100% -> 100% FLächenverbrauch"}>
                    <GeoJSON
                        data={getGeoJson}
                        onEachFeature={onEachFeature}
                        style={(feature) => colorize(feature)}
                        ref={geoJsonRef}
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
        );
    }

    return (
        <MapContainer
            zoomSnap={0}
            zoomDelta={0.25}
            style={{
                height: "100%",
                width: "100%",
                background: Colors.White,
                border: "2px solid rgba(0,0,0,0.2)",
                borderRadius: "4px",
                backgroundClip: "padding-box",
            }}
            whenCreated={(m: L.Map) => {
                m.fitBounds(getMapCenter);
                m.setMinZoom(m.getZoom());
                m.invalidateSize();
            }}
            zoomAnimation={true}
            fadeAnimation={true}
        >
            <GeoContainer year={1980} />
        </MapContainer>
    );
};

export default InteractiveMap;
