import ScrollComponent from "./components/ScrollComponent";
import InteractiveMap from "./components/InteractiveMap";
import WelcomeComponent from "./components/WelcomeComponent";

function App(): JSX.Element {
    return (
        <>
            <WelcomeComponent />
            <ScrollComponent mapComponent={<InteractiveMap />} />
        </>
    );
}

export default App;
