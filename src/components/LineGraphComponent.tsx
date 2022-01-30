import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dispatch, SetStateAction, useMemo } from "react";
import data from "../data/data.json";
import { ICLickedLK } from "./MainComponent";
import { IDataEntry } from "../utils/Helper";

const LineGraphComponent = ({
    getClickedLK,
    getCurrentYear,
    isDark,
    handleModalClick,
    handleModalClick2,
    setCurrentYear,
}: {
    getClickedLK: ICLickedLK;
    getCurrentYear: number;
    isDark: boolean;
    handleModalClick: () => void;
    handleModalClick2: () => void;
    setCurrentYear: Dispatch<SetStateAction<number>>;
}): JSX.Element => {
    const getSelectedData = useMemo(() => {
        return data.filter((entry: IDataEntry) => entry.AGS == parseInt(getClickedLK.AGS));
    }, [getClickedLK]);

    /**
     * calculate the used Area for every year
     */
    const usedAreaSeries = useMemo(() => {
        const usedAreaData = getSelectedData.map((entry: IDataEntry) => {
            const [day, month, year] = entry.date.split(".");

            return {
                x: year + "-" + month + "-" + day,
                y: entry.used_area_percent * 100,
            };
        });

        return [
            {
                name: "Verbrauchte Fläche",
                data: usedAreaData,
            },
        ];
    }, [getSelectedData]);
    const options: ApexOptions = useMemo<ApexOptions>(() => {
        return {
            chart: {
                // height: 350,
                type: "line",
                id: "linechart",
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
                background: "rgba(0,0,0,0)",
                events: {
                    markerClick: (event, chartContext, config) => {
                        const date = new Date(chartContext.data.twoDSeriesX[config.dataPointIndex]).getFullYear();
                        setCurrentYear(Math.round(date / 4) * 4);
                    },
                    click: (e) => {
                        if (e.target.innerHTML === " ⚠ ") {
                            handleModalClick2();
                        } else if (e.target.innerHTML === "⚠") {
                            handleModalClick();
                        }
                    },
                },
                fontFamily: "Liberation Mono !important",
            },
            annotations: {
                xaxis: [
                    {
                        id: "warn",
                        x: new Date("2013-12-31").getTime(),
                        strokeDashArray: 0,
                        borderColor: "var(--color-yellow)",
                        label: {
                            borderColor: "var(--color-yellow)",
                            borderWidth: 0,
                            offsetY: -10,
                            style: {
                                fontFamily: "Liberation Mono",
                                color: "var(--color-yellow)",
                                background: "rgba(0,0,0,0)",
                                cssClass: "line-chart-label-warn",
                            },
                            text: "⚠",
                            orientation: "horizontal",
                        },
                    },
                    {
                        id: "warn",
                        x: new Date("1994-12-31").getTime(),
                        strokeDashArray: 0,
                        borderColor: "var(--color-yellow)",
                        label: {
                            borderColor: "var(--color-yellow)",
                            borderWidth: 0,
                            offsetY: -10,
                            style: {
                                fontFamily: "Liberation Mono",
                                color: "var(--color-yellow)",
                                background: "rgba(0,0,0,0)",
                                cssClass: "line-chart-label-warn",
                            },
                            // The extra spaces are deliberate to discern the two annotations
                            text: " ⚠ ",
                            orientation: "horizontal",
                        },
                    },
                    {
                        x: new Date(getCurrentYear + "-12-31").getTime(),
                        strokeDashArray: 0,
                        borderColor: "var(--color-black)",
                        label: {
                            borderColor: "var(--color-black)",
                            style: {
                                color: "var(--color-white)",
                                background: "var(--color-black)",
                            },
                            text: "Aktuell",
                        },
                    },
                ],
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "straight",
            },
            grid: {
                padding: {
                    right: 30,
                    left: 20,
                },
            },
            legend: {
                show: true,
                showForSingleSeries: true,
                fontSize: "16px",
                position: "top",
                horizontalAlign: "center",
                onItemClick: {
                    toggleDataSeries: false,
                },
            },
            // title: {
            //     text: "Line with Annotations",
            //     align: "left",
            // },
            // labels: filteredData.map((e) => new Date(e.date).getTime()),
            xaxis: {
                type: "datetime",
                labels: {
                    formatter: (value) => new Date(value).getFullYear().toString(),
                    style: {
                        fontSize: "12px",
                    },
                },
            },
            yaxis: {
                min: 0,
                max: 100,
                tickAmount: 5,
                decimalsInFloat: 0,
                labels: {
                    formatter: (value) => value + "%",
                    style: {
                        fontSize: "12px",
                    },
                },
            },
            tooltip: {
                enabled: true,
                x: {
                    show: true,
                    format: "dd.MMM.yyyy",
                },
                y: {
                    formatter: (value) => value.toFixed(2) + "%",
                },
            },
            theme: {
                mode: isDark ? "dark" : "light",
            },
        };
    }, [getCurrentYear, isDark, handleModalClick, handleModalClick2, setCurrentYear]);

    return <Chart options={options} series={usedAreaSeries} type="line" height={"100%"} width={"100%"} />;
};

export default LineGraphComponent;
