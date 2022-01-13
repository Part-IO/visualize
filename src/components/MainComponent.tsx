import { useEffect, useMemo, useState } from "react";
import DistrictStepComponent from "./DistrictStepComponent";
import "../style/MainComponent.scss";
import TimeLineComponent from "./TimeLineComponent";
import InteractiveMapContainer from "./InteractiveMapContainer";
import TextTransition, { presets } from "react-text-transition";
import ModalComponent from "./ModalComponent";
import LineGraphComponent from "./LineGraphComponent";
import StackedBarComponent from "./StackedBarComponent";
import RBDataYear from "../data/RBYear.json";
import LKDataYear from "../data/LKYear.json";
import { IData } from "../utils/Helper";

export interface ICLickedLK {
    BEZ: string;
    GEN: string;
    AGS: string;
}

const MainComponent = ({ isDark, isAbsolute }: { isDark: boolean; isAbsolute: boolean }): JSX.Element => {
    const [getCurrentCountries, setCurrentCountries] = useState<string>("Bayern");
    const [getCurrentYear, setCurrentYear] = useState<number>(1980);
    const [modalState, setModalState] = useState<boolean>(false);

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

    const getDataRB: IData = useMemo(() => {
        return RBDataYear[`31.12.${getCurrentYear}`].reduce(
            (obj, item) => Object.assign(obj, { [item.AGS]: [item] }),
            {}
        );
    }, [getCurrentYear]);
    const getDataLK: IData = useMemo(() => {
        return LKDataYear[`31.12.${getCurrentYear}`].reduce(
            (obj, item) => Object.assign(obj, { [item.AGS]: [item] }),
            {}
        );
    }, [getCurrentYear]);

    /* setDataRB(
            RBDataYear[`31.12.${getCurrentYear}`]
                .flat(1)
                .reduce((obj, item) => Object.assign(obj, { [item.AGS]: item }), {})
        );
        setDataLK(
            LKDataYear[`31.12.${getCurrentYear}`]
                .flat(1)
                .reduce((obj, item) => Object.assign(obj, { [item.AGS]: item }), {})
        );*/

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
        <>
            {getDataRB && (
                <div id={"main-component"} className={"main-component"}>
                    <ModalComponent
                        show={modalState}
                        modalType={"info"}
                        handleModalClick={handleModalClick}
                        title={titleValue}
                        content={textValue}
                        button={moreInfoButton}
                        closeButton={true}
                    />
                    <div className={"graphic-container"}>
                        <div className={"district"}>
                            <DistrictStepComponent
                                getDistrict={getCurrentCountries}
                                setDistrict={setCurrentCountries}
                            />
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
                                isAbsolute={isAbsolute}
                                getYear={getCurrentYear}
                                getDistrict={getCurrentCountries}
                                getDataRB={getDataRB}
                                getDataLK={getDataLK}
                                isDark={isDark}
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
                                    setClickedLK={setClickedLK}
                                />
                            </div>
                            <div className={"map-legend-container"}>
                                <div className={"map-legend"}>
                                    <div>0%</div>
                                    <div className={"map-legend-bar"} />
                                    <div>100%</div>
                                </div>
                                <code className={"info"}>
                                    <TextTransition
                                        text={getClickedLK.BEZ}
                                        springConfig={presets.gentle}
                                        noOverflow={true}
                                    />
                                    <div className={"text-transition"} style={{ margin: "0 10px" }}>
                                        -
                                    </div>
                                    <TextTransition text={getClickedLK.GEN} springConfig={presets.gentle} />
                                </code>
                            </div>
                            <div className={"line-graph"}>
                                <LineGraphComponent
                                    getClickedLK={getClickedLK}
                                    getCurrentYear={getCurrentYear}
                                    isDark={isDark}
                                />
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
            )}
        </>
    );
};

export default MainComponent;
