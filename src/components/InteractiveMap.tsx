import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import L, { Layer } from "leaflet";
import { GeoJSON, useMap } from "react-leaflet";
import DataLoader, { GroupBy, groupBy, IDataEntry } from "../utils/DataLoader";
import { Colors, getTint } from "../utils/Colors";
import { Feature, FeatureCollection, GeoJsonProperties } from "geojson";
import regierungsbezirke from "../data/regierungsbezirke.json";
import landkreise from "../data/landkreise.json";
import "../style/InteractiveMap.scss";

interface IData {
    [p: string | number]: IDataEntry[];
}

const InteractiveMap = ({
    getYear,
    getDistrict,
    setDistrict,
    setLegend,
}: {
    getYear: number;
    getDistrict: string;
    setDistrict: Dispatch<SetStateAction<string>>;
    setLegend: Dispatch<SetStateAction<string>>;
}): JSX.Element => {
    const [getRBGeoJson] = useState(regierungsbezirke as FeatureCollection);
    const [getLKGeoJson] = useState(landkreise);
    const [getIDs, setIDs] = useState<number[]>([]);
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

    /**
     * Update Data if the year change
     */
    useEffect(() => {
        setDataRB(groupByAGSFunc(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(getYear)));
        setDataLK(groupByAGSFunc(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(getYear)));
    }, [getYear, groupByAGSFunc]);

    /**
     * Calculate the MaxValue
     */
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

    /**
     * Colorize the Counties or the Administrative districts based on the relative land consumption
     */
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
    (geoJsonRef as RefObject<L.GeoJSON>).current?.on({
        load: (event) => {
            console.log("Load");
        },
    });

    const onEachFeature = useCallback(
        (feature: Feature, layer: Layer): void => {
            layer.on({
                click: (event) => {
                    setLegend(`${feature.properties?.BEZ} - ${feature.properties?.GEN}`);
                    const geoJsonMapObj: L.GeoJSON = (geoJsonRef as RefObject<L.GeoJSON>).current as L.GeoJSON;

                    geoJsonMapObj.resetStyle();
                    geoJsonMapObj.bringToFront();

                    // Select if nothing is selected
                    map.flyToBounds(event.target.getBounds(), {
                        duration: 0.5,
                        padding: [10, 10],
                        easeLinearity: 0.1,
                    });

                    setDistrict(feature.properties?.GEN);

                    event.target.bringToBack();
                },
            });
        },

        [map, setDistrict, setLegend]
    );

    return (
        <>
            <GeoJSON
                data={getLKGeoJson as FeatureCollection}
                style={(feature) => colorize(feature, getDataLK as IData)}
                onEachFeature={(f, l) => {
                    l.on({
                        click: (event) => {
                            setLegend(`${f.properties?.BEZ} - ${f.properties?.GEN}`);
                        },
                    });
                }}
            />
            <GeoJSON
                data={getRBGeoJson}
                onEachFeature={(f, l) => onEachFeature(f, l)}
                style={(feature) => colorize(feature, getDataRB as IData)}
                ref={geoJsonRef}
            />
        </>
    );
};

export default InteractiveMap;
