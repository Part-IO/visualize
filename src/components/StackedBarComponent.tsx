import { useMemo, useState } from "react";
import { IDataEntry } from "../utils/DataLoader";
import Chart from "react-apexcharts";
import SwitchSelector from "react-switch-selector";
import { ApexOptions } from "apexcharts";

interface IData {
    [p: string | number]: IDataEntry[];
}

const StackedBarComponent = ({
    getDistrict,
    getDataRB,
    getDataLK,
}: {
    getYear: number;
    getDistrict: string;
    getDataRB: IData;
    getDataLK: IData;
}): JSX.Element => {
    const [checked, setChecked] = useState<boolean>(false);
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
                "var(--color-gray-4)",
                "var(--color-green)",
                "var(--color-blue)",
            ],
            chart: {
                type: "bar",
                stacked: true,
                stackType: checked ? "100%" : "normal",
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
                    if (checked) {
                        return `${Math.round(val as number)}%`;
                    } else {
                        if (val >= 10000) return `${Math.round(val as number)} m²`;
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
                    formatter: (val) => val + " m²",
                },
            },
            responsive: [
                {
                    breakpoint: 100,
                },
            ],
            legend: {
                fontFamily: "Liberation Mono",
                fontSize: "17px",
                position: "top",
                horizontalAlign: "center",
                offsetX: 40,
                onItemClick: {
                    toggleDataSeries: false,
                },
                labels: {
                    colors: "var(--color-black)",
                    useSeriesColors: false,
                },
            },
        };
    }, [selectedLK, checked]);
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
    const switchOptions = [
        {
            label: "Absolut",
            value: false,
            selectedBackgroundColor: "var(--color-black)",
        },
        {
            label: "Prozentual",
            value: true,
            selectedBackgroundColor: "var(--color-black)",
        },
    ];
    return (
        <>
            <div className={"switch"}>
                <SwitchSelector
                    onChange={(state) => setChecked(state as boolean)}
                    options={switchOptions}
                    backgroundColor={"var(--color-white)"}
                    fontColor={"var(--color-black)"}
                    border={"1px solid var(--color-black)"}
                    optionBorderRadius={4}
                    wrapperBorderRadius={4}
                    selectedFontColor={"var(--color-white)"}
                />
            </div>
            <div className="break" />
            <div className={"main-view-bar"}>
                <Chart options={options} series={series} type={"bar"} height={"100%"} width={"100%"} />
            </div>
        </>
    );
};

export default StackedBarComponent;
