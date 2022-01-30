import { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import RBDataYear from "../data/RBYear.json";
import LKDataYear from "../data/LKYear.json";
import { longNameMap } from "../utils/LookUp";

const StackedBarComponent = ({
    getYear,
    getDistrict,
    isAbsolute,
    isDark,
}: {
    getYear: number;
    getDistrict: string;
    isAbsolute: boolean;
    isDark: boolean;
}): JSX.Element => {
    const selectedLK = useMemo(() => {
        let sLK;
        const data = RBDataYear[`31.12.${getYear}`];
        const dataLK = LKDataYear[`31.12.${getYear}`];
        if (getDistrict == "Bayern") {
            sLK = data;
        } else {
            data.forEach((dataEntry) => {
                if (dataEntry.municipality === getDistrict) {
                    sLK = dataLK.filter((lkEntry) => Math.trunc(Number(lkEntry.AGS) / 100) === dataEntry.AGS);
                }
            });
        }
        return sLK;
    }, [getYear, getDistrict]);

    const options: ApexOptions = useMemo(() => {
        const notRoundedMax = Math.max(...selectedLK.map((entry) => entry.total));
        const factor = Math.pow(10, Math.ceil(Math.log10(notRoundedMax) - 2));
        const roundedMax = Math.ceil(notRoundedMax / factor) * factor;

        return {
            colors: [
                "var(--color-pink)",
                "var(--color-orange)",
                "var(--color-yellow)",
                "var(--color-gray-1)",
                "var(--color-green)",
                "var(--color-blue)",
                "var(--color-purple)",
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
                    speed: 250,
                    animateGradually: {
                        enabled: false,
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 250,
                    },
                },
                background: "rgba(0,0,0,0)",
                fontFamily: "Liberation Mono !important",
            },
            xaxis: {
                type: "category",
                categories: selectedLK.map((lkEntry) => lkEntry.municipality_short),
                labels: {
                    style: {
                        colors: "var(--color-black)",
                        fontSize: "12px",
                    },
                    formatter: function (value) {
                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    },
                },
                max: isAbsolute ? 100 : roundedMax,
            },
            yaxis: {
                labels: {
                    minWidth: 140,
                    maxWidth: 140,
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
                        const value = `${Math.round(val as number)} %`;
                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    } else {
                        if ((val >= 700000 && getDistrict == "Bayern") || (val >= 10000 && getDistrict != "Bayern")) {
                            const value = `${Math.round(val as number)} ha`;
                            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        } else return "";
                    }
                },
                style: {
                    fontSize: "12px", //Nummern imBarplot
                },
            },
            zoom: {
                enabled: true,
            },
            tooltip: {
                y: {
                    formatter(val, opts) {
                        let sumArea = 0;
                        opts.series.forEach((entry) => (sumArea += entry[opts.dataPointIndex]));
                        const value = `${Math.round(val)} ha (${(((val as number) / sumArea) * 100).toFixed(1)} %)`;
                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    },
                },
                x: {
                    formatter(seriesName) {
                        return longNameMap.get(seriesName.toString()) as string;
                    },
                },
            },
            responsive: [
                {
                    breakpoint: 100,
                },
            ],
            legend: {
                fontSize: "16px", //Anzeige verschiedene Flächen
                position: "top",
                horizontalAlign: "center",
                offsetX: 40,
                onItemHover: {
                    highlightDataSeries: true,
                },
                onItemClick: {
                    toggleDataSeries: false,
                },
                labels: {
                    colors: "var(--color-black)",
                    useSeriesColors: false,
                },
            },
            theme: {
                mode: isDark ? "dark" : "light",
            },
        };
    }, [selectedLK, isAbsolute, isDark, getDistrict]);
    const series = useMemo(() => {
        const transposedSelectedLK = Object.fromEntries(
            Object.keys(selectedLK[0]).map((key) => [key, selectedLK.map((o) => o[key])])
        );

        return [
            {
                name: "Wohnen",
                data: transposedSelectedLK.living,
            },
            {
                name: "Industrie/Gewerbe",
                data: transposedSelectedLK.industry,
            },
            {
                name: "Sonstiges",
                data: transposedSelectedLK.misc_industry_living,
            },
            {
                name: "Verkehrsflächen",
                data: transposedSelectedLK.transport_infrastructure,
            },
            {
                name: "Natur",
                data: transposedSelectedLK.nature,
            },
            {
                name: "Wasser",
                data: transposedSelectedLK.water,
            },
            {
                name: "Bergbau",
                data: transposedSelectedLK.mining,
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
