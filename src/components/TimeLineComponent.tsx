import "../style/TimeLineComponent.scss";
import { useEffect } from "react";
import { prevAll } from "../utils/Helper";

const DistrictComponent = (): JSX.Element => {
    const onHover = (el: HTMLDivElement, steps: HTMLDivElement[]): void => {
        steps.forEach((element: HTMLDivElement) => {
            element.classList.replace("current", "prev");
        });
        el.classList.add("current");
        prevAll(el)
            .slice(1)
            .forEach((element) => element.classList.add("prev"));
    };

    useEffect(() => {
        const progressElement: HTMLDivElement = document.querySelector(".timeline-progress") as HTMLDivElement;
        const label: HTMLDivElement = progressElement.querySelector(".below") as HTMLDivElement;
        const steps: HTMLDivElement[] = [...(label.childNodes as NodeListOf<HTMLDivElement>)];
        steps.forEach((element: HTMLDivElement) =>
            element.addEventListener("click", () => {
                onHover(element, steps);
            })
        );
    });

    return (
        <div className={"timeline-outer"}>
            <div className={"timeline-progress"}>
                <div className={"above"}>
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
                <div className={"below"}>
                    <div className={"current"}>
                        <p>1980</p>
                    </div>
                    <div>
                        <p>1984</p>
                    </div>
                    <div>
                        <p>1988</p>
                    </div>
                    <div>
                        <p>1992</p>
                    </div>
                    <div>
                        <p>1996</p>
                    </div>
                    <div>
                        <p>2000</p>
                    </div>
                    <div>
                        <p>2004</p>
                    </div>
                    <div>
                        <p>2008</p>
                    </div>
                    <div>
                        <p>2012</p>
                    </div>
                    <div>
                        <p>2016</p>
                    </div>
                    <div>
                        <p>2020</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DistrictComponent;
