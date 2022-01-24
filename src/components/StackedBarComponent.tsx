import { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { IData } from "../utils/Helper";
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
    const getDataRB: IData = useMemo(() => {
        return RBDataYear[`31.12.${getYear}`].reduce((obj, item) => Object.assign(obj, { [item.AGS]: [item] }), {});
    }, [getYear]);
    const getDataLK: IData = useMemo(() => {
        return LKDataYear[`31.12.${getYear}`].reduce((obj, item) => Object.assign(obj, { [item.AGS]: [item] }), {});
    }, [getYear]);

    const selectedLK = useMemo(() => {
        let sLK;
        const data = Object.values(getDataRB).flat(1);
        const dataLK = Object.values(getDataLK).flat(1);
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
    }, [getDataRB, getDataLK, getDistrict]);
    const options: ApexOptions = useMemo(() => {
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
                    speed: 350,
                    animateGradually: {
                        enabled: false,
                        //delay: 150,
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 150,
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
                    formatter: (val, opts) => {
                        let sumArea = 0;
                        for (let i = 0; i <= 4; i++) {
                            sumArea = sumArea + opts.series[i][opts.dataPointIndex];
                        }
                        if (isAbsolute) {
                            const value = `${Math.round(val)} ha (${(((val as number) / sumArea) * 100).toFixed(1)} %)`;
                            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        } else {
                            const value = `${Math.round(val)} ha (${(((val as number) / sumArea) * 100).toFixed(1)} %)`;
                            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        }
                    },
                },
                x: {
                    formatter: (seriesName) => longNameMap.get(seriesName),
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
        return [
            {
                name: "Wohnen",
                data: selectedLK.map((lkEntry) => lkEntry.living),
            },
            {
                name: "Industrie/Gewerbe",
                data: selectedLK.map((lkEntry) => lkEntry.industry),
            },
            {
                name: "Sonstiges",
                data: selectedLK.map((lkEntry) => lkEntry.misc_industry_living),
            },
            {
                name: "Verkehrsflächen",
                data: selectedLK.map((lkEntry) => lkEntry.transport_infrastructure),
            },
            {
                name: "Natur",
                data: selectedLK.map((lkEntry) => lkEntry.nature),
            },
            {
                name: "Wasser",
                data: selectedLK.map((lkEntry) => lkEntry.water),
            },
            {
                name: "Bergbau",
                data: selectedLK.map((lkEntry) => lkEntry.mining),
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
