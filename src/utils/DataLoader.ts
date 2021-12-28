import data from "../data/data.json";
import { parseDate } from "./Helper";

export interface IDataEntry {
    AGS: number;
    municipality: string;
    total: number;
    date: string;
    living: number;
    living_percent: number;
    industry: number;
    industry_percent: number;
    transport_infrastructure: number;
    transport_infrastructure_percent: number;
    nature_and_water: number;
    nature_and_water_percent: number;
    miscellaneous: number;
    miscellaneous_percent: number;
    used_area: number;
    used_area_percent: number;
    demographic: number;
}

const literal = <L extends string | number | boolean>(l: L) => l;

export const GroupBy = {
    municipality: literal("municipality"),
    AGS: literal("AGS"),
    date: literal("date"),
    usedAreaPercent: literal("used_area_percent"),
};

/**
 * Group list of object base on keys
 */

export const groupBy =
    (key: string) =>
    (array: IDataEntry[]): { [p: number]: IDataEntry[] } =>
        array.reduce(
            (objectsByKeyValue, obj: IDataEntry) => ({
                ...objectsByKeyValue,
                [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj),
            }),
            {}
        );

export type GroupByTypes = typeof GroupBy[keyof typeof GroupBy];

class DataLoader {
    private readonly groupByKey: string;

    private readonly groupByKeyFunction;

    constructor(groupByKey: GroupByTypes) {
        this.groupByKey = groupByKey.toString();
        this.groupByKeyFunction = groupBy(this.groupByKey);
    }

    /**
     * Return the districts from the dataset as a grouped object
     * @return  { [p: string | number]: IDataEntry[] }    Dictionary with grouped IDataEntry lists
     */

    GetDistricts = (): {
        data: IDataEntry[];
        groupBy: () => { [p: string | number]: IDataEntry[] };
        getDataForYear: (year: number) => IDataEntry[];
    } => {
        const districts = data.filter((entry: IDataEntry) => entry.AGS.toString().length == 2);

        const groupByFunc = () => {
            return this.groupByKeyFunction(districts);
        };

        const getDataForYear = (year: number): IDataEntry[] => {
            return this.GetDataForYear(year, districts);
        };

        return { data: districts, groupBy: groupByFunc, getDataForYear: getDataForYear };
    };
    /**
     * Return teh government districts from the dataset as a grouped object
     * @return  { [p: string | number]: IDataEntry[] }    Dictionary with grouped IDataEntry lists
     */

    GetGovernmentDistricts = (): {
        data: IDataEntry[];
        groupBy: () => { [p: string | number]: IDataEntry[] };
        getDataForYear: (year: number) => IDataEntry[];
    } => {
        const governmentDistricts = data.filter((entry: IDataEntry) => entry.AGS.toString().length == 4);

        const groupByFunc = () => {
            return this.groupByKeyFunction(governmentDistricts);
        };

        const getDataForYear = (year: number): IDataEntry[] => {
            return this.GetDataForYear(year, governmentDistricts);
        };

        return { data: governmentDistricts, groupBy: groupByFunc, getDataForYear: getDataForYear };
    };

    GetAll = (): IDataEntry[] => {
        return data;
    };

    GetDataForYear = (year: number, dataSet: IDataEntry[]): IDataEntry[] => {
        const groupByYearFunction = groupBy("date");
        const tempData: { [p: string | number]: IDataEntry[] } = groupByYearFunction(dataSet);
        const keys = Object.keys(tempData);
        const currentKey: string = keys.find((key) => parseDate(key).getFullYear() === year) as string;
        return tempData[currentKey];
    };
}

export default DataLoader;
