import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import L, { LatLngBounds } from "leaflet";
import { GeoJSON, useMap } from "react-leaflet";
import { Feature, FeatureCollection } from "geojson";
import regierungsbezirke from "../data/regierungsbezirke.json";
import landkreise from "../data/landkreise.json";
import { extend } from "colord";
import mixPlugin from "colord/plugins/mix";
import { ICLickedLK } from "./MainComponent";
import { IData } from "../utils/Helper";
import RBDataYear from "../data/RBYear.json";
import LKDataYear from "../data/LKYear.json";

extend([mixPlugin]);

const InteractiveMap = ({
    getDistrict,
    setDistrict,
    setClickedLK,
    getYear,
    redColors,
}: {
    getDistrict: string;
    setDistrict: Dispatch<SetStateAction<string>>;
    setClickedLK: Dispatch<SetStateAction<ICLickedLK>>;
    getYear: number;
    redColors: string[];
}): JSX.Element => {
    const [getRBGeoJson] = useState(regierungsbezirke as FeatureCollection);
    const [getLKGeoJson] = useState(landkreise);
    const geoJsonRef = useRef<L.GeoJSON>(null);
    const layerListLK = useRef<Map<number, L.GeoJSON>>();
    const lastDetailedLayer = useRef<L.GeoJSON>();
    const currentAGS = useRef<number>();

    const map = useMap();

    useEffect(() => {
        map.zoomControl.setPosition("topright");
    });

    const getDataRB: IData = useMemo(() => {
        return RBDataYear[`31.12.${getYear}`].reduce((obj, item) => Object.assign(obj, { [item.AGS]: [item] }), {});
    }, [getYear]);
    const getDataLK: IData = useMemo(() => {
        return LKDataYear[`31.12.${getYear}`].reduce((obj, item) => Object.assign(obj, { [item.AGS]: [item] }), {});
    }, [getYear]);

    /**
     * Update Map if the District at the sidebar is clicked
     */
    useEffect(() => {
        geoJsonRef.current?.getLayers().forEach((layer) => {
            if (getDistrict === "Bayern") {
                setClickedLK({ BEZ: "Bundesland", GEN: "Bayern", AGS: "09" });
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
            } else if (geoJsonRef.current?.getLayerId(layer).toString() === getDistrict) {
                layer.fire("click");
            }
        });
    }, [getDistrict, setClickedLK, map]);

    /**
     * Colorize the Counties or the Administrative districts based on the relative land consumption
     */
    const colorize = useCallback(
        (feature, baseData: IData) => {
            const AGS: number = parseInt(feature.properties.AGS);
            const percentage = Math.round(baseData[AGS][0].used_area_percent * 100);
            return {
                fillColor: redColors[Math.trunc(percentage) - 1],
                fillOpacity: 1,
                color: "var(--color-white)",
                weight: 1,
            };
        },
        [redColors]
    );

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
                const detailedLayer: L.GeoJSON = layerListLK.current.get(AGS) as L.GeoJSON;
                detailedLayer.addTo(map);
                lastDetailedLayer.current = detailedLayer;
            }
        },
        [map]
    );
    /**
     * Init functions to build the Detail-Map-Views
     * Only 1 run on init
     */
    useEffect(() => {
        const data = Object.values(getDataRB).flat(1);
        const dataList = new Map<number, L.GeoJSON>();
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
                            setClickedLK({ BEZ: f.properties?.BEZ, GEN: f.properties?.GEN, AGS: f.properties?.AGS });
                        },
                    });
                },
            });
            dataList.set(firstAGS, geoJsonLKLayer);
        });
        layerListLK.current = dataList;
    });

    const onEachFeature = (feature: Feature, layer): void => {
        layer._leaflet_id = feature.properties?.GEN;
        layer.on({
            click: (event) => {
                setClickedLK({
                    BEZ: feature.properties?.BEZ,
                    GEN: feature.properties?.GEN,
                    AGS: feature.properties?.AGS,
                });

                map.flyToBounds(event.target.getBounds(), {
                    duration: 0.5,
                    padding: [10, 10],
                    easeLinearity: 0.1,
                });

                setDistrict(feature.properties?.GEN);
                renderLKMap(parseInt(feature.properties?.AGS));
                currentAGS.current = parseInt(feature.properties?.AGS);
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
