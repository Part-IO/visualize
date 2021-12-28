import { Component } from "react";
import Chart from "react-apexcharts";
import data from "../data/data.json";
import { IDataEntry } from "../utils/DataLoader";

class LineGraph extends Component<any, any> {
    constructor(props) {
        super(props);

        const ags = "9";

        const series = data
            .filter((entry: IDataEntry) => {
                return entry.AGS.toString() == ags;
            })
            .map((entry: IDataEntry) => {
                const [day, month, year] = entry.date.split(".");

                return {
                    x: year + "-" + month + "-" + day,
                    y: entry.used_area_percent,
                };
            });

        console.log(series);

        this.state = {
            series: [
                {
                    data: series,
                },
            ],
            options: {
                chart: {
                    height: 350,
                    type: "line",
                    id: "linechart",
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
                title: {
                    text: "Line with Annotations",
                    align: "left",
                },
                // labels: filteredData.map((e) => new Date(e.date).getTime()),
                xaxis: {
                    type: "datetime",
                },
                yaxis: {
                    min: 0,
                    max: 1,
                },
            },
        };
    }

    render() {
        return (
            <div id="chart">
                <Chart
                    options={this.state.options}
                    series={this.state.series}
                    type="line"
                    height={"400%"}
                    width={"100%"}
                />
            </div>
        );
    }
}

export default LineGraph;
