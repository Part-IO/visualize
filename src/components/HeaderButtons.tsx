import "../style/HeaderButtons.scss";
import { useEffect, useRef, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import SwitchSelector from "react-switch-selector";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { ReactComponent as Sankey } from "../style/image/sankey.svg";
import { ReactComponent as SankeyDark } from "../style/image/sankey-dark.svg";

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
    const headerButtonContainer = useRef<HTMLDivElement>(null);
    const { width } = useWindowDimensions();

    useEffect(() => {
        const mapContainer = document.getElementById("right_content_container");
        if (mapContainer && headerButtonContainer.current) {
            const containerWidth = mapContainer.offsetWidth;
            headerButtonContainer.current.style.width = `${containerWidth > 270 ? containerWidth : 270}px`;
        }
    }, [width]);

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
            <div className={"header-button-container"} ref={headerButtonContainer}>
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
                <button onClick={() => setShowPopup(true)} className={"data-info-button"}>
                    i
                </button>
                <DarkModeSwitch
                    checked={isDark}
                    onChange={setIsDark}
                    moonColor={"var(--color-black)"}
                    sunColor={"var(--color-black)"}
                    className={"switch-theme-button"}
                />
            </div>

            <div className={`popup ${showPopup === null ? "" : showPopup ? "active" : "inactive"}`}>
                <div className={"content"}>
                    <div className={"content-text"}>
                        <div className="popup-close-btn" onClick={() => setShowPopup(false)}>
                            &times;
                        </div>
                        <h1>Datensätze</h1>
                        <p>
                            Um den Flächenverbrauch von 1980 bis 2020 berechnen zu können, wurden mehrere Datenbestände
                            verwendet. Hierbei wurden zwei unterschiedliche Systeme verwendet einmal das Automatisierte
                            Liegenschaftsbuch (ALB) von 1980 bis 2013. Seit 2014 gibt es das Amtliche
                            Liegenschaftskatasterinformationssystem (ALKIS®). Es war nötig zwei Datensätze zu verwenden,
                            da in Bayern seit 2014 ALB durch ALKIS® abgelöst wurde.
                            <br />
                            <br />
                            <a
                                href={
                                    "https://www.statistikdaten.bayern.de/genesis//online?operation=table&code=33111-201r&bypass=true&levelindex=0&levelid=1638273244475#abreadcrumb"
                                }
                            >
                                Bayerisches Landesamt für Statistik - ALB
                            </a>
                            <br />
                            <a
                                href={
                                    "https://www.statistikdaten.bayern.de/genesis//online?operation=table&code=33111-001r&bypass=true&levelindex=0&levelid=1638273260896#abreadcrumb"
                                }
                            >
                                Bayerisches Landesamt für Statistik - ALKIS®
                            </a>
                        </p>
                        <h1>Flächenverbrauch vs. versiegelte Fläche</h1>
                        <p>
                            Der Flächenverbrauch beschäftigt sich mit der Zunahme von Siedlungs- und Verkehrflächen
                            (SuV), dabei zählen Agrar- und Forstflächen nicht mit rein. Dies ist abzugrenzen von
                            versiegelter Fläche, denn der Flächenverbrauch beinhaltet auch nicht versiegelte Flächen wie
                            Gärten, Friedhöfe oder Stellplätze.
                        </p>
                        <h1>Berechnung Flächenverbrauch</h1>
                        <p>
                            Der Flächenverbrauch ergibt sich aus &quot;Fläche für Siedlung (10000)&quot; und
                            &quot;Fläche für Verkehr (20000)&quot;, dabei wird bei der Siedlungsfläche
                            &quot;Bergbaubetrieb (14000)&quot; und &quot;Tagebau, Grube, Steinbruch (15000)&quot;
                            abgezogen. Tagebau und co. gilt als nicht verbraucht Fläche, da diese in einigen Jahren als
                            See, Wiese oder Wald wieder verwendet wird. Welche Kategorien genau zum Flächenverbrauch
                            zählen sieht man im Diagramm am Ende dieser Seite.
                            <br />
                            <br />
                            Für weitere Informationen siehe:{" "}
                            <a
                                href={
                                    "https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Landwirtschaft-Forstwirtschaft-Fischerei/Flaechennutzung/Publikationen/_publikationen-innen-indikator-siedlungs-verkehrsflaeche.html"
                                }
                            >
                                Statistisches Bundesamt &quot;Erläuterung und Grafik zum Flächenindikator &quot;Anstieg
                                der Siedlungs- und Verkehrsfläche&quot; [ha/Tag]&quot;
                            </a>
                        </p>
                        <h1>Sprung in den Daten 2014</h1>
                        <p>
                            Da ALB und ALKIS® unterschiedliche Kategorien besitzen, wurden Flächen neu zu geordnet. Dies
                            hat einen Einfluss auf den berechneten Flächenverbrauch. Zum Beispiel zählten
                            Truppenübungsplätze unter ALB zu Grünflächen. In ALKIS® steht es jedem Bundesland frei
                            Truppenübungsplätze als Siedlungsfläche oder als Grünfläche zu kategorisieren. Dadurch kann
                            es passieren, dass der Flächenverbrauch einen Sprung nach unten oder oben macht. Eigene
                            Kategorien Eine Grenze des Projekts war es nur OpenData zu verwenden, dabei haben wir nicht
                            alle Kategorien, sondern größtenteils nur zusammengefasste Kategorien, erhalten.
                        </p>
                        <h1>Kategorisierung</h1>
                        <p>
                            Für das gestapelte Balkendiagramm wurden die ALB- / ALKIS®-Kategorien zu eigenen Bereichen
                            zusammengefasst. Dabei wurde darauf geachtet, dass verbrauchte Flächen nicht mit
                            unverbrauchten Flächen vermischt wurden. Die genaue Aufschlüsselung sieht man im folgenden
                            Diagramm. Von links nach rechts stellen die Spalten die Gesamtfläche, die (un)verbrauchte
                            Fläche, die eigenen Bereiche und die ALB- / ALKIS®-Kategorien dar.
                        </p>
                    </div>
                    <div className={"content-image"}>{isDark ? <SankeyDark /> : <Sankey />}</div>
                </div>
            </div>
        </>
    );
};

export default HeaderButtons;
