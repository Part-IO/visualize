import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import data from "../data/data.json";
import { ICLickedLK } from "./MainComponent";
import { IDataEntry } from "../utils/Helper";

const LineGraphComponent = ({
    getClickedLK,
    getCurrentYear,
    isDark,
}: {
    getClickedLK: ICLickedLK;
    getCurrentYear: number;
    isDark: boolean;
}): JSX.Element => {
    const getSelectedData = useMemo(() => {
        return data.filter((entry: IDataEntry) => entry.AGS == parseInt(getClickedLK.AGS));
    }, [getClickedLK]);

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
            },
            annotations: {
                xaxis: [
                    {
                        x: new Date("2014-12-31").getTime(),
                        strokeDashArray: 0,
                        borderColor: "var(--color-black)",
                        label: {
                            borderColor: "var(--color-black)",
                            style: {
                                color: "var(--color-white)",
                                background: "var(--color-black)",
                            },
                            text: "ALB -> ALKIS Umstellung",
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
                        fontFamily: "Liberation mono",
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
                        fontFamily: "Liberation mono",
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
    }, [getCurrentYear, isDark]);

    return <Chart options={options} series={usedAreaSeries} type="line" height={"100%"} width={"100%"} />;
};

export default LineGraphComponent;
