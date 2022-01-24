import "../style/PopupComponent.scss";
import { PropsWithChildren } from "react";

const PopupComponent = (
    props: PropsWithChildren<{
        showPopup: boolean | null;
        setShowPopup: (showPopup: boolean | null) => void;
    }>
): JSX.Element => {
    return (
        <div className={`popup ${props.showPopup === null ? "" : props.showPopup ? "active" : "inactive"}`}>
            <div className={"content"}>
                <div className="popup-close-btn" onClick={() => props.setShowPopup(false)}>
                    &times;
                </div>
                {props.children}
            </div>
        </div>
    );
};

export default PopupComponent;
