import "../style/ModalComponent.scss";
import { useEffect, useRef } from "react";

const ModalComponent = ({ show, handleModalClick }: { show: boolean; handleModalClick: () => void }): JSX.Element => {
    const modalRef = useRef(null);

    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            // close modal if you click outside
            if (show && modalRef.current && !(modalRef.current as HTMLElement).contains(e.target)) {
                handleModalClick();
            }
        };
        document.addEventListener("click", checkIfClickedOutside);
        return () => {
            // Cleanup the event listener
            document.removeEventListener("click", checkIfClickedOutside);
        };
    }, [show, handleModalClick]);

    const text = (
        <>
            In ALKIS<sup>®</sup> wurden die bisher getrennt vorgehaltenen Liegenschaftskatasterdaten der{" "}
            <b>Digitalen Flurkarte</b> (DFK) und des <b>Automatisierten Liegenschaftsbuchs</b> (ALB) in einem System
            zusammengeführt und um neue Datenbestände, wie die <b>Tatsächliche Nutzung</b> (TN), die{" "}
            <b>Bodenschätzung</b> u.a. ergänzt.
        </>
    );
    const title = (
        <>
            Wechsel von DFK + ALB zu ALKIS<sup>®</sup>
        </>
    );
    return (
        <>
            {show && (
                <div className={"popup-module popup-wrap info show"}>
                    <div className={"popup-body bounceInDown"} ref={modalRef}>
                        <div className={"popup-icon"} />
                        <div className={"title"}>{title}</div>
                        <div className={"text"}>{text}</div>
                        <div className={"btn-wrap"}>
                            <button className={"btn btn-more"} onClick={handleModalClick}>
                                Mehr informationen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalComponent;
