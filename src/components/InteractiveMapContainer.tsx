import { MapContainer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dispatch, SetStateAction, useState } from "react";
import { Colors } from "../utils/Colors";
import { LayerTypes } from "../utils/Helper";
import InteractiveMap from "./InteractiveMap";

const InteractiveMapContainer = ({
    getYear,
    getDistrict,
    setDistrict,
}: {
    getYear: number;
    getDistrict: string;
    setDistrict: Dispatch<SetStateAction<string>>;
}): JSX.Element => {
    return (
        <MapContainer
            zoomSnap={0}
            zoomDelta={0.25}
            zoom={6.510095625452387}
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
                m.fitBounds(m.getBounds());
                m.invalidateSize();
            }}
            zoomAnimation={true}
            fadeAnimation={true}
        >
            <InteractiveMap getYear={getYear} getDistrict={getDistrict} setDistrict={setDistrict} />
        </MapContainer>
    );
};
export default InteractiveMapContainer;
