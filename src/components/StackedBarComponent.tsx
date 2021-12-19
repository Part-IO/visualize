import { Component } from "react";
import Chart from "react-apexcharts";
import { districts } from "../utils/Helper";

class StackedBar extends Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    name: "Terrible",
                    data: [4, 55, 41, 37, 22, 43, 21],
                },
                {
                    name: "Poor",
                    data: [5, 32, 33, 52, 13, 43, 32],
                },
                {
                    name: "OK",
                    data: [1, 17, 11, 9, 15, 11, 20],
                },
                {
                    name: "Good",
                    data: [7, 7, 5, 8, 6, 9, 4],
                },
                {
                    name: "Amazing",
                    data: [2, 12, 19, 32, 25, 24, 10],
                },
            ],
            options: {
                colors: [
                    // '#FF9A5B', '#FFCDAC', '#AFAFAF', '#9ECCEB', '#379AD7'
                    "#fc5c65",
                    "#fd9644",
                    "#AFAFAF",
                    "#fed330",
                    "#20bf6b",
                ],
                chart: {
                    type: "bar",
                    stacked: true,
                    stackType: "100%",
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        enableShades: false,
                    },
                },
                stroke: {
                    width: 0,
                    // colors: ['#fff']
                },

                dataLabels: {
                    enabled: true,
                    // formatter: function(val, opts) {
                    //   return opts.w.config.series[opts.seriesIndex].name;
                    // }
                },
                xaxis: {
                    categories: districts,
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + " responses";
                        },
                    },
                },
                legend: {
                    position: "top",
                    horizontalAlign: "center",
                    offsetX: 40,
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
                    type="bar"
                    height={"400%"}
                    width={"100%"}
                />
            </div>
        );
    }
}
//Verstehe die heigth Anzeige leider nicht
export default StackedBar;
