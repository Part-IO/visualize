import { GeoJsonObject } from "geojson";
import regierungsbezirke from "../data/regierungsbezirke.json";
import { FC, useState } from "react";
import { MapContainer, GeoJSON, GeoJSONProps } from "react-leaflet";
import { GeoJSONEvent } from "leaflet";

const InteractiveMap: FC = () => {
    const countryStyle = {
        fillColor: "red",
        fillOpacity: 0.5,
        color: "white",
        weight: 1,
    };

    // eslint-disable-next-line
    const onEachFeature = (feature: any, layer: any) => {
        const name = feature.properties.NAME_2;
        layer.bindPopup(name);
    };

    return (
        <div id={"MapWrapper"}>
            <h1 style={{ textAlign: "center" }}>Test Map</h1>
            <MapContainer zoom={6} style={{ height: "80vh" }} center={[51, 10]}>
                <GeoJSON style={countryStyle} data={regierungsbezirke as GeoJsonObject} onEachFeature={onEachFeature} />
            </MapContainer>
        </div>
    );
};

export default InteractiveMap;
