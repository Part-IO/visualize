import "../style/DistrictStepComponent.scss";
import { Dispatch, SetStateAction, useEffect } from "react";
import { districts, prevAll } from "../utils/Helper";

const DistrictStepComponent = ({
    getDistrict,
    setDistrict,
}: {
    getDistrict: string;
    setDistrict: Dispatch<SetStateAction<string>>;
}): JSX.Element => {
    /**
     * Update view if the user click on a district at the left district-bar
     */

    useEffect(() => {
        const progressElement: HTMLDivElement = document.querySelector(".progress") as HTMLDivElement;
        const label: HTMLDivElement = progressElement.querySelector(".left") as HTMLDivElement;
        const steps: HTMLDivElement[] = [...(label.childNodes as NodeListOf<HTMLDivElement>)];

        const element: HTMLDivElement = document.getElementById(getDistrict) as HTMLDivElement;

        if (element !== null) {
            steps.forEach((e: HTMLDivElement) => {
                e.classList.replace("current", "prev");
            });

            element.classList.add("current");
            prevAll(element)
                .slice(1)
                .forEach((e) => e.classList.add("prev"));
        }
    }, [getDistrict]);

    return (
        <div className={"outer"}>
            <div className={"progress"}>
                <div id={"district_left"} className={"left"}>
                    {districts.map((value: string, index: number) => {
                        if (index === 0) {
                            return (
                                <div
                                    key={index}
                                    id={value}
                                    className={"current"}
                                    onClick={() => {
                                        setDistrict(value);
                                    }}
                                >
                                    <p>{value}</p>
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    key={index}
                                    id={value}
                                    onClick={() => {
                                        setDistrict(value);
                                    }}
                                >
                                    <p>{value}</p>
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

export default DistrictStepComponent;
