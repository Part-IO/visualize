import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import Switch from "react-switch";
import { ApexOptions } from "apexcharts";
import DataLoader, { GroupBy, groupBy, IDataEntry } from "../utils/DataLoader";
import { districts, types } from "../utils/Helper";

interface IData {
    [p: string | number]: IDataEntry[];
}

const StackedBarComponent = ({ getYear, getDistrict }: { getYear: number; getDistrict: string }): JSX.Element => {
    const initOptions: ApexOptions = useMemo(() => {
        return {
            colors: ["#fc5c65", "#fd9644", "#AFAFAF", "#fed330", "#20bf6b"],
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
                    if (val >= 5) return `${Math.round(val as number)} ha`;
                    else return "";
                },
            },
            xaxis: {
                categories: "",
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
    const [getDataRB] = useState<IData>(
        groupBy(GroupBy.AGS)(new DataLoader(GroupBy.AGS).GetDistricts().getDataForYear(1980))
    );
    const [getDataLK] = useState<IData>(
        groupBy(GroupBy.AGS)(new DataLoader(GroupBy.AGS).GetGovernmentDistricts().getDataForYear(1980))
    );

    /*
    Helper function to get all areas within selected LK
     */
    useEffect(() => {
        const getLK = (municipality: string) => {
            // So far Bayern is not implemented
            if (municipality != "Bayern") {
                let selectedLK;
                const data = Object.values(getDataRB).flat(1);
                const dataLK = Object.values(getDataLK).flat(1);
                data.forEach((dataEntry) => {
                    if (dataEntry.municipality === municipality) {
                        selectedLK = dataLK.filter(
                            (lkEntry) => Math.trunc(Number(lkEntry.AGS) / 100) === dataEntry.AGS
                        );
                    }
                });
                const districtList: string[] = [];
                console.log(selectedLK.length);
                for (let i = 0; i < selectedLK.length; i++) {
                    districtList.push(selectedLK[i].municipality);
                }
                console.log(districtList);
                setOptions((prevOptions) => {
                    return {
                        ...prevOptions,
                        xaxis: {
                            categories: districtList,
                        },
                    };
                });
                return selectedLK;
            }
        };
        console.log(getLK(getDistrict));
    }, [getDataRB, getDataLK, getDistrict, initOptions]);

    /*
    Button switch state function
     */
    const [checked, setChecked] = useState<boolean>(false);
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
                                  formatter: (val, opts) => `${Math.round(val as number)}%`,
                              },
                          };
                      }
                    : initOptions
            );
        },
        [initOptions]
    );

    return (
        <div>
            <Switch
                onChange={(state) => handleChange(state)}
                checked={checked}
                className={"switch"}
                checkedIcon={false}
                uncheckedIcon={false}
                height={20}
                width={50}
            />
            <div>
                <Chart options={options} series={series} type="bar" height={"375%"} width={"100%"} />
            </div>
        </div>
    );
};

export default StackedBarComponent;
