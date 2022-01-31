import "../style/HeaderButtons.scss";
import { useEffect, useRef, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import SwitchSelector from "react-switch-selector";
import useWindowDimensions from "../hooks/useWindowDimensions";
import InformationPopup from "./InformationPopup";

const HeaderButtons = ({
    isDark,
    setIsDark,
    setIsAbsolute,
}: {
    isDark: boolean;
    setIsDark: (isDark: boolean) => void;
    setIsAbsolute: (isAbsolute: boolean) => void;
}): JSX.Element => {
    const [showPopup, setShowPopup] = useState<boolean | null>(null);
    const headerButtonContainer = useRef<HTMLDivElement>(null);
    const { width, height } = useWindowDimensions();

    /**
     * Fit the width of the Header-buttons equal to the right container
     */
    useEffect(() => {
        const mapContainer = document.getElementById("right_content_container");
        const containerWidth = (mapContainer as HTMLDivElement).offsetWidth;
        (headerButtonContainer.current as HTMLDivElement).style.width = `${
            containerWidth > 270 ? containerWidth : 270
        }px`;
    }, [width, height]);

    useEffect(() => {
        document.body.style.overflowY = !showPopup ? "unset" : "hidden";
    }, [showPopup]);

    const switchOptions = [
        {
            label: "Absolut",
            value: false,
            selectedBackgroundColor: "var(--color-black)",
        },
        {
            label: "Prozentual",
            value: true,
            selectedBackgroundColor: "var(--color-black)",
        },
    ];

    return (
        <>
            <div id={"header-button-container"} className={"header-button-container"} ref={headerButtonContainer}>
                <div className={"switch"}>
                    <SwitchSelector
                        onChange={(state) => setIsAbsolute(state as boolean)}
                        options={switchOptions}
                        backgroundColor={"var(--color-white)"}
                        fontColor={"var(--color-black)"}
                        border={"1px solid var(--color-black)"}
                        optionBorderRadius={3}
                        wrapperBorderRadius={4}
                        selectedFontColor={"var(--color-white)"}
                        selectionIndicatorMargin={-0.7}
                    />
                </div>
                <button onClick={() => setShowPopup(true)} className={"data-info-button"}>
                    i
                </button>
                <DarkModeSwitch
                    checked={isDark}
                    onChange={setIsDark}
                    moonColor={"var(--color-black)"}
                    sunColor={"var(--color-black)"}
                    className={"switch-theme-button"}
                />
            </div>

            <InformationPopup isDark={isDark} showPopup={showPopup} setShowPopup={setShowPopup} />
        </>
    );
};

export default HeaderButtons;
