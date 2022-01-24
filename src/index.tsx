import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./style/fonts/LiberationMono-Bold-webfont.woff";
import "./style/fonts/LiberationMono-BoldItalic-webfont.woff";
import "./style/fonts/LiberationMono-Italic-webfont.woff";
import "./style/fonts/LiberationMono-Regular-webfont.woff";
import App from "./App";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
