import MainComponent from "./components/MainComponent";
import WelcomeComponent from "./components/WelcomeComponent";
import useLocalStorage from "use-local-storage";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import SwitchSelector from "react-switch-selector";
import { useEffect, useState } from "react";
import ModalComponent from "./components/ModalComponent";
import useWindowDimensions from "./hooks/useWindowDimensions";

function App(): JSX.Element {
    const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDark, setIsDark] = useLocalStorage("darkMode", defaultDark);
    const [isAbsolute, setIsAbsolute] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const WD = useWindowDimensions();

    useEffect(() => {
        if (WD.width < 1280) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, [setIsMobile, WD]);

    useEffect(() => {
        if (isMobile) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "unset";
            document.body.style.touchAction = "unset";
        }
    });

    const switchTheme = (checked: boolean) => {
        setIsDark(checked);
    };

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

    const switchThemeButton = (
        <DarkModeSwitch
            checked={isDark}
            onChange={switchTheme}
            moonColor={"var(--color-black)"}
            sunColor={"var(--color-black)"}
            className={"switch-theme-button"}
        />
    );

    const changeBarChartButton = (
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
    );

    const textValue: JSX.Element = (
        <>
            Diese Webseite sollte <b>nur</b> im 16:9 oder 16: 10 Format und auf einem mindestens FullHD Bildschirm
            betrachtet werden um so ein richtiges Rendern der Webseite zu gewährleisten.
        </>
    );
    const titleValue: JSX.Element = <>Kompatibilitätswarnung</>;

    return (
        <div data-theme={isDark ? "dark" : "light"}>
            <ModalComponent show={isMobile} modalType={"danger"} title={titleValue} content={textValue} />
            <WelcomeComponent switchThemeButton={switchThemeButton} changeBarChartButton={changeBarChartButton} />
            <MainComponent isDark={isDark} isAbsolute={isAbsolute} />
        </div>
    );
}

export default App;
