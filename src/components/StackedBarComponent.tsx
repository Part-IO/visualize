import { useCallback, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { districts } from "../utils/Helper";
import Switch from "react-switch";
import "../style/StackedBarComponent.scss";
import { ApexOptions } from "apexcharts";

function StackedBar(): JSX.Element {
    const initOptions: ApexOptions = useMemo(() => {
        return {
            colors: ["#fc5c65", "#fd9644", "#AFAFAF", "#fed330", "#20bf6b"],
            chart: {
                type: "bar",
                stacked: true,
                stackType: "normal",
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
                // formatter: function(val, opts) {
                //   return opts.w.config.series[opts.seriesIndex].name;
                // }
            },
            xaxis: {
                categories: districts,
            },
            zoom: {
                enabled: true,
            },
            tooltip: {
                y: {
                    formatter: (val) => val + " responses",
                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: "top",
                            horizontalAlign: "center",
                            offsetX: 40,
                        },
                    },
                },
            ],
        };
    }, []);
    const initSeries = useMemo(() => {
        return [
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
        ];
    }, []);

    const [options, setOptions] = useState<ApexOptions>(initOptions);
    const [series, setSeries] = useState(initSeries);
    const [checked, setChecked] = useState<boolean>(false);

    const handleChange = useCallback((state: boolean) => {
        console.log(state);
        setChecked(state);
        setOptions(
            state
                ? (prevOptions) => ({ ...prevOptions, chart: { stackType: "100%" } })
                : (prevOptions) => ({ ...prevOptions, chart: { stackType: "normal" } })
        );
    }, []);

    return (
        <div className={"container"}>
            <div className={"flexbox"}>
                <Switch
                    onChange={(state) => handleChange(state)}
                    checked={checked}
                    className={"switch"}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    height={20}
                    width={50}
                />
                <p> Regierungsbezirke </p>
            </div>
            <div className={"chart"}>
                <Chart options={options} series={series} type="bar" height={"100%"} width={"100%"} />
            </div>
        </div>
    );
}

export default StackedBar;
