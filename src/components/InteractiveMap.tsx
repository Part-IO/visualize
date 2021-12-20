import landkreise from "../data/landkreise.json";
import regierungsbezirke from "../data/regierungsbezirke.json";
import { GeoJSON, MapContainer, useMap } from "react-leaflet";
import { Feature, FeatureCollection } from "geojson";
import L, { Browser, Layer } from "leaflet";
import "leaflet/dist/leaflet.css";
import { RefObject, useCallback, useMemo, useRef, useState } from "react";
import DataLoader, { groupBy, GroupBy, IDataEntry } from "../utils/DataLoader";
import { Colors, getTint } from "../utils/Colors";
import { LayerTypes } from "../utils/Helper";

const InteractiveMap: () => JSX.Element = () => {
    const [getRBGeoJson] = useState(regierungsbezirke as FeatureCollection);

    //const [getLKGeoJson] = useState(landkreise as FeatureCollection);

    function GeoContainer({ year }: { year: number }) {
        const geoJsonRef = useRef<L.GeoJSON>(null);
        const map = useMap();
        const groupByAGSFunc = groupBy(GroupBy.AGS);
        const [getDataRB] = useState<{ [p: string | number]: IDataEntry[] }>(
            groupByAGSFunc(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(year))
        );
        const [getDataLK] = useState<{ [p: string | number]: IDataEntry[] }>(
            groupByAGSFunc(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(year))
        );

        const [minRB, maxRB] = useMemo(() => {
            let minValue = Infinity;
            let maxValue = -Infinity;
            Object.values(getDataRB)
                .flat(1)
                .forEach((dataEntry) => {
                    const value = dataEntry.used_area_percent;
                    minValue = minValue > value ? value : minValue;
                    maxValue = maxValue < value ? value : maxValue;
                });
            return [0, maxValue];
        }, [getDataRB]);

        const [minLK, maxLK] = useMemo(() => {
            let minValue = Infinity;
            let maxValue = -Infinity;
            Object.values(getDataLK)
                .flat(1)
                .forEach((dataEntry) => {
                    const value = dataEntry.used_area_percent;
                    minValue = minValue > value ? value : minValue;
                    maxValue = maxValue < value ? value : maxValue;
                });
            return [0, maxValue];
        }, [getDataLK]);

        const colorize = useCallback(
            (feature, layer = LayerTypes.Regierungsbezirk) => {
                const getData: { [p: string | number]: IDataEntry[] } =
                    layer === LayerTypes.Regierungsbezirk ? getDataRB : getDataLK;

                const data = Object.values(getData).flat(1);
                const AGS: number = parseInt(feature.properties.AGS);

                const [minValue, maxValue] = layer === LayerTypes.Regierungsbezirk ? [minRB, maxRB] : [minLK, maxLK];

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
                    color: Colors.White,
                    weight: 1,
                };
            },
            [getDataLK, getDataRB, minLK, minRB, maxLK, maxRB]
        );

        const lastClickedLayer = useRef<Layer>();
        const lastDetailedLayerGroup = useRef<L.LayerGroup>();

        const onEachFeature = useCallback(
            (feature: Feature, layer: Layer, t: LayerTypes): void => {
                layer.on({
                    click: (event) => {
                        const geoJsonMapObj: L.GeoJSON = (geoJsonRef as RefObject<L.GeoJSON>).current as L.GeoJSON;
                        if (lastClickedLayer.current) {
                            geoJsonMapObj.resetStyle(lastClickedLayer.current);
                        }
                        if (lastDetailedLayerGroup.current) {
                            geoJsonMapObj.removeLayer(lastDetailedLayerGroup.current);
                        }
                        if (lastClickedLayer.current === layer || t === LayerTypes.Landkreis) {
                            // Unselect if layer is clicked again
                            map.flyToBounds(geoJsonMapObj.getBounds(), {
                                duration: 0.5,
                                easeLinearity: 0.1,
                                padding: [10, 10],
                                paddingBottomRight: [0, 20],
                            });
                            geoJsonMapObj.resetStyle(lastClickedLayer.current);
                            lastClickedLayer.current = undefined;
                            if (!Browser.ie && !Browser.opera && !Browser.edge) {
                                event.target.bringToBack();
                            }
                        } else {
                            if (t === LayerTypes.Regierungsbezirk) {
                                // Select if nothing is selected
                                lastClickedLayer.current = layer;
                                map.flyToBounds(event.target.getBounds(), {
                                    duration: 0.5,
                                    padding: [50, 50],
                                    easeLinearity: 0.1,
                                });

                                event.target.setStyle({
                                    weight: 5,
                                    color: Colors.Black,
                                });

                                const firstNum = parseInt(feature.properties?.AGS);
                                const selectedLKData = landkreise.features.filter((f) => {
                                    return Math.trunc(Number(f.properties.AGS) / 100) === firstNum;
                                });
                                const newGeoJsonLK = {
                                    type: "FeatureCollection",
                                    features: selectedLKData,
                                };
                                const newGeoJsonLayer = new L.GeoJSON(newGeoJsonLK as FeatureCollection, {
                                    style: (fea) => colorize(fea, LayerTypes.Landkreis),
                                    onEachFeature: (f, l) => onEachFeature(f, l, LayerTypes.Landkreis),
                                });

                                const layerGroup = new L.LayerGroup();
                                layerGroup.addTo(geoJsonMapObj);
                                layerGroup.addLayer(newGeoJsonLayer);
                                lastDetailedLayerGroup.current = layerGroup;

                                if (!Browser.ie && !Browser.opera && !Browser.edge) {
                                    newGeoJsonLayer.bringToFront();
                                }
                            }
                        }
                    },
                });
            },

            [map, colorize]
        );

        return (
            <GeoJSON
                data={getRBGeoJson}
                onEachFeature={(l, f) => onEachFeature(l, f, LayerTypes.Regierungsbezirk)}
                style={(feature) => colorize(feature)}
                ref={geoJsonRef}
            />
        );
    }

    return (
        <MapContainer
            zoomSnap={0}
            zoomDelta={0.25}
            zoom={7.568811741111565}
            center={[49.00380582838273, 11.407993529123203]}
            style={{
                height: "100%",
                width: "100%",
                background: Colors.White,
                border: "2px solid rgba(0,0,0,0.2)",
                borderRadius: "4px",
                backgroundClip: "padding-box",
            }}
            whenCreated={(m: L.Map) => {
                m.fitBounds(m.getBounds(), { padding: [10, 10], paddingBottomRight: [0, 20] });
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
