import { useState } from "react";
import { Scrollama, Step } from "react-scrollama";
import "../style/Scroll.css";

interface IState {
    data: number;
    steps: number[];
    progress: number;
}

const ScrollComponent = (): JSX.Element => {
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
            <div className="graphicContainer">
                <div className="graphic">
                    <p>{getState.data}</p>
                </div>
                <div className="scroller">
                    <Scrollama
                        onStepEnter={onStepEnter}
                        onStepExit={onStepExit}
                        progress
                        onStepProgress={onStepProgress}
                        offset="400px"
                    >
                        {getState.steps.map((value) => {
                            const isVisible = value === getState.data;
                            const background = isVisible ? `rgba(44,127,184, ${getState.progress})` : "white";
                            const visibility = isVisible ? "visible" : "hidden";
                            return (
                                <Step data={value} key={value}>
                                    <div className="step" style={{ background }}>
                                        <p>step value: {value}</p>
                                        <p style={{ visibility }}>{Math.round(getState.progress * 1000) / 10 + "%"}</p>
                                    </div>
                                </Step>
                            );
                        })}
                    </Scrollama>
                </div>
            </div>
        </div>
    );
};

export default ScrollComponent;
