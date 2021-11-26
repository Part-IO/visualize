import ScrollComponent from "./components/ScrollComponent";
import InteractiveMap from "./components/InteractiveMap";

function App(): JSX.Element {
    return (
        <>
            <ScrollComponent mapComponent={<InteractiveMap />} />
        </>
    );
}

export default App;
