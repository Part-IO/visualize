import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef } from "react";
import L, { LatLngBounds } from "leaflet";
import { GeoJSON, useMap } from "react-leaflet";
import { Feature, FeatureCollection } from "geojson";
import regierungsbezirke from "../data/regierungsbezirke.json";
import landkreise from "../data/landkreise.json";
import { ICLickedLK } from "./MainComponent";
import { IData } from "../utils/Helper";
import RBDataYear from "../data/RBYear.json";
import LKDataYear from "../data/LKYear.json";

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
    const geoJsonRef = useRef<L.GeoJSON>(null);
    const lastDetailedLayer = useRef<L.GeoJSON>();
    const currentAGS = useRef<number>();
    const LKGeoData = useMemo(() => {
        return landkreise;
    }, []);

    const map = useMap();
    map.zoomControl.setPosition("topright");

    const getDataRB: IData = useMemo(() => {
        return RBDataYear[`31.12.${getYear}`].reduce((obj, item) => Object.assign(obj, { [item.AGS]: [item] }), {});
    }, [getYear]);

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
     * Build detail layer for clicked district
     */
    const detailedLayer: L.GeoJSON = useMemo(() => {
        const data = RBDataYear[`31.12.${getYear}`];
        let interDetailedLayer;
        data.forEach((dataEntry) => {
            if (dataEntry.AGS === currentAGS.current) {
                const firstAGS = dataEntry.AGS;
                const geoJsonLKData = {
                    type: "FeatureCollection",
                    features: LKGeoData.features.filter((f) => {
                        return Math.trunc(Number(f.properties.AGS) / 100) === firstAGS;
                    }),
                };
                const selectedLKData = LKDataYear[`31.12.${getYear}`].reduce((obj, item) => {
                    if (Math.trunc(Number(item.AGS) / 100) === firstAGS) {
                        Object.assign(obj, { [item.AGS]: [item] });
                    }
                    return obj;
                }, {});
                interDetailedLayer = new L.GeoJSON(geoJsonLKData as FeatureCollection, {
                    style: (f) => colorize(f, selectedLKData),
                    onEachFeature: (f, l) => {
                        l.on({
                            click: () => {
                                setClickedLK({
                                    BEZ: f.properties?.BEZ,
                                    GEN: f.properties?.GEN,
                                    AGS: f.properties?.AGS,
                                });
                            },
                        });
                    },
                });
            }
        });
        return interDetailedLayer;
    }, [LKGeoData, colorize, getYear, setClickedLK]);

    /**
     * Update Map if the District at the sidebar is clicked
     */
    useEffect(() => {
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
        } else {
            geoJsonRef.current?.getLayers().forEach((layer) => {
                if (geoJsonRef.current?.getLayerId(layer).toString() === getDistrict) {
                    layer.fire("click");
                }
            });
        }
    }, [getDistrict, setClickedLK, map]);

    /**
     * Update view if year change or other district is clicked
     */
    useEffect(() => {
        if (currentAGS.current !== undefined) {
            if (lastDetailedLayer.current !== undefined) {
                map.removeLayer(lastDetailedLayer.current);
                lastDetailedLayer.current = undefined;
            }
            if (detailedLayer) {
                detailedLayer.addTo(map);
                lastDetailedLayer.current = detailedLayer;
            }
        }
    });

    /**
     * Add click function to the administrative districts of the map
     * @param feature
     * @param layer
     */
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
                currentAGS.current = parseInt(feature.properties?.AGS);
            },
        });
    };
    return (
        <GeoJSON
            data={regierungsbezirke as FeatureCollection}
            onEachFeature={(f, l) => onEachFeature(f, l)}
            style={(feature) => colorize(feature, getDataRB)}
            ref={geoJsonRef}
        />
    );
};

export default InteractiveMap;
