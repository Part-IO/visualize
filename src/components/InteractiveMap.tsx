import regierungsbezirke from "../data/regierungsbezirke.json";
import { MapContainer, GeoJSON } from "react-leaflet";
import { Feature, GeoJsonObject } from "geojson";
import { Layer, LeafletEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

interface ICountryStyle {
    fillColor: string;
    fillOpacity: number;
    color: string;
    weight: number;
}

const InteractiveMap: () => JSX.Element = () => {
    const defaultCountryStyle: ICountryStyle = {
        fillColor: "red",
        fillOpacity: 0.5,
        color: "white",
        weight: 1,
    };
    const hoverCountryStyle: ICountryStyle = {
        fillColor: "red",
        fillOpacity: 1,
        color: "white",
        weight: 3,
    };

    const onEachFeature = (feature: Feature, layer: Layer): void => {
        const name = feature.properties?.NAME_2;
        layer.bindPopup(name);
        layer.on({
            mouseover: (event: LeafletEvent) => {
                event.target.setStyle(hoverCountryStyle);
                layer.openPopup();
            },
            mouseout: (event: LeafletEvent) => {
                event.target.setStyle({
                    fillColor: "red",
                    fillOpacity: 0.5,
                    color: "white",
                    weight: 1,
                });
                layer.closePopup();
            },
        });
    };

    return (
        <MapContainer zoom={7} style={{ height: "100vh", width: "100%" }} center={[48.7, 12]}>
            <GeoJSON
                style={defaultCountryStyle}
                data={regierungsbezirke as GeoJsonObject}
                onEachFeature={onEachFeature}
            />
        </MapContainer>
    );
};

export default InteractiveMap;
