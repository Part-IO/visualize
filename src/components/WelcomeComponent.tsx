import "../style/WelcomeComponent.scss";
import { Link } from "react-scroll";
import { useEffect, useRef, useState } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";

const WelcomeComponent = (): JSX.Element => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLParagraphElement>(null);
    const subTitleRef = useRef<HTMLParagraphElement>(null);
    const titleContainerRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef<HTMLDivElement>(null);
    const WD = useWindowDimensions();
    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const resize = ({ num, minVal, maxVal }: { num: number; minVal?: number; maxVal?: number }): number => {
            const MIN = minVal || -Infinity;
            const MAX = maxVal || Infinity;
            return Math.min(Math.max(num, MIN), MAX);
        };

        const relPos = (100 / WD.height) * scrollPosition;
        if (backgroundRef.current) {
            backgroundRef.current.style.filter = `blur(${Math.trunc(relPos / 10)}px)`;
        }
        if (
            titleRef.current &&
            subTitleRef.current &&
            titleContainerRef.current &&
            mouseRef.current &&
            quoteRef.current
        ) {
            if (relPos > 50) {
                mouseRef.current.style.height = "0";
            } else {
                mouseRef.current.style.height = "Inherit";
            }
            if (relPos > 85) {
                titleContainerRef.current.style.color = "var(--color-black)";
            } else {
                titleContainerRef.current.style.color = "#000";
            }

            titleContainerRef.current.style.top = `${resize({ num: relPos, minVal: 10, maxVal: 100 })}%`;
            subTitleRef.current.style.fontSize = `${resize({ num: 5 - relPos / 25, minVal: 1.5 })}vh`;
            titleRef.current.style.fontSize = `${resize({ num: 15 - relPos / 8, minVal: 4 })}vh`;
            quoteRef.current.style.opacity = `${100 - relPos * 3}%`;
        }
    }, [scrollPosition, WD]);

    return (
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
                            <i>{"- Ludwig Hartmann, Mitglied des Landtags Bayern"}</i>
                        </p>
                    </div>
                </div>
            </div>
            <Link to={"main-component"} smooth={true} spy={true}>
                <div className={"mouse-scroll"} ref={mouseRef}>
                    <div className={"mouse"}>
                        <div className={"mouse-in"} />
                    </div>
                    <div>
                        <span className={"down-arrow-1"} />
                        <span className={"down-arrow-2"} />
                        <span className={"down-arrow-3"} />
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default WelcomeComponent;
