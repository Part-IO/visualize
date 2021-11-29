import ScrollComponent from "./components/ScrollComponent";
import InteractiveMap from "./components/InteractiveMap";
import TimelineComponent from "./components/TimelineComponent";

function App(): JSX.Element {
    return (
        <>
            <ScrollComponent mapComponent={<InteractiveMap />} />
        </>
    );
}

export default App;
