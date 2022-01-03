import "../style/TimeLineComponent.scss";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { prevAll, years } from "../utils/Helper";
import Popup from "reactjs-popup";

const DistrictComponent = ({
    getYear,
    setYear,
}: {
    getYear: number;
    setYear: Dispatch<SetStateAction<number>>;
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

    const playButtonClick = () => {
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

    return (
        <div className={"timeline-outer"}>
            <div className={"timeline-progress"}>
                <button
                    className={playState ? "play-button pause" : "play-button"}
                    id={"playButton"}
                    onClick={playButtonClick}
                    disabled={getYear === 2020}
                    style={
                        getYear < 2020
                            ? { borderColor: "transparent transparent transparent #000000FF", cursor: "pointer" }
                            : { borderColor: "transparent transparent transparent #00000033", cursor: "default" }
                    }
                />
                <div className={"above"}>
                    <Popup trigger={<span className={"warn-symbol"} />} modal>
                        {(close) => (
                            <div className={"modal"}>
                                <button className={"close"} onClick={close}>
                                    &times;
                                </button>
                                <div className={"header"}>Wechsel von ALB zum ALKIS Datensatz</div>
                                <div className={"content"}>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a nostrum. Dolorem,
                                    repellat quidem ut, minima sint vel eveniet quibusdam voluptates delectus
                                    doloremque, explicabo tempore dicta adipisci fugit amet dignissimos?
                                    <br />
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur sit commodi
                                    beatae optio voluptatum sed eius cumque, delectus saepe repudiandae explicabo nemo
                                    nam libero ad, doloribus, voluptas rem alias. Vitae?
                                </div>
                            </div>
                        )}
                    </Popup>

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
                                    <p>{value}</p>
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
