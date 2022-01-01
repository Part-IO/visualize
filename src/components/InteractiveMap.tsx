import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import L, { LatLngBounds } from "leaflet";
import { GeoJSON, useMap } from "react-leaflet";
import DataLoader, { GroupBy, groupBy, IDataEntry } from "../utils/DataLoader";
import { Colors, getTint } from "../utils/Colors";
import { Feature, FeatureCollection } from "geojson";
import regierungsbezirke from "../data/regierungsbezirke.json";
import landkreise from "../data/landkreise.json";
import "../style/InteractiveMap.scss";

interface IData {
    [p: string | number]: IDataEntry[];
}

interface ILKLayerList {
    [key: number]: L.GeoJSON;
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
    const geoJsonRef = useRef<L.GeoJSON>(null);
    const map = useMap();
    const [getDataRB, setDataRB] = useState<IData>(
        groupBy(GroupBy.AGS)(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(1980))
    );
    const [getDataLK, setDataLK] = useState<IData>(
        groupBy(GroupBy.AGS)(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(1980))
    );
    const [getLKLayerList, setLKLayerList] = useState<ILKLayerList>();

    /**
     * Update Data if the year change
     */
    useEffect(() => {
        const groupByAGSFunc = groupBy(GroupBy.AGS);
        setDataRB(groupByAGSFunc(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(getYear)));
        setDataLK(groupByAGSFunc(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(getYear)));
    }, [getYear]);

    useEffect(() => {
        geoJsonRef.current?.getLayers().forEach((layer) => {
            if (getDistrict === "Bayern") {
                setLegend("Bundesland - Bayern");
                map.flyToBounds(geoJsonRef.current?.getBounds() as LatLngBounds, {
                    duration: 0.5,
                    padding: [10, 10],
                    easeLinearity: 0.1,
                });
                geoJsonRef.current?.bringToFront();
            } else if (geoJsonRef.current?.getLayerId(layer).toString() === getDistrict) {
                layer.fire("click");
            }
        });
    }, [getDistrict, setLegend, map]);

    /**
     * Calculate the MaxValue
     */
    const getMaxValue = useCallback(
        (lk: boolean) => {
            let maxValue = -Infinity;
            Object.values(lk ? getDataLK : getDataRB)
                .flat(1)
                .forEach((dataEntry) => {
                    const value = dataEntry.used_area_percent;
                    maxValue = maxValue < value ? value : maxValue;
                });
            return maxValue;
        },
        [getDataRB, getDataLK]
    );

    const calculatePercentage = useCallback(
        (lk: boolean, feature, maxValue: number) => {
            const data = Object.values(lk ? getDataLK : getDataRB).flat(1);
            const AGS: number = parseInt(feature.properties.AGS);
            return Math.round(
                ((data.find((dataEntry: IDataEntry) => dataEntry.AGS === AGS) as IDataEntry).used_area_percent * 100) /
                    maxValue
            );
        },
        [getDataRB, getDataLK]
    );

    /**
     * Colorize the Counties or the Administrative districts based on the relative land consumption
     */
    const colorize = useCallback(
        (feature, lk: boolean) => {
            const maxValue = getMaxValue(lk);
            const percentage = calculatePercentage(lk, feature, maxValue);

            const color = getTint(Colors.Red, percentage);
            return {
                fillColor: color,
                fillOpacity: 1,
                color: Colors.White,
                weight: 1,
            };
        },
        [getMaxValue, calculatePercentage]
    );

    useEffect(() => {
        const data = Object.values(getDataRB).flat(1);
        const dataList: ILKLayerList = {};
        data.forEach((dataEntry) => {
            const firstAGS = dataEntry.AGS;
            const geoJsonLKData = {
                type: "FeatureCollection",
                features: landkreise.features.filter((f) => {
                    return Math.trunc(Number(f.properties.AGS) / 100) === firstAGS;
                }),
            };
            const geoJsonLKLayer = new L.GeoJSON(geoJsonLKData as FeatureCollection, {
                style: (fea) => colorize(fea, true),
                onEachFeature: (f, l) => {
                    l.on({
                        click: () => {
                            setLegend(`${f.properties?.BEZ} - ${f.properties?.GEN}`);
                        },
                    });
                },
            });
            Object.assign(dataList, { [firstAGS]: geoJsonLKLayer } as ILKLayerList);
        });
        console.log(dataList);
    }, [getDataRB, colorize, setLegend]);

    const onEachFeature = (feature: Feature, layer): void => {
        layer._leaflet_id = feature.properties?.GEN;
        layer.on({
            click: (event) => {
                setLegend(`${feature.properties?.BEZ} - ${feature.properties?.GEN}`);
                const geoJsonMapObj: L.GeoJSON = (geoJsonRef as RefObject<L.GeoJSON>).current as L.GeoJSON;

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
    };

    return (
        <>
            <GeoJSON
                data={getLKGeoJson as FeatureCollection}
                style={(feature) => colorize(feature, true)}
                onEachFeature={(f, l) => {
                    l.on({
                        click: () => {
                            setLegend(`${f.properties?.BEZ} - ${f.properties?.GEN}`);
                        },
                    });
                }}
            />
            <GeoJSON
                data={getRBGeoJson}
                onEachFeature={(f, l) => onEachFeature(f, l)}
                style={(feature) => colorize(feature, false)}
                ref={geoJsonRef}
            />
        </>
    );
};

export default InteractiveMap;
