import { ReactComponent as Sankey } from "../style/image/sankey.svg";
import { ReactComponent as SankeyDark } from "../style/image/sankey-dark.svg";
import PopupComponent from "./PopupComponent";

const InformationPopup = ({
    isDark,
    showPopup,
    setShowPopup,
}: {
    isDark: boolean;
    showPopup: boolean | null;
    setShowPopup: (showPopup: boolean | null) => void;
}): JSX.Element => {
    return (
        <PopupComponent showPopup={showPopup} setShowPopup={setShowPopup}>
            <div className={"content-text"}>
                <h1>Datensätze</h1>
                <p>
                    Um den Flächenverbrauch von 1980 bis 2020 berechnen zu können, wurden mehrere Datenbestände
                    verwendet. Hierbei wurden zwei unterschiedliche Systeme verwendet einmal das{" "}
                    <b>Automatisierte Liegenschaftsbuch</b> (ALB) von 1980 bis 2013. Seit 2014 gibt es das <b>A</b>
                    mtliche <b>Liegenschaftskatasterinformationssystem</b> (ALKIS®). Es war nötig zwei Datensätze zu
                    verwenden, da in Bayern seit 2014 ALB durch ALKIS® abgelöst wurde.
                    <br />
                    <br />
                    <a
                        href="https://www.statistikdaten.bayern.de/genesis//online?operation=table&code=33111-201r&bypass=true&levelindex=0&levelid=1638273244475#abreadcrumb"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Bayerisches Landesamt für Statistik - ALB
                    </a>
                    <br />
                    <a
                        href="https://www.statistikdaten.bayern.de/genesis//online?operation=table&code=33111-001r&bypass=true&levelindex=0&levelid=1638273260896#abreadcrumb"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Bayerisches Landesamt für Statistik - ALKIS®
                    </a>
                </p>
                <h1>Flächenverbrauch vs. versiegelte Fläche</h1>
                <p>
                    Der Flächenverbrauch beschäftigt sich mit der Zunahme von <b>S</b>iedlungs- <b>u</b>nd <b>V</b>
                    erkehrflächen (SuV), dabei zählen Agrar- und Forstflächen nicht mit rein. Dies ist abzugrenzen von
                    versiegelter Fläche, denn der Flächenverbrauch beinhaltet auch nicht versiegelte Flächen wie Gärten,
                    Friedhöfe oder Stellplätze.
                </p>
                <h1>Berechnung Flächenverbrauch</h1>
                <p>
                    Der Flächenverbrauch ergibt sich aus &quot;Fläche für Siedlung (10000)&quot; und &quot;Fläche für
                    Verkehr (20000)&quot;, dabei wird bei der Siedlungsfläche &quot;Bergbaubetrieb (14000)&quot; und
                    &quot;Tagebau, Grube, Steinbruch (15000)&quot; abgezogen. Tagebau und co. gilt als nicht verbraucht
                    Fläche, da diese in einigen Jahren als See, Wiese oder Wald wieder verwendet wird. Welche Kategorien
                    genau zum Flächenverbrauch zählen sieht man im Diagramm am Ende dieser Seite.
                    <br />
                    <br />
                    Für weitere Informationen siehe:{" "}
                    <a
                        href={
                            "https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Landwirtschaft-Forstwirtschaft-Fischerei/Flaechennutzung/Publikationen/_publikationen-innen-indikator-siedlungs-verkehrsflaeche.html"
                        }
                    >
                        Statistisches Bundesamt &quot;Erläuterung und Grafik zum Flächenindikator &quot;Anstieg der
                        Siedlungs- und Verkehrsfläche&quot; [ha/Tag]&quot;
                    </a>
                </p>
                <h1>Sprung in den Daten 2014</h1>
                <p>
                    Da ALB und ALKIS® unterschiedliche Kategorien besitzen, wurden Flächen neu zu geordnet. Dies hat
                    einen Einfluss auf den berechneten Flächenverbrauch. Zum Beispiel zählten Truppenübungsplätze unter
                    ALB zu Grünflächen. In ALKIS® steht es jedem Bundesland frei Truppenübungsplätze als Siedlungsfläche
                    oder als Grünfläche zu kategorisieren. Dadurch kann es passieren, dass der Flächenverbrauch einen
                    Sprung nach unten oder oben macht. Eigene Kategorien Eine Grenze des Projekts war es nur OpenData zu
                    verwenden, dabei haben wir nicht alle Kategorien, sondern größtenteils nur zusammengefasste
                    Kategorien, erhalten.
                </p>
                <h1>Kategorisierung</h1>
                <p>
                    Für das gestapelte Balkendiagramm wurden die ALB- / ALKIS®-Kategorien zu eigenen Bereichen
                    zusammengefasst. Dabei wurde darauf geachtet, dass verbrauchte Flächen nicht mit unverbrauchten
                    Flächen vermischt wurden. Die genaue Aufschlüsselung sieht man im folgenden Diagramm. Von links nach
                    rechts stellen die Spalten die Gesamtfläche, die (un)verbrauchte Fläche, die eigenen Bereiche und
                    die ALB- / ALKIS®-Kategorien dar.
                </p>
            </div>
            <div className={"content-image"}>{isDark ? <SankeyDark /> : <Sankey />}</div>
            <div className={"content-text"}>
                <h1>Quellenangaben</h1>

                <ul>
                    <li>
                        <a href="https://www.statistikdaten.bayern.de/genesis//online?operation=table&code=33111-201r&bypass=true&levelindex=0&levelid=1638273244475#abreadcrumb">
                            Bayrisches Landesamt für Statistik - GENESIS-Online Tabelle 33111-201r
                        </a>
                    </li>
                    <li>
                        <a
                            href="
                            https://www.statistikdaten.bayern.de/genesis//online?operation=table&code=33111-001r&bypass=true&levelindex=0&levelid=1638273260896#abreadcrumb"
                        >
                            Bayrisches Landesamt für Statistik - GENESIS-Online Tabelle 33111-201r
                        </a>
                    </li>
                    <li>
                        <a href="https://gdz.bkg.bund.de/index.php/default/open-data/verwaltungsgebiete-1-250-000-ebenen-stand-31-12-vg250-ebenen-31-12.html">
                            Bundesamt für Kartographie und Geodäsie - Verwaltungsgebiete 1:250 000 (Ebenen), Stand
                            31.12. (VG250 31.12.)
                        </a>
                    </li>
                    <li>
                        <a href="https://www.fontsquirrel.com/license/liberation-mono">
                            2010 Google Corporation with Reserved Font Arimo, Tinos and Cousine; 2012 Red Hat, Inc. with
                            Reserved Font Name Liberation - Liberation Mono
                        </a>
                    </li>
                    <li>
                        <a href="https://feathericons.com/">Feather Icons</a>
                    </li>
                </ul>
            </div>
        </PopupComponent>
    );
};

export default InformationPopup;
