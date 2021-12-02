import "../style/WelcomeComponent.scss";
import { Link } from "react-scroll";

const WelcomeComponent = () => {
    return (
        <div className={"welcome"}>
            <div className={"title-container"}>
                <p className={"title"}>Betonwüste</p>
                <p className={"subtitle"}>Flächenverbrauch Bayerns in Zahlen</p>
            </div>
            <Link to={"main-component"} smooth={true} spy={true}>
                <div className={"mouse-scroll"}>
                    <div className={"mouse"}>
                        <div className={"mouse-in"} />
                    </div>
                    <div>
                        <span className={"down-arrow-1"} />
                        <span className={"down-arrow-2"} />
                        <span className={"down-arrow-3"} />
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default WelcomeComponent;
