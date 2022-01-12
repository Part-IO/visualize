import "../style/ModalComponent.scss";
import { useEffect, useRef } from "react";

const ModalComponent = ({
    show,
    handleModalClick,
    title,
    content,
    button,
    modalType,
    closeButton,
}: {
    show: boolean;
    modalType: string;
    handleModalClick?: () => void;
    title: JSX.Element;
    content: JSX.Element;
    button?: JSX.Element;
    closeButton?: boolean;
}): JSX.Element => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (handleModalClick) {
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
        }
    }, [show, handleModalClick]);

    const modalClass = "popup-module popup-wrap " + modalType + " show";

    return (
        <>
            {show && (
                <div className={modalClass}>
                    <div className={"popup-body bounceInDown"} ref={modalRef}>
                        <div className={"popup-icon"} />
                        <div className={"title"}>{title}</div>
                        <div className={"text"}>{content}</div>
                        {button && <div className={"btn-wrap"}>{button}</div>}
                        {closeButton && (
                            <button type={"button"} className={"close"} onClick={handleModalClick}>
                                ×
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalComponent;
