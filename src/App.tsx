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
    const [isMobile, setIsMobile] = useState<boolean>(true);

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
        const mainComponent = document.getElementById("main-component");
        const welcomeContainer = document.getElementById("welcome-container");
        const headerButtonContainer = document.getElementById("header-button-container");
        const imageAuthor = document.getElementById("image-author");
        const requiredLinks = document.getElementById("required-links");
        const waitTilRender = setInterval(function () {
            if (mainComponent && welcomeContainer && headerButtonContainer && imageAuthor && requiredLinks) {
                if (isMobile) {
                    document.body.style.overflow = "hidden";
                    document.body.style.touchAction = "none";
                    mainComponent.style.filter = "blur(5px)";
                    welcomeContainer.style.filter = "blur(5px)";
                    headerButtonContainer.style.filter = "blur(5px)";
                    imageAuthor.style.filter = "blur(5px)";
                    requiredLinks.style.filter = "blur(5px)";
                } else {
                    document.body.style.touchAction = "unset";
                    mainComponent.style.filter = "none";
                    welcomeContainer.style.filter = "none";
                    headerButtonContainer.style.filter = "none";
                    imageAuthor.style.filter = "none";
                    requiredLinks.style.filter = "none";
                    document.body.style.overflow = "unset";
                }
                clearInterval(waitTilRender);
            }
        }, 100);
    });

    const textValue: JSX.Element = (
        <>
            Diese Webseite sollte <b>nur</b> im Querformat und auf einem Desktop, Laptop oder Tablet betrachtet werden.
        </>
    );
    const titleValue: JSX.Element = <>Kompatibilitätswarnung</>;

    return (
        <div
            data-theme={isDark ? "dark" : "light"}
            style={{
                backgroundColor: "var(--color-white)",
                transition: "color 0.2 ease, background-color 0.2 ease, background 0.2 ease",
            }}
        >
            <ModalComponent
                wrapperStyle={{ width: `${window.outerWidth}px` }}
                show={isMobile}
                modalType={"danger"}
                title={titleValue}
                content={textValue}
            />
            <WelcomeComponent />
            <HeaderButtons isDark={isDark} setIsDark={setIsDark} setIsAbsolute={setIsAbsolute} />
            <MainComponent isDark={isDark} isAbsolute={isAbsolute} />
        </div>
    );
}

export default App;
