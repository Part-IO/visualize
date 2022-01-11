import MainComponent from "./components/MainComponent";
import WelcomeComponent from "./components/WelcomeComponent";
import useLocalStorage from "use-local-storage";
import { DarkModeSwitch } from "react-toggle-dark-mode";

function App(): JSX.Element {
    const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDark, setIsDark] = useLocalStorage("darkMode", defaultDark);

    const switchTheme = (checked: boolean) => {
        setIsDark(checked);
    };

    const switchThemeButton = (
        <DarkModeSwitch
            style={{ display: "inline-flex", margin: "1vw" }}
            checked={isDark}
            onChange={switchTheme}
            moonColor={"var(--color-black)"}
            sunColor={"var(--color-black)"}
        />
    );

    return (
        <div data-theme={isDark ? "dark" : "light"} style={{ backgroundColor: "var(--color-white)" }}>
            <WelcomeComponent />
            <MainComponent switchThemeButton={switchThemeButton} isDark={isDark} />
        </div>
    );
}

export default App;
