import { MapContainer, TileLayer } from "react-leaflet";
import { TileLayer as LeafletTileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import InteractiveMap from "./InteractiveMap";
import { ICLickedLK } from "./MainComponent";

const InteractiveMapContainer = ({
    getDistrict,
    setDistrict,
    getYear,
    isDark,
    setClickedLK,
    redColors,
}: {
    getDistrict: string;
    getYear: number;
    setDistrict: Dispatch<SetStateAction<string>>;
    isDark: boolean;
    setClickedLK: Dispatch<SetStateAction<ICLickedLK>>;
    redColors: string[];
}): JSX.Element => {
    const tileRef = useRef(null);
    const dark = "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
    const light = "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";

    useEffect(() => {
        if (tileRef.current) {
            (tileRef.current as LeafletTileLayer).setUrl(isDark ? dark : light);
        }
    }, [isDark]);
    return (
        <MapContainer
            className={"map-container"}
            trackResize={true}
            zoomSnap={0}
            zoomDelta={0.25}
            zoom={6.510095625452387}
            center={[49.00380582838273, 11.407993529123203]}
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
                setClickedLK={setClickedLK}
                getYear={getYear}
                redColors={redColors}
            />
        </MapContainer>
    );
};
export default InteractiveMapContainer;
