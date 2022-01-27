import MainComponent from "./components/MainComponent";
import WelcomeComponent from "./components/WelcomeComponent";
import useLocalStorage from "use-local-storage";
import { useEffect, useState } from "react";
import ModalComponent from "./components/ModalComponent";
import { useMediaQuery } from "react-responsive";
import HeaderButtons from "./components/HeaderButtons";

function App(): JSX.Element {
    const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDark, setIsDark] = useLocalStorage("darkMode", defaultDark);
    const [isAbsolute, setIsAbsolute] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const isSmartphone = useMediaQuery({ maxWidth: 780 });
    const isTablet = useMediaQuery({ minWidth: 781 });
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
            (document.getElementById("header-button-container") as HTMLDivElement).style.filter = "blur(5px)";
            (document.getElementById("image-author") as HTMLDivElement).style.filter = "blur(5px)";
            (document.getElementById("required-links") as HTMLDivElement).style.filter = "blur(5px)";
        } else {
            document.body.style.touchAction = "unset";
            (document.getElementById("main-component") as HTMLDivElement).style.filter = "none";
            (document.getElementById("welcome-container") as HTMLDivElement).style.filter = "none";
            (document.getElementById("header-button-container") as HTMLDivElement).style.filter = "none";
            (document.getElementById("image-author") as HTMLDivElement).style.filter = "none";
            (document.getElementById("required-links") as HTMLDivElement).style.filter = "none";
            document.body.style.overflow = "unset";
        }
    });

    const textValue: JSX.Element = (
        <>
            Diese Webseite sollte <b>nur</b> im 16:9 oder 16:10 Format und auf einem Desktop,Laptop oder Tablet
            betrachtet werden.
        </>
    );
    const titleValue: JSX.Element = <>Kompatibilitätswarnung</>;

    return (
        <div
            data-theme={isDark ? "dark" : "light"}
            style={{
                backgroundColor: "var(--color-white)",
                transition: "color 0.2 ease, background-color 0.2 ease background 0.2 ease;",
            }}
        >
            <ModalComponent show={isMobile} modalType={"danger"} title={titleValue} content={textValue} />
            <WelcomeComponent />
            <HeaderButtons isDark={isDark} setIsDark={setIsDark} setIsAbsolute={setIsAbsolute} />
            <MainComponent isDark={isDark} isAbsolute={isAbsolute} />
        </div>
    );
}

export default App;
