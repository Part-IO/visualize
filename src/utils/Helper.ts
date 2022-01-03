export const prevAll = (element: HTMLDivElement): HTMLDivElement[] => {
    const result: HTMLDivElement[] = [];

    while ((element = element.previousElementSibling as HTMLDivElement)) result.push(element);
    return result;
};

export const parseDate = (input: string): Date => {
    const parts = input.match(/(\d+)/g) as RegExpMatchArray;
    // note parts[1]-1
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
};

export const districts = [
    "Bayern",
    "Mittelfranken",
    "Niederbayern",
    "Oberbayern",
    "Oberfranken",
    "Oberpfalz",
    "Schwaben",
    "Unterfranken",
];

export const years = [1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020];

export enum LayerTypes {
    Regierungsbezirk,
    Landkreis,
}
