import regierungsbezirke from "../data/regierungsbezirke.json";
import { Component } from "react";

export class InteractiveMap extends Component {
    componentDidMount() {
        console.log(regierungsbezirke);
    }

    render() {
        return (
            <div id={"MapWrapper"}>
                <h1 style={{ textAlign: "center" }}>Test Map</h1>
            </div>
        );
    }
}
