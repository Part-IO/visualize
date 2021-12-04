import "../style/TimeLineComponent.scss";
import { useEffect } from "react";

const DistrictComponent = (): JSX.Element => {
    const prevAll = (element: HTMLDivElement): HTMLDivElement[] => {
        const result: HTMLDivElement[] = [];

        while ((element = element.previousElementSibling as HTMLDivElement)) result.push(element);
        return result;
    };

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
            element.addEventListener("mouseenter", () => {
                onHover(element, steps);
            })
        );
    });

    return (
        <div className={"timeline-outer"}>
            <div className={"timeline-progress"}>
                <div className={"below"}>
                    <div className={"current"}>
                        <p>1950</p>
                    </div>
                    <div>
                        <p>1960</p>
                    </div>
                    <div>
                        <p>1970</p>
                    </div>
                    <div>
                        <p>1980</p>
                    </div>
                    <div>
                        <p>1990</p>
                    </div>
                    <div>
                        <p>2000</p>
                    </div>
                    <div>
                        <p>2010</p>
                    </div>
                    <div>
                        <p>2020</p>
                    </div>
                </div>
                <div className={"above"}>
                    <div className={"current"} />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        </div>
    );
};

export default DistrictComponent;