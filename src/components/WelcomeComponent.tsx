import "../style/WelcomeComponent.scss";
import { Link } from "react-scroll";
import { useEffect, useRef, useState } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";

const WelcomeComponent = ({ switchThemeButton }: { switchThemeButton: JSX.Element }): JSX.Element => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLParagraphElement>(null);
    const subTitleRef = useRef<HTMLParagraphElement>(null);
    const titleContainerRef = useRef<HTMLDivElement>(null);
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
        if (titleRef.current && subTitleRef.current && titleContainerRef.current && mouseRef.current) {
            if (relPos > 50) {
                mouseRef.current.style.height = "0";
            } else {
                mouseRef.current.style.height = "Inherit";
            }
            titleContainerRef.current.style.top = `${resize({ num: relPos, minVal: 10, maxVal: 99 })}%`;
            subTitleRef.current.style.fontSize = `${resize({ num: 5 - relPos / 25, minVal: 1.4 })}vh`;
            titleRef.current.style.fontSize = `${resize({ num: 15 - relPos / 10, minVal: 4.6 })}vh`;
        }
    }, [scrollPosition, WD]);

    return (
        <>
            <div className={"welcome-container"}>
                <div className={"welcome-background"} ref={backgroundRef} />
                <div className={"title-container"} ref={titleContainerRef}>
                    <p className={"title"} ref={titleRef}>
                        Betonwüste
                    </p>
                    <p className={"subtitle"} ref={subTitleRef}>
                        Flächenverbrauch Bayerns in Zahlen
                    </p>
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
            {switchThemeButton}
        </>
    );
};

export default WelcomeComponent;
