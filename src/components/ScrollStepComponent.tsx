import "../style/ScrollStepComponent.scss";
import { useEffect, useState } from "react";
import { districts, prevAll } from "../utils/Helper";
import scroller, { ScrollerObserver } from "../utils/Scroller";
import { Link } from "react-scroll";

const ScrollStepComponent = (): JSX.Element => {
    const [getDistrict, setDistrict] = useState<string>("");
    const [getState, setState] = useState<string>("");

    useEffect(() => {
        scroller.onScrollStateChange(getState);
    }, [getDistrict, getState]);

    useEffect(() => {
        const progressElement: HTMLDivElement = document.querySelector(".progress") as HTMLDivElement;
        const label: HTMLDivElement = progressElement.querySelector(".left") as HTMLDivElement;
        const steps: HTMLDivElement[] = [...(label.childNodes as NodeListOf<HTMLDivElement>)];

        const element: HTMLDivElement = document.getElementById(getState) as HTMLDivElement;

        if (element !== null) {
            steps.forEach((e: HTMLDivElement) => {
                e.classList.replace("current", "prev");
            });

            element.classList.add("current");
            prevAll(element)
                .slice(1)
                .forEach((e) => e.classList.add("prev"));
        }
    }, [getState]);

    const onStateChange: ScrollerObserver = (district: string) => {
        setState(district);
    };

    useEffect(() => {
        scroller.attach(onStateChange);
        return () => scroller.detach(onStateChange);
    });

    useEffect(() => {
        const progressElement: HTMLDivElement = document.querySelector(".progress") as HTMLDivElement;
        const label: HTMLDivElement = progressElement.querySelector(".left") as HTMLDivElement;
        const steps: HTMLDivElement[] = [...(label.childNodes as NodeListOf<HTMLDivElement>)];

        steps.forEach((element: HTMLDivElement) =>
            element.addEventListener("click", () => {
                setDistrict(element.id);
            })
        );
    });

    return (
        <div className={"outer"}>
            <div className={"progress"}>
                <div className={"left"}>
                    {districts.map((value: string, index: number) => {
                        const offset = -document.documentElement.clientHeight * 0.21;
                        if (index === 1) {
                            return (
                                <div id={value} className={"current"}>
                                    <Link to={value + "-view"} smooth={true} spy={true} offset={offset}>
                                        {value}
                                    </Link>
                                </div>
                            );
                        } else {
                            return (
                                <div id={value} className={"current"}>
                                    <Link to={value + "-view"} smooth={true} spy={true} offset={offset}>
                                        {value}
                                    </Link>
                                </div>
                            );
                        }
                    })}
                </div>
                <div className={"right"}>
                    {districts.map((_, index: number) => {
                        return <div key={index} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default ScrollStepComponent;
