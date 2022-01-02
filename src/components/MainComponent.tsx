import { useState } from "react";
import DistrictStepComponent from "./DistrictStepComponent";
import "../style/ScrollComponent.scss";
import TimeLineComponent from "./TimeLineComponent";
import InteractiveMapContainer from "./InteractiveMapContainer";
import TextTransition, { presets } from "react-text-transition";

const MainComponent = (): JSX.Element => {
    const [getCurrentCountries, setCurrentCountries] = useState<string>("Bayern");
    const [getCurrentYear, setCurrentYear] = useState<number>(1980);

    return (
        <div>
            <div id={"main-component"} style={{ display: "block" }}>
                <div className={"graphic-container"}>
                    <div className={"district"}>
                        <DistrictStepComponent getDistrict={getCurrentCountries} setDistrict={setCurrentCountries} />
                    </div>
                    <div className={"main-view"}>
                        <div className={"main-view-title"}>
                            <TextTransition text={getCurrentCountries} springConfig={presets.wobbly} />
                            <div className={"text-transition"} style={{ margin: "0 20px" }}>
                                -
                            </div>
                            <TextTransition text={getCurrentYear} springConfig={presets.wobbly} />
                        </div>
                    </div>
                    <div className={"graphic"}>
                        <div className={"map"}>
                            <InteractiveMapContainer
                                getYear={getCurrentYear}
                                getDistrict={getCurrentCountries}
                                setDistrict={setCurrentCountries}
                            />
                        </div>
                    </div>
                </div>
                <div id={"timeline-component"} className={"timeline"}>
                    <TimeLineComponent getYear={getCurrentYear} setYear={setCurrentYear} />
                </div>
            </div>
        </div>
    );
};

export default MainComponent;
