import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dispatch, SetStateAction, useState } from "react";
import InteractiveMap from "./InteractiveMap";
import { IData } from "../utils/DataLoader";

const InteractiveMapContainer = ({
    getDistrict,
    setDistrict,
    getDataRB,
    getDataLK,
}: {
    getDistrict: string;
    getDataLK: IData;
    getDataRB: IData;
    setDistrict: Dispatch<SetStateAction<string>>;
}): JSX.Element => {
    const [getLegend, setLegend] = useState<string>("");
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
                    url={"https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"}
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
