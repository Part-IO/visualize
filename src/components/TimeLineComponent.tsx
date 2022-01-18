import "../style/TimeLineComponent.scss";
import { CSSProperties, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { prevAll, years } from "../utils/Helper";
import WarnSymbol from "./WarnSymbol";

const DistrictComponent = ({
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

    const playButtonClick = (): void => {
        setPlayState((prevState) => !prevState);
    };

    useEffect(() => {
        if (getYear < 2020) {
            const animation = setTimeout(() => playState && setYear(getYear + 4), 2e3);
            return () => clearTimeout(animation);
        } else {
            setPlayState(false);
        }
    }, [playState, getYear, setYear]);

    const warnStyle = useMemo(() => {
        if (isDark) {
            return {
                top: "-0.7em",
                position: "relative",
                left: "76.5vw",
                zIndex: "200000",
                fill: "var(--color-white)",
            };
        } else {
            return {
                top: "-0.7em",
                position: "relative",
                left: "76.5vw",
                zIndex: "200000",
                fill: "var(--color-yellow)",
                stroke: "var(--color-black)",
            };
        }
    }, [isDark]);

    const warnStyle2 = useMemo(() => {
        if (isDark) {
            return {
                top: "-0.7em",
                position: "relative",
                left: "33vw",
                zIndex: "200000",
                fill: "var(--color-white)",
            };
        } else {
            return {
                top: "-0.7em",
                position: "relative",
                left: "33vw",
                zIndex: "200000",
                fill: "var(--color-yellow)",
                stroke: "var(--color-black)",
            };
        }
    }, [isDark]);

    return (
        <div className={"timeline-outer"}>
            <button
                className={playState ? "play-button pause" : "play-button"}
                id={"playButton"}
                onClick={playButtonClick}
                disabled={getYear === 2020}
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
                        style={warnStyle as CSSProperties}
                        color={"var(--color-yellow)"}
                    />
                    <WarnSymbol
                        onClick={handleModalClick2}
                        size={24}
                        style={warnStyle2 as CSSProperties}
                        color={"var(--color-yellow)"}
                    />
                    {years.map((index: number) => (
                        <div key={index} />
                    ))}
                </div>
                <div className={"below"}>
                    {years.map((value: number, index: number) => {
                        if (index === 0) {
                            return (
                                <div
                                    id={value.toString()}
                                    className={"current"}
                                    onClick={() => {
                                        setPlayState(false);
                                        setYear(value);
                                    }}
                                >
                                    <p>{value}</p>
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    id={value.toString()}
                                    onClick={() => {
                                        setPlayState(false);
                                        setYear(value);
                                    }}
                                >
                                    <p style={index === 10 ? { marginRight: "0vw", pointerEvents: "all" } : {}}>
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

export default DistrictComponent;
