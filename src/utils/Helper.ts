export const prevAll = (element: HTMLDivElement): HTMLDivElement[] => {
    const result: HTMLDivElement[] = [];

    while ((element = element.previousElementSibling as HTMLDivElement)) result.push(element);
    return result;
};

export const parseDate = (input: string) => {
    const parts = input.match(/(\d+)/g) as RegExpMatchArray;
    // note parts[1]-1
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
};

export const districts = [
    "Mittelfranken",
    "Niederbayern",
    "Oberbayern",
    "Oberfranken",
    "Oberpfalz",
    "Schwaben",
    "Unterfranken",
];

export enum LayerTypes {
    Regierungsbezirk,
    Landkreis,
}
