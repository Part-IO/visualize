import { useCallback, useEffect, useMemo, useState } from "react";
import { IDataEntry } from "../utils/DataLoader";
import Chart from "react-apexcharts";
import SwitchSelector from "react-switch-selector";
import { ApexOptions } from "apexcharts";
import { Colors } from "../utils/Colors";

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
    const initOptions: ApexOptions = useMemo(() => {
        return {
            colors: [Colors.Pink, Colors.Orange, Colors.Black, Colors.Green, Colors.Blue],
            chart: {
                type: "bar",
                stacked: true,
                stackType: "normal",
                animations: {
                    enabled: true,
                    speed: 200,
                    easing: "easeinout",
                    animateGradually: {
                        enabled: false,
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 100,
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
                    if (val >= 10000) return `${Math.round(val as number)} qm`;
                    else return "";
                },
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
                },
            ],
            legend: {
                position: "top",
                horizontalAlign: "center",
                offsetX: 40,
                onItemClick: {
                    toggleDataSeries: false,
                },
            },
        };
    }, []);
    const initSeries = useMemo(() => {
        return [
            {
                name: "Wohnfläche",
                data: [0],
            },
            {
                name: "Industriefläche",
                data: [0],
            },
            {
                name: "Transport und Infrastruktur",
                data: [0],
            },
            {
                name: "Natur und Wasser",
                data: [0],
            },
            {
                name: "Sonstiges",
                data: [0],
            },
        ];
    }, []);
    const [options, setOptions] = useState<ApexOptions>(initOptions);
    const [series, setSeries] = useState(initSeries);
    const switchOptions = [
        {
            label: "Absolut",
            value: false,
            selectedBackgroundColor: Colors.Black,
        },
        {
            label: "Prozentual",
            value: true,
            selectedBackgroundColor: Colors.Black,
        },
    ];
    /*
    Get List with all municipality in one LK
     */
    useEffect(() => {
        const getLK = (municipality: string) => {
            let selectedLK;
            const data = Object.values(getDataRB).flat(1);
            const dataLK = Object.values(getDataLK).flat(1);
            if (municipality == "Bayern") {
                selectedLK = data;
            } else {
                data.forEach((dataEntry) => {
                    if (dataEntry.municipality === municipality) {
                        selectedLK = dataLK.filter(
                            (lkEntry) => Math.trunc(Number(lkEntry.AGS) / 100) === dataEntry.AGS
                        );
                    }
                });
            }
            const districtList: string[] = [];
            for (let i = 0; i < selectedLK.length; i++) {
                districtList.push(selectedLK[i].municipality);
            }
            setOptions((prevOptions) => {
                return {
                    ...prevOptions,
                    xaxis: {
                        categories: districtList,
                    },
                };
            });
            return selectedLK;
        };
        getLK(getDistrict);
    }, [getDataRB, getDataLK, getDistrict, initOptions]);
    /*
    Get data of selected municipality in one LK
     */
    useEffect(() => {
        const getLKData = (municipality: string) => {
            let selectedLK;
            const data = Object.values(getDataRB).flat(1);
            const dataLK = Object.values(getDataLK).flat(1);
            if (municipality == "Bayern") {
                selectedLK = data;
            } else {
                data.forEach((dataEntry) => {
                    if (dataEntry.municipality === municipality) {
                        selectedLK = dataLK.filter(
                            (lkEntry) => Math.trunc(Number(lkEntry.AGS) / 100) === dataEntry.AGS
                        );
                    }
                });
            }
            const livingData: number[] = [];
            const industryData: number[] = [];
            const transportData: number[] = [];
            const natureData: number[] = [];
            const miscellaneousData: number[] = [];
            for (let i = 0; i < selectedLK.length; i++) {
                livingData.push(selectedLK[i].living);
                industryData.push(selectedLK[i].industry);
                transportData.push(selectedLK[i].transport_infrastructure);
                natureData.push(selectedLK[i].nature_and_water);
                miscellaneousData.push(selectedLK[i].miscellaneous);
            }
            setSeries(() => [
                {
                    name: "Wohnfläche",
                    data: livingData,
                },
                {
                    name: "Industriefläche",
                    data: industryData,
                },
                {
                    name: "Transport und Infrastruktur",
                    data: transportData,
                },
                {
                    name: "Natur und Wasser",
                    data: natureData,
                },
                {
                    name: "Sonstiges",
                    data: miscellaneousData,
                },
            ]);
        };
        getLKData(getDistrict);
    }, [getDataRB, getDataLK, getDistrict, initOptions]);
    /*
    Button switch state function
     */
    const [, setChecked] = useState<boolean>(false);
    const handleChange = useCallback(
        (state: boolean) => {
            console.log(state);
            setChecked(state);
            setOptions(
                state
                    ? (prevOptions) => {
                          return {
                              ...prevOptions,
                              chart: { stackType: "100%" },
                              dataLabels: {
                                  formatter: (val) => `${Math.round(val as number)}%`,
                              },
                          };
                      }
                    : initOptions
            );
        },
        [initOptions]
    );

    return (
        <div className={"stackedBarComponent"}>
            <div className={"switch"}>
                <SwitchSelector
                    onChange={(state) => handleChange(state as boolean)}
                    options={switchOptions}
                    backgroundColor={"white"}
                    fontColor={"black"}
                    border="1px solid black"
                />
            </div>
            <div className={"main-view-bar"}>
                <Chart options={options} series={series} type="bar" height={"100%"} width={"100%"} />
            </div>
        </div>
    );
};

export default StackedBarComponent;
