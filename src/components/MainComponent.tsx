import { useEffect, useState } from "react";
import DistrictStepComponent from "./DistrictStepComponent";
import "../style/MainComponent.scss";
import TimeLineComponent from "./TimeLineComponent";
import InteractiveMapContainer from "./InteractiveMapContainer";
import TextTransition, { presets } from "react-text-transition";
import DataLoader, { GroupBy, groupBy, IData, IDataEntry } from "../utils/DataLoader";
import StackedBarComponent from "./StackedBarComponent";
import LineGraphComponent from "./LineGraphComponent";
import dataLoader from "../utils/DataLoader";
import data from "../data/data.json";

const MainComponent = (): JSX.Element => {
    const [getCurrentCountries, setCurrentCountries] = useState<string>("Bayern");
    const [getCurrentYear, setCurrentYear] = useState<number>(1980);
    const [getDataRB, setDataRB] = useState<IData>(
        groupBy(GroupBy.AGS)(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(getCurrentYear))
    );
    const [getDataLK, setDataLK] = useState<IData>(
        groupBy(GroupBy.AGS)(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(getCurrentYear))
    );
    const [getSelectedData, setSelectedData] = useState<IDataEntry[]>(
        (data as IDataEntry[]).filter((entry: IDataEntry) => entry.municipality == getCurrentCountries)
    );

    /**
     * Update Data if the year change
     */
    useEffect(() => {
        const groupByAGSFunc = groupBy(GroupBy.AGS);
        setDataRB(groupByAGSFunc(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(getCurrentYear)));
        setDataLK(groupByAGSFunc(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(getCurrentYear)));
    }, [getCurrentYear]);

    useEffect(() => {
        setSelectedData(data.filter((entry: IDataEntry) => entry.municipality == getCurrentCountries));
    }, [getCurrentCountries]);

    return (
        <div id={"main-component"} className={"main-component"}>
            <div className={"graphic-container"}>
                <div className={"district"}>
                    <DistrictStepComponent getDistrict={getCurrentCountries} setDistrict={setCurrentCountries} />
                </div>
                <div className={"main-view"}>
                    <div className={"main-view-title"}>
                        <TextTransition text={getCurrentCountries} springConfig={presets.gentle} />
                        <div className={"text-transition"} style={{ margin: "0 10px" }}>
                            -
                        </div>
                        <TextTransition text={getCurrentYear} springConfig={presets.gentle} />
                    </div>
                    <div className={"main-view-graph"}>
                        <StackedBarComponent />
                    </div>
                </div>
                <div className={"graphic"}>
                    <div className={"map"}>
                        <InteractiveMapContainer
                            getDistrict={getCurrentCountries}
                            setDistrict={setCurrentCountries}
                            getDataRB={getDataRB}
                            getDataLK={getDataLK}
                        />
                    </div>
                    <div className={"line-graph"}>
                        <LineGraphComponent getSelectedData={getSelectedData} getCurrentYear={getCurrentYear} />
                    </div>
                </div>
            </div>
            <div id={"timeline-component"} className={"timeline"}>
                <TimeLineComponent getYear={getCurrentYear} setYear={setCurrentYear} />
            </div>
        </div>
    );
};

export default MainComponent;
