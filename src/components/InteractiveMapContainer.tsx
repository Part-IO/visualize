import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { TileLayer as LeafletTileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import InteractiveMap from "./InteractiveMap";
import { ICLickedLK } from "./MainComponent";
import { colord } from "colord";

const InteractiveMapContainer = ({
    getDistrict,
    setDistrict,
    getYear,
    isDark,
    setClickedLK,
}: {
    getDistrict: string;
    getYear: number;
    setDistrict: Dispatch<SetStateAction<string>>;
    isDark: boolean;
    setClickedLK: Dispatch<SetStateAction<ICLickedLK>>;
}): JSX.Element => {
    const tileRef = useRef(null);
    const dark = "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
    const light = "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";

    useEffect(() => {
        if (tileRef.current) {
            (tileRef.current as LeafletTileLayer).setUrl(isDark ? dark : light);
        }
    }, [isDark]);

    const colors: { color: string; percent: number }[] = [
        {
            color: "rgb(255, 255, 255)",
            percent: 0,
        },
        {
            color: "rgb(255, 59, 48)",
            percent: 10,
        },
        {
            color: "rgb(175, 82, 222)",
            percent: 100,
        },
    ];

    function perc2color(perc) {
        let c1 = colors[0];
        let c2 = colors[1];

        for (let i = 0; i < colors.length - 1; i++) {
            if (colors[i].percent <= perc && perc <= colors[i + 1].percent) {
                c1 = colors[i];
                c2 = colors[i + 1];
                break;
            }
        }

        const color1 = colord(c1.color);
        const color2 = colord(c2.color);

        const ratio = (perc - c1.percent) / (c2.percent - c1.percent);

        console.log(`P: ${perc} R: ${ratio}`);

        return color1.mix(color2, ratio).toHex();
    }

    const redColors = useRef<string[]>(Array.from(Array(101).keys()).map(perc2color));

    function genDiv(color) {
        return (
            <div
                style={{
                    width: "20px",
                    height: "1px",
                    backgroundColor: color,
                }}
            />
        );
    }

    const element = redColors.current.map(genDiv);

    return (
        <>
            {element}
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
                />
            </MapContainer>
        </>
    );
};
export default InteractiveMapContainer;
