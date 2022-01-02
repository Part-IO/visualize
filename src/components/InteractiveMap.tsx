import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
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
    const layerListLK = useRef<ILKLayerList>();
    const lastDetailedLayer = useRef<L.GeoJSON>();
    const currentAGS = useRef<number>();
    const map = useMap();
    const [getDataRB, setDataRB] = useState<IData>(
        groupBy(GroupBy.AGS)(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(1980))
    );
    const [getDataLK, setDataLK] = useState<IData>(
        groupBy(GroupBy.AGS)(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(1980))
    );

    /**
     * Update Map if the District at the sidebar is clicked
     */
    useEffect(() => {
        geoJsonRef.current?.getLayers().forEach((layer) => {
            if (getDistrict === "Bayern") {
                setLegend("Bundesland - Bayern");
                if (lastDetailedLayer.current !== undefined) {
                    currentAGS.current = undefined;
                    map.removeLayer(lastDetailedLayer.current);
                    lastDetailedLayer.current = undefined;
                }
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
     * Update Data if the year change
     */
    useEffect(() => {
        const groupByAGSFunc = groupBy(GroupBy.AGS);
        setDataRB(groupByAGSFunc(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(getYear)));
        setDataLK(groupByAGSFunc(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(getYear)));
    }, [getYear]);

    /**
     * Colorize the Counties or the Administrative districts based on the relative land consumption
     */
    const colorize = useCallback((feature, baseData: IData) => {
        const data = Object.values(baseData).flat(1);
        const AGS: number = parseInt(feature.properties.AGS);
        let maxValue = -Infinity;
        Object.values(baseData)
            .flat(1)
            .forEach((dataEntry) => {
                const value = dataEntry.used_area_percent;
                maxValue = maxValue < value ? value : maxValue;
            });
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
    }, []);

    /**
     * Render detail map dynamically
     */
    const renderLKMap = useCallback(
        (AGS: number) => {
            if (layerListLK.current !== undefined) {
                if (lastDetailedLayer.current !== undefined) {
                    map.removeLayer(lastDetailedLayer.current);
                    lastDetailedLayer.current = undefined;
                }
                const detailedLayer: L.GeoJSON = layerListLK.current[AGS] as L.GeoJSON;
                detailedLayer.addTo(map);
                lastDetailedLayer.current = detailedLayer;
            }
        },
        [map]
    );
    /**
     * Init functions to build the Detail-Map-Views
     */
    useEffect(() => {
        const data = Object.values(getDataRB).flat(1);
        const dataList: ILKLayerList = {};
        data.forEach((dataEntry) => {
            const firstAGS = dataEntry.AGS;
            const geoJsonLKData = {
                type: "FeatureCollection",
                features: getLKGeoJson.features.filter((f) => {
                    return Math.trunc(Number(f.properties.AGS) / 100) === firstAGS;
                }),
            };
            const geoJsonLKLayer = new L.GeoJSON(geoJsonLKData as FeatureCollection, {
                style: (f) => colorize(f, getDataLK),
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
        layerListLK.current = dataList;

        if (currentAGS.current !== undefined) renderLKMap(currentAGS.current);
    }, [getDataRB, getDataLK, getLKGeoJson, setLegend, colorize, renderLKMap]);

    const onEachFeature = (feature: Feature, layer): void => {
        layer._leaflet_id = feature.properties?.GEN;
        layer.on({
            click: (event) => {
                setLegend(`${feature.properties?.BEZ} - ${feature.properties?.GEN}`);

                geoJsonRef.current?.resetStyle();

                map.flyToBounds(event.target.getBounds(), {
                    duration: 0.5,
                    padding: [10, 10],
                    easeLinearity: 0.1,
                });

                setDistrict(feature.properties?.GEN);
                renderLKMap(parseInt(feature.properties?.AGS));
                currentAGS.current = parseInt(feature.properties?.AGS);
                event.target.bringToBack();
            },
        });
    };

    return (
        <GeoJSON
            data={getRBGeoJson}
            onEachFeature={(f, l) => onEachFeature(f, l)}
            style={(feature) => colorize(feature, getDataRB)}
            ref={geoJsonRef}
        />
    );
};

export default InteractiveMap;
