import "../style/WelcomeComponent.scss";
import { Link } from "react-scroll";
import { useEffect, useRef, useState } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import PopupComponent from "./PopupComponent";

const WelcomeComponent = (): JSX.Element => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showPrivacyPolicyPopup, setShowPrivacyPolicyPopup] = useState<boolean | null>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLParagraphElement>(null);
    const subTitleRef = useRef<HTMLParagraphElement>(null);
    const titleContainerRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef<HTMLDivElement>(null);
    const WD = useWindowDimensions();
    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const resize = ({ num, minVal, maxVal }: { num: number; minVal?: number; maxVal?: number }): number => {
            const MIN = minVal || -Infinity;
            const MAX = maxVal || Infinity;
            return Math.min(Math.max(num, MIN), MAX);
        };

        const relPos = (100 / WD.height) * scrollPosition;
        if (backgroundRef.current) {
            backgroundRef.current.style.filter = `blur(${Math.trunc(relPos / 10)}px)`;
        }
        if (
            titleRef.current &&
            subTitleRef.current &&
            titleContainerRef.current &&
            mouseRef.current &&
            quoteRef.current
        ) {
            if (relPos > 85) {
                titleContainerRef.current.style.color = "var(--color-black)";
            } else {
                titleContainerRef.current.style.color = "rgb(28, 28, 30)";
            }

            const titleHeight = WD.height * 0.15;
            const subTitleHeight = WD.height * 0.05;
            titleContainerRef.current.style.top = `${resize({ num: relPos, minVal: 10, maxVal: 100 })}%`;
            subTitleRef.current.style.fontSize = `${resize({
                num: subTitleHeight - ((subTitleHeight - 16) / 100) * relPos,
                minVal: 16,
            })}px`;
            titleRef.current.style.fontSize = `${resize({
                num: titleHeight - ((titleHeight - 45) / 100) * relPos,
                minVal: 45,
            })}px`;
            quoteRef.current.style.opacity = `${100 - relPos * 3}%`;
            mouseRef.current.style.opacity = `${100 - relPos * 2}%`;
            (document.getElementById("required-links") as HTMLDivElement).style.opacity = `${100 - relPos}%`;
            (document.getElementById("image-author") as HTMLDivElement).style.opacity = `${100 - relPos}%`;
        }
    }, [scrollPosition, WD]);

    return (
        <div id={"welcome-container"} className={"welcome-container"}>
            <div className={"welcome-background"} ref={backgroundRef} />
            <div className={"welcome-container"}>
                <div className={"title-container"} ref={titleContainerRef}>
                    <p className={"title"} ref={titleRef}>
                        Betonwüste
                    </p>
                    <p className={"subtitle"} ref={subTitleRef}>
                        Flächenverbrauch Bayerns in Zahlen
                    </p>
                </div>
                <div className={"quote-container"} ref={quoteRef}>
                    <div className={"item quote1"}>
                        <div className={"quotation-mark"} />
                        <p className={"text"}>
                            {
                                "Durch das Wachstum ist die Siedlungs- und Verkehrsfläche von 1980 bis 2017 um mehr als ein Drittel angewachsen."
                            }
                        </p>
                        <p className={"author"}>
                            <i>{"- Planungsverband Äußerer Wirtschaftsraum München"}</i>
                        </p>
                    </div>
                    <div className={"item quote2"}>
                        <div className={"quotation-mark"} />
                        <p className={"text"}>
                            {
                                "Derzeit werden in Bayern täglich 10,8 Hektar Boden für Industriegebiete, Straßen und Siedlungen zubetoniert."
                            }
                        </p>
                        <p className={"author"}>
                            <i>{"- Ludwig Hartmann, Mitglied des Bayerischen Landtags"}</i>
                        </p>
                    </div>
                </div>
            </div>
            <Link to={"main-component"} smooth={true} spy={true}>
                <div className={"mouse-scroll"} ref={mouseRef}>
                    <div className={"mouse"}>
                        <div className={"mouse-in"} />
                    </div>
                    <div className={"mouse-arrow"}>
                        <span className={"down-arrow-1"} />
                        <span className={"down-arrow-2"} />
                        <span className={"down-arrow-3"} />
                    </div>
                </div>
            </Link>
            <div id={"image-author"} className={"image-author"}>
                Foto: Franz Wanner
            </div>
            <div id={"required-links"} className={"required-links"}>
                <button
                    onClick={() => window.open("https://www.hs-augsburg.de/Service/Impressum.html", "_blank")}
                    className={"link"}
                >
                    Impressum
                </button>
                <button onClick={() => setShowPrivacyPolicyPopup(true)} className={"link"}>
                    Datenschutzerklärung
                </button>
                <PopupComponent showPopup={showPrivacyPolicyPopup} setShowPopup={setShowPrivacyPolicyPopup}>
                    <div className={"content-text"}>
                        <h1>Datenschutzerklärung</h1>
                        <p>
                            Unser Hoster erhebt in sog. Logfiles folgende Daten, die Ihr Browser übermittelt:
                            <br />
                            <br />
                            IP-Adresse, die Adresse der vorher besuchten Website (Referer Anfrage-Header), Datum und
                            Uhrzeit der Anfrage, Zeitzonendifferenz zur Greenwich Mean Time, Inhalt der Anforderung,
                            HTTP-Statuscode, übertragene Datenmenge, Website, von der die Anforderung kommt und
                            Informationen zu Browser und Betriebssystem.
                            <br />
                            <br />
                            Das ist erforderlich, um unsere Website anzuzeigen und die Stabilität und Sicherheit zu
                            gewährleisten. Dies entspricht unserem berechtigten Interesse im Sinne des Art. 6 Abs. 1 S.
                            1 lit. f DSGVO.
                            <br />
                            <br />
                            Es erfolgt kein Tracking und wir haben auf diese Daten keinen direkten Zugriff, sondern
                            erhalten lediglich eine anonymisierte, statistische Zusammenfassung. Diese beinhaltet die
                            Adresse der vorher besuchten Seite, die Häufigkeit der jeweils aufgerufenen Seiten und die
                            Anzahl eindeutiger Besucher. Diese Daten führen wir nicht mit anderen Daten zusammen.
                            <br />
                            <br />
                            Wir setzen für die Zurverfügungstellung unserer Website folgenden Hoster ein:
                            <br />
                            <br />
                            GitHub Inc.
                            <br />
                            88 Colin P Kelly Jr St
                            <br />
                            San Francisco, CA 94107
                            <br />
                            United States
                            <br />
                            <br />
                            Dieser ist Empfänger Ihrer personenbezogenen Daten. Dies entspricht unserem berechtigten
                            Interesse im Sinne des Art. 6 Abs. 1 S. 1 lit. f DSGVO, selbst keinen Server in unseren
                            Räumlichkeiten vorhalten zu müssen. Serverstandort ist USA.
                            <br />
                            <br />
                            Weitere Informationen zu Widerspruchs- und Beseitigungsmöglichkeiten gegenüber GitHub finden
                            Sie unter:{" "}
                            <a
                                href={
                                    "https://docs.github.com/en/free-pro-team@latest/github/site-policy/github-privacy-statement#github-pages"
                                }
                            >
                                https://docs.github.com/en/free-pro-team@latest/github/site-policy/github-privacy-statement#github-pages
                            </a>
                            <br />
                            <br />
                            Sie haben das Recht der Verarbeitung zu widersprechen. Ob der Widerspruch erfolgreich ist,
                            ist im Rahmen einer Interessenabwägung zu ermitteln.
                            <br />
                            <br />
                            Die Daten werden gelöscht, sobald der Zweck der Verarbeitung entfällt.
                            <br />
                            <br />
                            Die Verarbeitung der unter diesem Abschnitt angegebenen Daten ist weder gesetzlich noch
                            vertraglich vorgeschrieben. Die Funktionsfähigkeit der Website ist ohne die Verarbeitung
                            nicht gewährleistet.
                            <br />
                            <br />
                            GitHub hat Compliance-Maßnahmen für internationale Datenübermittlungen umgesetzt. Diese
                            gelten für alle weltweiten Aktivitäten, bei denen GitHub personenbezogene Daten von
                            natürlichen Personen in der EU verarbeitet. Diese Maßnahmen basieren auf den
                            EU-Standardvertragsklauseln (SCCs). Weitere Informationen finden Sie unter:{" "}
                            <a
                                href={
                                    "https://docs.github.com/en/free-pro-team@latest/github/site-policy/github-data-protection-addendum#attachment-1–the-standard-contractual-clauses-processors"
                                }
                            >
                                https://docs.github.com/en/free-pro-team@latest/github/site-policy/github-data-protection-addendum#attachment-1–the-standard-contractual-clauses-processors
                            </a>
                        </p>
                    </div>
                </PopupComponent>
            </div>
        </div>
    );
};

export default WelcomeComponent;
