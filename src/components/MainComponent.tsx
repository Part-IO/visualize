import { useEffect, useState } from "react";
import DistrictStepComponent from "./DistrictStepComponent";
import "../style/MainComponent.scss";
import TimeLineComponent from "./TimeLineComponent";
import InteractiveMapContainer from "./InteractiveMapContainer";
import TextTransition, { presets } from "react-text-transition";
import DataLoader, { GroupBy, groupBy, IData } from "../utils/DataLoader";
import ModalComponent from "./ModalComponent";
import LineGraphComponent from "./LineGraphComponent";
import StackedBarComponent from "./StackedBarComponent";

export interface ICLickedLK {
    BEZ: string;
    GEN: string;
    AGS: string;
}

const MainComponent = ({ isDark }: { isDark: boolean }): JSX.Element => {
    console.log("render MainComponent");
    const [getCurrentCountries, setCurrentCountries] = useState<string>("Bayern");
    const [getCurrentYear, setCurrentYear] = useState<number>(1980);
    const [modalState, setModalState] = useState<boolean>(false);
    const [getDataRB, setDataRB] = useState<IData>(
        groupBy(GroupBy.AGS)(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(getCurrentYear))
    );
    const [getDataLK, setDataLK] = useState<IData>(
        groupBy(GroupBy.AGS)(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(getCurrentYear))
    );

    const [getClickedLK, setClickedLK] = useState<ICLickedLK>({ BEZ: "Bundesland", GEN: "Bayern", AGS: "09" });

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

    const textValue: JSX.Element = (
        <>
            In ALKIS<sup>®</sup> wurden die bisher getrennt vorgehaltenen Liegenschaftskatasterdaten der{" "}
            <b>Digitalen Flurkarte</b> (DFK) und des <b>Automatisierten Liegenschaftsbuchs</b> (ALB) in einem System
            zusammengeführt und um neue Datenbestände, wie die <b>Tatsächliche Nutzung</b> (TN), die{" "}
            <b>Bodenschätzung</b> u.a. ergänzt.
        </>
    );
    const titleValue: JSX.Element = (
        <>
            Wechsel von DFK + ALB zu ALKIS<sup>®</sup>
        </>
    );

    const moreInfoButton: JSX.Element = (
        <button
            className={"btn btn-more"}
            onClick={() => {
                window.open("https://www.adbv-wuerzburg.de/file/pdf/6154/ALKIS_kompakt_Web_A3.pdf");
                handleModalClick();
            }}
        >
            Mehr informationen
        </button>
    );
    return (
        <div id={"main-component"} className={"main-component"}>
            <ModalComponent
                show={modalState}
                modalType={"info"}
                handleModalClick={handleModalClick}
                title={titleValue}
                content={textValue}
                button={moreInfoButton}
            />
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
                        getClickedLK={getClickedLK}
                        getDataRB={getDataRB}
                        getDataLK={getDataLK}
                    />
                </div>
                <div className={"graphic"}>
                    <div className={"map"}>
                        <InteractiveMapContainer
                            isDark={isDark}
                            getDistrict={getCurrentCountries}
                            setDistrict={setCurrentCountries}
                            getDataRB={getDataRB}
                            getDataLK={getDataLK}
                            getClickedLK={getClickedLK}
                            setClickedLK={setClickedLK}
                        />
                    </div>
                    <div className={"line-graph"}>
                        <LineGraphComponent getClickedLK={getClickedLK} getCurrentYear={getCurrentYear} />
                    </div>
                </div>
            </div>
            <div id={"timeline-component"} className={"timeline"}>
                <TimeLineComponent
                    isDark={isDark}
                    getYear={getCurrentYear}
                    setYear={setCurrentYear}
                    handleModalClick={handleModalClick}
                />
            </div>
        </div>
    );
};

export default MainComponent;
