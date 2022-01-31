import "../style/WelcomeComponent.scss";
import { Link } from "react-scroll";
import { useEffect, useRef, useState } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import PopupComponent from "./PopupComponent";
import PrivacyPolicyComponent from "./PrivacyPolicyComponent";

const WelcomeComponent = (): JSX.Element => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showPrivacyPolicyPopup, setShowPrivacyPolicyPopup] = useState<boolean | null>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLParagraphElement>(null);
    const subTitleRef = useRef<HTMLParagraphElement>(null);
    const titleContainerRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef<HTMLDivElement>(null);
    const WD = useWindowDimensions();
    const handleScroll = () => {
        const position = window.scrollY;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });

    /**
     * Title animation -> WelcomePage title to navbar title
     */
    useEffect(() => {
        if (!showPrivacyPolicyPopup) {
            document.body.style.overflowY = "unset";
            const resize = ({ num, minVal, maxVal }: { num: number; minVal?: number; maxVal?: number }): number => {
                const MIN = minVal || -Infinity;
                const MAX = maxVal || Infinity;
                return Math.min(Math.max(num, MIN), MAX);
            };

            // get relative scroll position
            const relPos = (100 / WD.height) * scrollPosition;
            if (backgroundRef.current) {
                if (relPos < 100) {
                    backgroundRef.current.style.filter = `blur(${Math.trunc(relPos / 10)}px)`;
                } else {
                    backgroundRef.current.style.filter = `blur(0px)`;
                }
            }
            if (
                titleRef.current &&
                subTitleRef.current &&
                titleContainerRef.current &&
                mouseRef.current &&
                quoteRef.current
            ) {
                if (relPos > 85) {
                    titleContainerRef.current.style.color = "var(--color-black)";
                } else {
                    titleContainerRef.current.style.color = "rgb(28, 28, 30)";
                }

                const titleHeight = WD.height * 0.15;
                const subTitleHeight = WD.height * 0.05;
                titleContainerRef.current.style.top = `${resize({ num: relPos, minVal: 10, maxVal: 100 })}%`;
                subTitleRef.current.style.fontSize = `${resize({
                    num: subTitleHeight - ((subTitleHeight - 16) / 100) * relPos,
                    minVal: 16,
                })}px`;
                titleRef.current.style.fontSize = `${resize({
                    num: titleHeight - ((titleHeight - 45) / 100) * relPos,
                    minVal: 45,
                })}px`;
                quoteRef.current.style.opacity = `${100 - relPos * 3}%`;
                mouseRef.current.style.opacity = `${100 - relPos * 2}%`;
                (document.getElementById("required-links") as HTMLDivElement).style.opacity = `${100 - relPos}%`;
                (document.getElementById("image-author") as HTMLDivElement).style.opacity = `${100 - relPos}%`;
            }
        } else {
            document.body.style.overflowY = "hidden";
        }
    }, [scrollPosition, WD, showPrivacyPolicyPopup]);

    return (
        <>
            <PopupComponent showPopup={showPrivacyPolicyPopup} setShowPopup={setShowPrivacyPolicyPopup}>
                <PrivacyPolicyComponent />
            </PopupComponent>
            <div id={"welcome-container"} className={"welcome-container"}>
                <div className={"welcome-background"} ref={backgroundRef} />
                <div className={"welcome-container"}>
                    <div className={"title-container"} ref={titleContainerRef}>
                        <p className={"title"} ref={titleRef}>
                            Betonwüste
                        </p>
                        <p className={"subtitle"} ref={subTitleRef}>
                            Flächenverbrauch Bayerns in Zahlen
                        </p>
                    </div>
                    <div className={"quote-container"} ref={quoteRef}>
                        <div className={"item quote1"}>
                            <div className={"quotation-mark"} />
                            <p className={"text"}>
                                {
                                    "Durch das Wachstum ist die Siedlungs- und Verkehrsfläche von 1980 bis 2017 um mehr als ein Drittel angewachsen."
                                }
                            </p>
                            <p className={"author"}>
                                <i>{"- Planungsverband Äußerer Wirtschaftsraum München"}</i>
                            </p>
                        </div>
                        <div className={"item quote2"}>
                            <div className={"quotation-mark"} />
                            <p className={"text"}>
                                {
                                    "Derzeit werden in Bayern täglich 10,8 Hektar Boden für Industriegebiete, Straßen und Siedlungen zubetoniert."
                                }
                            </p>
                            <p className={"author"}>
                                <i>{"- Ludwig Hartmann, Mitglied des Bayerischen Landtags"}</i>
                            </p>
                        </div>
                    </div>
                </div>
                <Link to={"main-component"} smooth={true} spy={true}>
                    <div className={"mouse-scroll"} ref={mouseRef}>
                        <div className={"mouse"}>
                            <div className={"mouse-in"} />
                        </div>
                        <div className={"mouse-arrow"}>
                            <span className={"down-arrow-1"} />
                            <span className={"down-arrow-2"} />
                            <span className={"down-arrow-3"} />
                        </div>
                    </div>
                </Link>
                <div id={"image-author"} className={"image-author"}>
                    Foto: Franz Wanner
                </div>
                <div id={"required-links"} className={"required-links"}>
                    <button
                        onClick={() => window.open("https://www.hs-augsburg.de/Service/Impressum.html", "_blank")}
                        className={"link"}
                    >
                        Impressum
                    </button>
                    <button onClick={() => setShowPrivacyPolicyPopup(true)} className={"link"}>
                        Datenschutzerklärung
                    </button>
                </div>
            </div>
        </>
    );
};

export default WelcomeComponent;
