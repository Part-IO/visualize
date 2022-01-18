import "../style/HeaderButtons.scss";
import { useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import SwitchSelector from "react-switch-selector";

const HeaderButtons = ({
    isDark,
    setIsDark,
    setIsAbsolute,
}: {
    isDark: boolean;
    setIsDark: (isDark: boolean) => void;
    setIsAbsolute: (isAbsolute: boolean) => void;
}): JSX.Element => {
    const [showPopup, setShowPopup] = useState<boolean | null>(null);

    const switchOptions = [
        {
            label: "Absolut",
            value: false,
            selectedBackgroundColor: "var(--color-black)",
        },
        {
            label: "Prozentual",
            value: true,
            selectedBackgroundColor: "var(--color-black)",
        },
    ];

    return (
        <>
            <DarkModeSwitch
                checked={isDark}
                onChange={setIsDark}
                moonColor={"var(--color-black)"}
                sunColor={"var(--color-black)"}
                className={"switch-theme-button"}
            />

            <button onClick={() => setShowPopup(true)} className={"data-info-button"}>
                i
            </button>
            <div className={`popup ${showPopup === null ? "" : showPopup ? "active" : "inactive"}`}>
                <div className={"content"}>
                    <div className="popup-close-btn" onClick={() => setShowPopup(false)}>
                        &times;
                    </div>
                    <h1>Wie die Daten verarbeitet wurden</h1>
                    <p>
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                        ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
                        dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
                        sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
                        justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                        ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos
                        et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
                        est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit
                        esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et
                        iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait
                        nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh
                        euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
                        quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo
                        consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
                    </p>
                </div>
            </div>

            <div className={"switch"}>
                <SwitchSelector
                    onChange={(state) => setIsAbsolute(state as boolean)}
                    options={switchOptions}
                    backgroundColor={"var(--color-white)"}
                    fontColor={"var(--color-black)"}
                    border={"1px solid var(--color-black)"}
                    optionBorderRadius={3}
                    wrapperBorderRadius={4}
                    selectedFontColor={"var(--color-white)"}
                    selectionIndicatorMargin={-0.7}
                />
            </div>
        </>
    );
};

export default HeaderButtons;
