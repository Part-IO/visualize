import { useMemo, useState } from "react";
import { IData, IDataEntry } from "../utils/DataLoader";
import Chart from "react-apexcharts";
import SwitchSelector from "react-switch-selector";
import { ApexOptions } from "apexcharts";
import { ICLickedLK } from "./MainComponent";

const StackedBarComponent = ({
    getClickedLK,
    getDataRB,
    getDataLK,
    isAbsolute,
}: {
    getYear: number;
    getClickedLK: ICLickedLK;
    getDataRB: IData;
    getDataLK: IData;
    isAbsolute: boolean;
}): JSX.Element => {
    const [checkedHighlighting, setCheckedHighlighting] = useState<boolean>(false);
    const length = useMemo(() => {
        return (Math.log(parseInt(getClickedLK.AGS)) * Math.LOG10E + 1) | 0;
    }, [getClickedLK]);
    const selectedLK: IDataEntry[] = useMemo(() => {
        const dataLK = Object.values(getDataLK).flat(1);
        if (getClickedLK.GEN == "Bayern") {
            return Object.values(getDataRB).flat(1);
        } else {
            return dataLK.filter(
                (lkEntry) =>
                    Math.trunc(lkEntry.AGS / 100) ===
                    (length > 2 && length <= 4
                        ? Math.trunc(parseInt(getClickedLK.AGS) / 100)
                        : parseInt(getClickedLK.AGS))
            );
        }
    }, [getDataRB, getDataLK, getClickedLK, length]);
    const options: ApexOptions = useMemo(() => {
        return {
            colors: [
                "var(--color-pink)",
                "var(--color-orange)",
                "var(--color-gray-4)",
                "var(--color-green)",
                "var(--color-blue)",
            ],
            chart: {
                toolbar: {
                    show: false,
                },
                type: "bar",
                stacked: true,
                stackType: isAbsolute ? "100%" : "normal",
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 800,
                    animateGradually: {
                        enabled: false,
                        //delay: 150,
                    },
                },
            },
            xaxis: {
                type: "category",
                categories: selectedLK.map((lkEntry) => lkEntry.municipality),
                labels: {
                    style: {
                        colors: "var(--color-black)",
                    },
                },
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                },
            },
            stroke: {
                width: 0,
            },

            dataLabels: {
                enabled: true,
                formatter: (val) => {
                    if (isAbsolute) {
                        return `${Math.round(val as number)} %`;
                    } else {
                        if (val >= 10000) return `${Math.round(val as number)} ha`;
                        else return "";
                    }
                },
                style: {
                    fontFamily: "Liberation Mono",
                    fontSize: "14px",
                },
            },
            zoom: {
                enabled: true,
            },
            tooltip: {
                y: {
                    formatter: (val) => val + " ha",
                },
            },
            responsive: [
                {
                    breakpoint: 100,
                },
            ],
            legend: {
                markers: {
                    onClick() {
                        if (checkedHighlighting) {
                            setCheckedHighlighting(false);
                        } else {
                            setCheckedHighlighting(true);
                        }
                    },
                },
                fontFamily: "Liberation Mono",
                fontSize: "17px",
                position: "top",
                horizontalAlign: "center",
                offsetX: 40,
                onItemHover: {
                    highlightDataSeries: true, //checkedHighlighting,
                },
                onItemClick: {
                    toggleDataSeries: false,
                },
                labels: {
                    colors: "var(--color-black)",
                    useSeriesColors: false,
                },
            },
        };
    }, [selectedLK, isAbsolute, checkedHighlighting]);
    const series = useMemo(() => {
        return [
            {
                name: "Wohnfläche",
                data: selectedLK.map((lkEntry) => lkEntry.living),
            },
            {
                name: "Industriefläche",
                data: selectedLK.map((lkEntry) => lkEntry.industry),
            },
            {
                name: "Transport und Infrastruktur",
                data: selectedLK.map((lkEntry) => lkEntry.transport_infrastructure),
            },
            {
                name: "Natur und Wasser",
                data: selectedLK.map((lkEntry) => lkEntry.nature_and_water),
            },
            {
                name: "Sonstiges",
                data: selectedLK.map((lkEntry) => lkEntry.miscellaneous),
            },
        ];
    }, [selectedLK]);
    return (
        <>
            <div className="break" />
            <div className={"main-view-bar"}>
                <Chart options={options} series={series} type={"bar"} height={"100%"} width={"100%"} />
            </div>
        </>
    );
};

export default StackedBarComponent;
