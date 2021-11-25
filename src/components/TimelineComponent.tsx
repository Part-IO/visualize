import "./timeline.css";
import { Nav } from "./Navigation";
import { useState, useRef } from "react";

const Navigation: () => JSX.Element = () => {
    const [currSlide, setCurrSlide] = useState();
    const zRef = useRef(0.55);
    const allSlidesRef = useRef([]);
    const cameraRef = useRef();

    const slides = [
        { label: "1900"},
        { label: "1910"},
        { label: "1920"},
        { label: "1930"},
        { label: "1940"},
        { label: "1950"},
        { label: "1960"},
        { label: "1970"},
    ];

    return (
        <div>
            <Nav
                zRef={zRef}
                setCurrSlide={setCurrSlide}
                allSlidesRef={allSlidesRef}
                cameraRef={cameraRef}
                currSlide={currSlide}
            />
        </div>
    );
}

export default Navigation
