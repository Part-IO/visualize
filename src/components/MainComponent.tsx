import { useEffect, useState } from "react";
import DistrictStepComponent from "./DistrictStepComponent";
import "../style/MainComponent.scss";
import TimeLineComponent from "./TimeLineComponent";
import InteractiveMapContainer from "./InteractiveMapContainer";
import TextTransition, { presets } from "react-text-transition";
import DataLoader, { GroupBy, groupBy, IData } from "../utils/DataLoader";
import ModalComponent from "./ModalComponent";
import StackedBarComponent from "./StackedBarComponent";

const MainComponent = (): JSX.Element => {
    const [getCurrentCountries, setCurrentCountries] = useState<string>("Bayern");
    const [getCurrentYear, setCurrentYear] = useState<number>(1980);
    const [modalState, setModalState] = useState<boolean>(false);
    const [getDataRB, setDataRB] = useState<IData>(
        groupBy(GroupBy.AGS)(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(getCurrentYear))
    );
    const [getDataLK, setDataLK] = useState<IData>(
        groupBy(GroupBy.AGS)(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(getCurrentYear))
    );

    const handleModalClick = (): void => {
        setModalState((prevState) => !prevState);
    };

    useEffect(() => {
        if (modalState) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    });

    /**
     * Update Data if the year change
     */
    useEffect(() => {
        const groupByAGSFunc = groupBy(GroupBy.AGS);
        setDataRB(groupByAGSFunc(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(getCurrentYear)));
        setDataLK(groupByAGSFunc(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(getCurrentYear)));
    }, [getCurrentYear]);

    return (
        <div>
            <div id={"main-component"} style={{ display: "block" }}>
                <ModalComponent show={modalState} handleModalClick={handleModalClick} />
                <div className={"graphic-container"}>
                    <div className={"district"}>
                        <DistrictStepComponent getDistrict={getCurrentCountries} setDistrict={setCurrentCountries} />
                    </div>
                    <div className={"main-view"}>
                        <code className={"main-view-title"}>
                            <TextTransition text={getCurrentCountries} springConfig={presets.gentle} />
                            <div className={"text-transition"} style={{ margin: "0 10px" }}>
                                -
                            </div>
                            <TextTransition text={getCurrentYear} springConfig={presets.gentle} />
                        </code>
                        <StackedBarComponent
                            getYear={getCurrentYear}
                            getDistrict={getCurrentCountries}
                            getDataRB={getDataRB}
                            getDataLK={getDataLK}
                        />
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
                    </div>
                </div>
                <div id={"timeline-component"} className={"timeline"}>
                    <TimeLineComponent
                        getYear={getCurrentYear}
                        setYear={setCurrentYear}
                        handleModalClick={handleModalClick}
                    />
                </div>
            </div>
        </div>
    );
};

export default MainComponent;
