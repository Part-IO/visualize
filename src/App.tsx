import MainComponent from "./components/MainComponent";
import WelcomeComponent from "./components/WelcomeComponent";
import useLocalStorage from "use-local-storage";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import SwitchSelector from "react-switch-selector";
import { useState } from "react";

function App(): JSX.Element {
    const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDark, setIsDark] = useLocalStorage("darkMode", defaultDark);
    const [isAbsolute, setIsAbsolute] = useState<boolean>(false);

    const switchTheme = (checked: boolean) => {
        setIsDark(checked);
    };

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

    const switchThemeButton = (
        <DarkModeSwitch
            checked={isDark}
            onChange={switchTheme}
            moonColor={"var(--color-black)"}
            sunColor={"var(--color-black)"}
            className={"switch-theme-button"}
        />
    );

    const changeBarChartButton = (
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
    );

    return (
        <div data-theme={isDark ? "dark" : "light"}>
            <WelcomeComponent switchThemeButton={switchThemeButton} changeBarChartButton={changeBarChartButton} />
            <MainComponent isDark={isDark} isAbsolute={isAbsolute} />
        </div>
    );
}

export default App;
