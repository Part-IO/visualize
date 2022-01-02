import "../style/TimeLineComponent.scss";
import { Dispatch, SetStateAction, useEffect } from "react";
import { prevAll, years } from "../utils/Helper";

const DistrictComponent = ({
    getYear,
    setYear,
}: {
    getYear: number;
    setYear: Dispatch<SetStateAction<number>>;
}): JSX.Element => {
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

    useEffect(() => {
        const progressElement: HTMLDivElement = document.querySelector(".timeline-progress") as HTMLDivElement;
        const label: HTMLDivElement = progressElement.querySelector(".below") as HTMLDivElement;
        const steps: HTMLDivElement[] = [...(label.childNodes as NodeListOf<HTMLDivElement>)];
        steps.forEach((element: HTMLDivElement) =>
            element.addEventListener("click", () => {
                setYear(parseInt(element.id));
            })
        );
    });

    return (
        <div className={"timeline-outer"}>
            <div className={"timeline-progress"}>
                <div className={"above"}>
                    {years.map((index: number) => (
                        <div key={index} />
                    ))}
                </div>
                <div className={"below"}>
                    {years.map((value: number, index: number) => {
                        if (index === 0) {
                            return (
                                <div id={value.toString()} className={"current"}>
                                    {value}
                                </div>
                            );
                        } else {
                            return <div id={value.toString()}>{value}</div>;
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export default DistrictComponent;
