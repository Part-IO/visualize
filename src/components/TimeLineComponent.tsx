import "../style/TimeLineComponent.scss";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { prevAll, years } from "../utils/Helper";
import WarnSymbol from "./WarnSymbol";
import useWindowDimensions from "../hooks/useWindowDimensions";

const TimeLineComponent = ({
    getYear,
    setYear,
    handleModalClick,
    handleModalClick2,
    isDark,
}: {
    getYear: number;
    setYear: Dispatch<SetStateAction<number>>;
    handleModalClick: () => void;
    handleModalClick2: () => void;
    isDark: boolean;
}): JSX.Element => {
    const [playState, setPlayState] = useState<boolean>(false);
    const playButtonRef = useRef<HTMLButtonElement>(null);
    const { width } = useWindowDimensions();
    useEffect(() => {
        const progressElement: HTMLDivElement = document.querySelector(".timeline-progress") as HTMLDivElement;
        const label: HTMLDivElement = progressElement.querySelector(".below") as HTMLDivElement;
        const steps: HTMLDivElement[] = [...(label.childNodes as NodeListOf<HTMLDivElement>)];

        const element: HTMLDivElement = document.getElementById(getYear.toString()) as HTMLDivElement;

        if (element !== null) {
            steps.forEach((e: HTMLDivElement) => {
                e.classList.replace("current", "prev");
            });

            element.classList.add("current");
            prevAll(element)
                .slice(1)
                .forEach((e) => e.classList.add("prev"));
        }
    }, [getYear]);

    /**
     * set the correct size to align below the main bar chart component
     */
    useEffect(() => {
        const districtLeft = document.getElementById("district_left");
        if (playButtonRef.current && districtLeft) {
            playButtonRef.current.style.flexBasis = `${districtLeft.offsetWidth + 48}px`;
            playButtonRef.current.style.left = `${districtLeft.offsetWidth - 20}px`;
        }
    }, [width]);

    /**
     * Start the animation if a user press the play button
     */
    useEffect(() => {
        if (getYear < 2020) {
            const animation = setTimeout(() => playState && setYear(getYear + 4), 2e3);
            return () => clearTimeout(animation);
        } else {
            setPlayState(false);
        }
    }, [playState, getYear, setYear]);

    return (
        <div className={"timeline-outer"}>
            <button
                className={playState ? "play-button pause" : "play-button"}
                id={"playButton"}
                onClick={() => setPlayState((prevState) => !prevState)}
                disabled={getYear === 2020}
                ref={playButtonRef}
                style={
                    getYear < 2020
                        ? {
                              borderColor: "transparent transparent transparent var(--color-black)",
                              cursor: "pointer",
                          }
                        : {
                              borderColor: "transparent transparent transparent var(--color-gray-3",
                              cursor: "default",
                          }
                }
            />
            <div className={"timeline-progress"}>
                <div className={"above"}>
                    <WarnSymbol
                        onClick={handleModalClick}
                        size={24}
                        style={{
                            top: "-0.7em",
                            position: "relative",
                            left: "82%",
                            zIndex: "20",
                            fill: isDark ? "var(--color-white)" : "var(--color-yellow)",
                            stroke: isDark ? "var(--color-yellow)" : "var(--color-black)",
                        }}
                        color={"var(--color-yellow)"}
                    />
                    <WarnSymbol
                        onClick={handleModalClick2}
                        size={24}
                        style={{
                            top: "-0.7em",
                            position: "relative",
                            left: "33%",
                            zIndex: "20",
                            fill: isDark ? "var(--color-white)" : "var(--color-yellow)",
                            stroke: isDark ? "var(--color-yellow)" : "var(--color-black)",
                        }}
                        color={"var(--color-yellow)"}
                    />

                    <div />
                    <div />
                </div>
                <div className={"below"}>
                    {years.map((value: number, index: number) => {
                        if (index === 0) {
                            return (
                                <div
                                    key={index}
                                    id={value.toString()}
                                    className={"current"}
                                    onClick={() => {
                                        setPlayState(false);
                                        setYear(value);
                                    }}
                                >
                                    <p key={index} style={{ left: "16px" }}>
                                        {value}
                                    </p>
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    key={index}
                                    id={value.toString()}
                                    onClick={() => {
                                        setPlayState(false);
                                        setYear(value);
                                    }}
                                >
                                    <p key={index} style={index === 10 ? { right: "16px" } : {}}>
                                        {value}
                                    </p>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export default TimeLineComponent;
