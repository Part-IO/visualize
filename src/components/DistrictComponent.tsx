import "../style/District.scss";
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
        const progressElement: HTMLDivElement = document.querySelector(".progress") as HTMLDivElement;
        const label: HTMLDivElement = progressElement.querySelector(".left") as HTMLDivElement;
        const steps: HTMLDivElement[] = [...(label.childNodes as NodeListOf<HTMLDivElement>)];
        steps.forEach((element: HTMLDivElement) =>
            element.addEventListener("mouseenter", () => {
                onHover(element, steps);
            })
        );
    });

    return (
        <div className={"outer"}>
            <div className={"progress"}>
                <div className={"left"}>
                    <div className={"current"}>Mittelfranken</div>
                    <div>Niederbayern</div>
                    <div>Oberbayern</div>
                    <div>Oberfranken</div>
                    <div>Oberpfalz</div>
                    <div>Schwaben</div>
                    <div>Unterfranken</div>
                </div>
                <div className={"right"}>
                    <div className={"current"} />
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
