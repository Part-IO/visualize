import React, { PureComponent } from "react";
import { Scrollama, Step } from "react-scrollama";
import "./Scroll.css";

class Demo extends PureComponent {
    state = {
        data: 0,
        steps: [10, 20, 30, 40],
        progress: 0,
    };

    onStepEnter = (e) => {
        const { data, entry, direction } = e;
        this.setState({ data });
    };

    onStepExit = ({ direction, data }) => {
        if (direction === "up" && data === this.state.steps[0]) {
            this.setState({ data: 0 });
        }
    };

    onStepProgress = ({ progress }) => {
        this.setState({ progress });
    };

    render(): JSX.Element {
        const { data, steps, progress } = this.state;

        return (
            <div>
                <div className="graphicContainer">
                    <div className="graphic">
                        <p>{data}</p>
                    </div>
                    <div className="scroller">
                        <Scrollama
                            onStepEnter={this.onStepEnter}
                            onStepExit={this.onStepExit}
                            progress
                            onStepProgress={this.onStepProgress}
                            offset="400px"
                            debug
                        >
                            {steps.map((value) => {
                                const isVisible = value === data;
                                const background = isVisible ? `rgba(44,127,184, ${progress})` : "white";
                                const visibility = isVisible ? "visible" : "hidden";
                                return (
                                    <Step data={value} key={value}>
                                        <div className="step" style={{ background }}>
                                            <p>step value: {value}</p>
                                            <p style={{ visibility }}>{Math.round(progress * 1000) / 10 + "%"}</p>
                                        </div>
                                    </Step>
                                );
                            })}
                        </Scrollama>
                    </div>
                </div>
            </div>
        );
    }
}

export default Demo;
