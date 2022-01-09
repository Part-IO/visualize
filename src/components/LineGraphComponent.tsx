import Chart from "react-apexcharts";
import { IDataEntry } from "../utils/DataLoader";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";

const LineGraphComponent = ({
    getSelectedData,
    getCurrentYear,
}: {
    getSelectedData: IDataEntry[];
    getCurrentYear: number;
}): JSX.Element => {
    const [getSeries, setSeries] = useState<Array<{ name?: string; data: Array<{ x: any; y: any }> }>>(() => {
        const usedAreaData = getSelectedData.map((entry: IDataEntry) => {
            const [day, month, year] = entry.date.split(".");

            return {
                x: year + "-" + month + "-" + day,
                y: entry.used_area_percent * 100,
            };
        });

        const usedAreaSeries = {
            name: "Verbrauchte Fläche",
            data: usedAreaData,
        };

        return [usedAreaSeries];
    });
    const [getOptions, setOptions] = useState<ApexOptions>(() => {
        const options: ApexOptions = {
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
            },
            annotations: {
                yaxis: [],
                xaxis: [
                    {
                        x: new Date("2014-12-31").getTime(),
                        strokeDashArray: 0,
                        borderColor: "#775DD0",
                        label: {
                            borderColor: "#775DD0",
                            style: {
                                color: "#fff",
                                background: "#775DD0",
                            },
                            text: "ALB -> ALKIS Umstellung",
                        },
                    },
                    {
                        x: new Date(getCurrentYear + "-12-31").getTime(),
                        strokeDashArray: 0,
                        borderColor: "#775DD0",
                        label: {
                            borderColor: "#775DD0",
                            style: {
                                color: "#fff",
                                background: "#775DD0",
                            },
                            // text: "Aktuell",
                        },
                    },
                ],
                points: [],
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
            },
            yaxis: {
                min: 0,
                max: 100,
                tickAmount: 5,
                decimalsInFloat: 0,
                labels: {
                    formatter: (value) => value + "%",
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
        };

        return options;
    });

    useEffect(() => {
        const usedAreaData = getSelectedData.map((entry: IDataEntry) => {
            const [day, month, year] = entry.date.split(".");

            return {
                x: year + "-" + month + "-" + day,
                y: entry.used_area_percent * 100,
            };
        });

        const usedAreaSeries = {
            name: "Verbrauchte Fläche",
            data: usedAreaData,
        };

        setSeries([usedAreaSeries]);
    }, [getSelectedData]);

    useEffect(() => {
        const options: ApexOptions = {
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
            },
            annotations: {
                yaxis: [],
                xaxis: [
                    {
                        x: new Date("2014-12-31").getTime(),
                        strokeDashArray: 0,
                        borderColor: "#775DD0",
                        label: {
                            borderColor: "#775DD0",
                            style: {
                                color: "#fff",
                                background: "#775DD0",
                            },
                            text: "ALB -> ALKIS Umstellung",
                        },
                    },
                    {
                        x: new Date(getCurrentYear + "-12-31").getTime(),
                        strokeDashArray: 0,
                        borderColor: "#775DD0",
                        label: {
                            borderColor: "#775DD0",
                            style: {
                                color: "#fff",
                                background: "#775DD0",
                            },
                            // text: "Aktuell",
                        },
                    },
                ],
                points: [],
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
            },
            yaxis: {
                min: 0,
                max: 100,
                tickAmount: 5,
                decimalsInFloat: 0,
                labels: {
                    formatter: (value) => value + "%",
                },
            },
            tooltip: {
                enabled: true,
                x: {
                    show: true,
                    format: "dd.MM.yyyy",
                },
                y: {
                    formatter: (value) => value.toFixed(2) + "%",
                },
            },
        };

        setOptions(options);
    }, [getCurrentYear]);

    return <Chart options={getOptions} series={getSeries} type="line" height={"100%"} width={"100%"} />;
};

export default LineGraphComponent;
