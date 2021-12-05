import { useState } from "react";
import { Scrollama, Step } from "react-scrollama";
import ScrollStepComponent from "./ScrollStepComponent";
import "../style/ScrollComponent.scss";
import TimeLineComponent from "./TimeLineComponent";

interface IState {
    data: number;
    steps: number[];
    progress: number;
}

const ScrollComponent = (props: { mapComponent: JSX.Element }): JSX.Element => {
    const initialState: IState = {
        data: 0,
        steps: [10, 20, 30, 40],
        progress: 0,
    };

    const [getState, setGetState] = useState<IState>(initialState);

    const onStepEnter = (e) => {
        const { data } = e;
        setGetState((state: IState) => {
            return { ...state, data: data };
        });
    };

    const onStepExit = ({ direction, data }) => {
        if (direction === "up" && data === getState.steps[0]) {
            setGetState((state: IState) => {
                return { ...state, data: 0 };
            });
        }
    };

    const onStepProgress = ({ progress }) => {
        setGetState((state: IState) => {
            return { ...state, progress: progress };
        });
    };

    console.log(getState);

    return (
        <div>
            <div id={"main-component"} style={{ display: "block" }}>
                <div className="timeline">
                    <TimeLineComponent />
                </div>
                <div className="graphic-container">
                    <div className="graphic">{props.mapComponent}</div>
                    <div className="scroller">
                        <Scrollama
                            onStepEnter={onStepEnter}
                            onStepExit={onStepExit}
                            progress
                            onStepProgress={onStepProgress}
                            offset="0.2"
                            debug
                        >
                            {getState.steps.map((value) => {
                                const isVisible = value === getState.data;
                                const background = isVisible ? `rgba(44,127,184, ${getState.progress})` : "white";
                                const visibility = isVisible ? "visible" : "hidden";
                                return (
                                    <Step data={value} key={value}>
                                        <div className="step" style={{ background }}>
                                            <p>step value: {value}</p>
                                            <p style={{ visibility }}>
                                                {Math.round(getState.progress * 1000) / 10 + "%"}
                                            </p>
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
