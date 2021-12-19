import data from "../data/data.json";

interface IDataEntry {
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
};

export type GroupByTypes = typeof GroupBy[keyof typeof GroupBy];

class DataLoader {
    private readonly groupByKey: string;

    private readonly groupByName;

    constructor(groupByKey: GroupByTypes) {
        this.groupByKey = groupByKey.toString();
        this.groupByName = this.groupBy(this.groupByKey);
    }

    private groupBy = (key: string) => (array: IDataEntry[]) =>
        array.reduce(
            (objectsByKeyValue, obj: IDataEntry) => ({
                ...objectsByKeyValue,
                [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj),
            }),
            {}
        );

    GetDistricts = (): { [p: string | number]: IDataEntry } => {
        return this.groupByName(
            data.filter((entry: IDataEntry) => {
                return entry.AGS.toString().length == 2;
            })
        );
    };

    GetGovernmentDistricts = (): { [p: string | number]: IDataEntry } => {
        return this.groupByName(
            data.filter((entry: IDataEntry) => {
                return entry.AGS.toString().length == 4;
            })
        );
    };
}

export default DataLoader;
