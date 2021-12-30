import "../style/ScrollComponent.scss";
import TimeLineComponent from "./TimeLineComponent";
import StackedBarComponent from "./StackedBarComponent";
import ScrollStepComponent from "./ScrollStepComponent";
import DataLoader from "../utils/DataLoader";

interface IState {
    data: string;
    districts: string[];
    govermentDistricts: string[];
}

const ScrollComponent = (props: { mapComponent: JSX.Element }): JSX.Element => {
    const initialState: IState = {
        data: "",
        districts: [],
        govermentDistricts: [],
    };

    return (
        <div>
            <div id={"main-component"} style={{ display: "block" }}>
                <div className="graphic-container">
                    <div className="district">
                        <ScrollStepComponent />
                    </div>
                    <div className="scroller">
                        <div className={"step"}>
                            <p>Hallo</p>
                            <StackedBarComponent />
                        </div>
                    </div>
                    <div className="graphic">
                        <div className="map">{props.mapComponent}</div>
                    </div>
                </div>
                <div id={"timeline-component"} className="timeline">
                    <TimeLineComponent />
                </div>
            </div>
        </div>
    );
};

export default ScrollComponent;
