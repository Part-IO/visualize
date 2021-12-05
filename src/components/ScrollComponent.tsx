import { createRef, useEffect, useState } from "react";
import { Scrollama, Step } from "react-scrollama";
import ScrollStepComponent from "./ScrollStepComponent";
import "../style/ScrollComponent.scss";
import TimeLineComponent from "./TimeLineComponent";
import scroller, { ScrollerObserver } from "../utils/Scroller";
import { districts } from "../utils/Helper";

interface IState {
    data: string;
    steps: string[];
    progress: number;
}

const ScrollComponent = (props: { mapComponent: JSX.Element }): JSX.Element => {
    const initialState: IState = {
        data: "",
        steps: districts,
        progress: 0,
    };

    const [getState, setGetState] = useState<IState>(initialState);

    const onStateChange: ScrollerObserver = (district: string) => {
        setGetState((state: IState) => {
            return { ...state, data: district };
        });
    };

    useEffect(() => {
        scroller.attach(onStateChange);
        return () => scroller.detach(onStateChange);
    });

    const onStepEnter = (e) => {
        const { data } = e;
        scroller.onScrollStateChange(data);
    };

    const onStepExit = ({ direction, data }) => {
        if (direction === "up" && data === getState.steps[0]) {
            setGetState((state: IState) => {
                return { ...state, data: "" };
            });
        }
    };

    const onStepProgress = ({ progress }) => {
        setGetState((state: IState) => {
            return { ...state, progress: progress };
        });
    };

    return (
        <div>
            <div id={"main-component"} style={{ display: "block" }}>
                <div id={"timeline-component"} className="timeline">
                    <TimeLineComponent />
                </div>
                <div className="graphic-container">
                    <div className="graphic">{props.mapComponent}</div>
                    <div className="scroller">
                        <Scrollama
                            onStepEnter={onStepEnter}
                            onStepExit={onStepExit}
                            progress
                            order
                            onStepProgress={onStepProgress}
                            offset="0.23"
                        >
                            {getState.steps.map((value: string) => {
                                return (
                                    <Step data={value} key={value}>
                                        <div id={value + "-view"} className={"step"}>
                                            <p>{value}</p>
                                        </div>
                                    </Step>
                                );
                            })}
                        </Scrollama>
                    </div>
                    <div className="district">
                        <ScrollStepComponent />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollComponent;
