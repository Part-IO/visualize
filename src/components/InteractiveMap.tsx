import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import L, { Browser, Layer } from "leaflet";
import { GeoJSON, useMap } from "react-leaflet";
import DataLoader, { GroupBy, groupBy, IDataEntry } from "../utils/DataLoader";
import { LayerTypes } from "../utils/Helper";
import { Colors, getTint } from "../utils/Colors";
import { Feature, FeatureCollection } from "geojson";
import regierungsbezirke from "../data/regierungsbezirke.json";
import landkreise from "../data/landkreise.json";

interface IData {
    [p: string | number]: IDataEntry[];
}

const InteractiveMap = ({
    getYear,
    getDistrict,
    setDistrict,
}: {
    getYear: number;
    getDistrict: string;
    setDistrict: Dispatch<SetStateAction<string>>;
}): JSX.Element => {
    const [getRBGeoJson] = useState(regierungsbezirke as FeatureCollection);
    const [getLKGeoJson] = useState(landkreise);
    const geoJsonRef = useRef<L.GeoJSON>(null);
    const map = useMap();

    const groupByAGSFunc = useMemo(() => {
        return groupBy(GroupBy.AGS);
    }, []);
    const [getDataRB, setDataRB] = useState<IData>(
        groupByAGSFunc(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(1980))
    );
    const [getDataLK, setDataLK] = useState<IData>(
        groupByAGSFunc(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(1980))
    );

    useEffect(() => {
        const gr = groupBy(GroupBy.AGS);
        setDataRB(groupByAGSFunc(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(getYear)));
        setDataLK(groupByAGSFunc(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(getYear)));
    }, [getYear, groupByAGSFunc]);

    const getMaxValue = useCallback((getData: IData) => {
        let maxValue = -Infinity;
        Object.values(getData as IData)
            .flat(1)
            .forEach((dataEntry) => {
                const value = dataEntry.used_area_percent;
                maxValue = maxValue < value ? value : maxValue;
            });
        return maxValue;
    }, []);

    const colorize = useCallback(
        (feature, getData: IData) => {
            const data = Object.values(getData).flat(1);
            const AGS: number = parseInt(feature.properties.AGS);

            const maxValue = getMaxValue(getData);

            const percentage = Math.round(
                ((data.find((dataEntry: IDataEntry) => dataEntry.AGS === AGS) as IDataEntry).used_area_percent * 100) /
                    maxValue
            );

            const color = getTint(Colors.Red, percentage);
            return {
                fillColor: color,
                fillOpacity: 1,
                color: Colors.White,
                weight: 1,
            };
        },
        [getMaxValue]
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
                            setDistrict(feature.properties?.GEN);
                            // Select if nothing is selected
                            lastClickedLayer.current = layer;
                            map.flyToBounds(event.target.getBounds(), {
                                duration: 0.5,
                                padding: [10, 10],
                                easeLinearity: 0.1,
                            });

                            event.target.setStyle({
                                weight: 5,
                                color: Colors.Black,
                            });

                            const firstNum = parseInt(feature.properties?.AGS);
                            const selectedLKData = getLKGeoJson.features.filter((f) => {
                                return Math.trunc(Number(f.properties.AGS) / 100) === firstNum;
                            });
                            const newGeoJsonLK = {
                                type: "FeatureCollection",
                                features: selectedLKData,
                            };
                            const newGeoJsonLayer = new L.GeoJSON(newGeoJsonLK as FeatureCollection, {
                                style: (fea) => colorize(fea, getDataLK as IData),
                                onEachFeature: (f, l) => onEachFeature(f, l, LayerTypes.Landkreis),
                            });

                            const layerGroup = new L.LayerGroup();
                            layerGroup.addTo(geoJsonMapObj);
                            layerGroup.addLayer(newGeoJsonLayer);
                            lastDetailedLayerGroup.current = layerGroup;

                            if (!Browser.ie && !Browser.opera && !Browser.edge) {
                                event.target.bringToFront();
                                newGeoJsonLayer.bringToFront();
                            }
                        }
                    }
                },
            });
        },

        [map, colorize, getLKGeoJson, setDistrict, getDataLK]
    );

    return (
        <GeoJSON
            data={getRBGeoJson}
            onEachFeature={(l, f) => onEachFeature(l, f, LayerTypes.Regierungsbezirk)}
            style={(feature) => colorize(feature, getDataRB as IData)}
            ref={geoJsonRef}
        />
    );
};

export default InteractiveMap;
