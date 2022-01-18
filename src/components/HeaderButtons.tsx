import "../style/HeaderButtons.scss";
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
