import MainComponent from "./components/MainComponent";
import WelcomeComponent from "./components/WelcomeComponent";
import useLocalStorage from "use-local-storage";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import SwitchSelector from "react-switch-selector";
import { useEffect, useState } from "react";
import ModalComponent from "./components/ModalComponent";
import { useMediaQuery } from "react-responsive";
import HeaderButtons from "./components/HeaderButtons";

function App(): JSX.Element {
    const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDark, setIsDark] = useLocalStorage("darkMode", defaultDark);
    const [isAbsolute, setIsAbsolute] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const isSmartphone = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768 });
    const isPortrait = useMediaQuery({ orientation: "portrait" });

    useEffect(() => {
        if (isSmartphone || (isTablet && isPortrait)) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, [setIsMobile, isSmartphone, isPortrait, isTablet]);

    useEffect(() => {
        if (isMobile) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
            (document.getElementById("main-component") as HTMLDivElement).style.filter = "blur(5px)";
            (document.getElementById("welcome-container") as HTMLDivElement).style.filter = "blur(5px)";
        } else {
            document.body.style.overflow = "unset";
            document.body.style.touchAction = "unset";
            (document.getElementById("main-component") as HTMLDivElement).style.filter = "none";
            (document.getElementById("welcome-container") as HTMLDivElement).style.filter = "none";
        }
    });

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
            <WelcomeComponent />
            <HeaderButtons isDark={isDark} setIsDark={setIsDark} setIsAbsolute={setIsAbsolute} />
            <MainComponent isDark={isDark} isAbsolute={isAbsolute} />
        </div>
    );
}

export default App;
