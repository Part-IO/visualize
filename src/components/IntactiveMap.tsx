import regierungsbezirke from "../data/regierungsbezirke.json";
import { Component, FC, useState } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import { Feature, GeoJsonObject, GeometryObject } from "geojson";
import { Layer, LeafletEvent, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

class InteractiveMap extends Component {
    countryStyle = {
        fillColor: "red",
        fillOpacity: 0.5,
        color: "white",
        weight: 1,
    };

    // eslint-disable-next-line
    onEachFeature = (feature: Feature<GeometryObject, any>, layer: Layer) => {
        const name = feature.properties.NAME_2;
        layer.bindPopup(name);
        layer.on({
            mouseover: (event: LeafletEvent) => {
                event.target.setStyle({
                    fillColor: "red",
                    fillOpacity: 0.75,
                    color: "white",
                    weight: 3,
                });
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

    render() {
        return (
            <MapContainer zoom={7} style={{ height: "100vh", width: "100%" }} center={[48.7, 12]}>
                <GeoJSON
                    style={this.countryStyle}
                    data={regierungsbezirke as GeoJsonObject}
                    onEachFeature={this.onEachFeature}
                />
            </MapContainer>
        );
    }
}

export default InteractiveMap;
