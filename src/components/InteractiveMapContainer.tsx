import { MapContainer, TileLayer } from "react-leaflet";
import L, { TileLayer as LeafletTileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import InteractiveMap from "./InteractiveMap";
import { IData } from "../utils/DataLoader";

const InteractiveMapContainer = ({
    getDistrict,
    setDistrict,
    getDataRB,
    getDataLK,
    isDark,
}: {
    getDistrict: string;
    getDataLK: IData;
    getDataRB: IData;
    setDistrict: Dispatch<SetStateAction<string>>;
    isDark: boolean;
}): JSX.Element => {
    const [getLegend, setLegend] = useState<string>("");
    const tileRef = useRef(null);
    const dark = "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
    const light = "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";

    useEffect(() => {
        if (tileRef.current) {
            (tileRef.current as LeafletTileLayer).setUrl(isDark ? dark : light);
        }
    }, [isDark]);

    return (
        <>
            <MapContainer
                className={"map-container"}
                zoomSnap={0}
                zoomDelta={0.25}
                zoom={6.510095625452387}
                center={[49.00380582838273, 11.407993529123203]}
                whenCreated={(m: L.Map) => {
                    m.fitBounds(m.getBounds());
                    m.invalidateSize();
                }}
                zoomAnimation={true}
                fadeAnimation={true}
            >
                <TileLayer
                    ref={tileRef}
                    url={isDark ? dark : light}
                    attribution={
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    }
                    subdomains={"abcd"}
                    maxZoom={20}
                />
                <InteractiveMap
                    getDistrict={getDistrict}
                    setDistrict={setDistrict}
                    setLegend={setLegend}
                    getDataRB={getDataRB}
                    getDataLK={getDataLK}
                />
            </MapContainer>
            <div className={"info"}>
                <p>{getLegend}</p>
            </div>
        </>
    );
};
export default InteractiveMapContainer;
